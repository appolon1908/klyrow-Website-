from __future__ import annotations

import copy
import hashlib
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
RUNTIME = ROOT / "ops/gitops/environments/production/runtime-paths.json"
POLICY = ROOT / "ops/gitops/environments/production/deployment-policy.json"
EXAMPLE = ROOT / "ops/gitops/environments/production/release-intent.example.json"
VALIDATE_RUNTIME = ROOT / "ops/gitops/scripts/validate-runtime-paths.py"
VALIDATE_INTENT = ROOT / "ops/gitops/scripts/validate-release-intent.py"
PLAN = ROOT / "ops/gitops/scripts/plan-deployment.sh"


def run(*args: str, check: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=ROOT, text=True, capture_output=True, check=check)


class GitOpsValidatorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.policy = json.loads(POLICY.read_text())
        self.runtime = json.loads(RUNTIME.read_text())
        self.intent = json.loads(EXAMPLE.read_text())

    def tearDown(self) -> None:
        self.temp.cleanup()

    def write(self, name: str, value: object) -> Path:
        path = self.directory / name
        path.write_text(json.dumps(value, indent=2) + "\n")
        return path

    def verified_runtime(self) -> dict[str, object]:
        runtime = copy.deepcopy(self.runtime)
        runtime.update(
            {
                "status": "verified",
                "verified_at": "2026-08-26T00:00:00Z",
                "verified_by": "independent-reviewer",
            }
        )
        runtime["host"].update(
            {
                "hostname": "provider.example.internal",
                "machine_id_sha256": "1" * 64,
            }
        )
        runtime["runtime"].update(
            {
                "release_root": "/srv/klyrow-website",
                "secrets_root": "/srv/klyrow-website/secrets",
                "compose_file": "/srv/klyrow-website/config/docker-compose.production.yml",
                "nginx_root": "/etc/nginx",
                "legacy_nginx_site": "/etc/nginx/sites-available/klyrow.conf",
                "nginx_binary": "/usr/sbin/nginx",
                "docker_binary": "/usr/bin/docker",
                "operator_path": "/usr/local/libexec/klyrow-website-gitops-operator",
            }
        )
        runtime["evidence"].update(
            {
                "discovery_artifact_sha256": "2" * 64,
                "reviewed_pr": 100,
            }
        )
        return runtime

    def approved_intent(self, runtime_path: Path) -> dict[str, object]:
        intent = copy.deepcopy(self.intent)
        intent.update(
            {
                "status": "approved",
                "intent_commit": "3" * 40,
                "release_sha": "4" * 40,
                "image": "ghcr.io/appolon1908-hue/klyrow-website@sha256:" + "5" * 64,
                "sbom_sha256": "6" * 64,
                "runtime_paths_sha256": hashlib.sha256(runtime_path.read_bytes()).hexdigest(),
                "staging_evidence_sha256": "7" * 64,
                "rollback_evidence_sha256": "8" * 64,
                "created_by": "independent-reviewer",
            }
        )
        for index, item in enumerate(intent["reviewed_pull_requests"], start=1):
            item["head_sha"] = f"{index:040x}"[-40:]
        return intent

    def test_unverified_runtime_passes_plan_and_blocks_apply(self) -> None:
        plan = run("python3", str(VALIDATE_RUNTIME), str(RUNTIME), str(POLICY), "--mode", "plan")
        self.assertEqual(plan.returncode, 0, plan.stderr)
        self.assertIn("APPLY_BLOCKED=YES", plan.stdout)
        apply = run("python3", str(VALIDATE_RUNTIME), str(RUNTIME), str(POLICY), "--mode", "apply")
        self.assertNotEqual(apply.returncode, 0)
        self.assertIn("runtime_paths_not_verified", apply.stderr)

    def test_verified_runtime_accepts_approved_roots(self) -> None:
        runtime_path = self.write("runtime.json", self.verified_runtime())
        result = run("python3", str(VALIDATE_RUNTIME), str(runtime_path), str(POLICY), "--mode", "apply")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("APPLY_BLOCKED=NO", result.stdout)

    def test_runtime_rejects_path_outside_release_root(self) -> None:
        runtime = self.verified_runtime()
        runtime["runtime"]["compose_file"] = "/tmp/docker-compose.production.yml"
        runtime_path = self.write("runtime.json", runtime)
        result = run("python3", str(VALIDATE_RUNTIME), str(runtime_path), str(POLICY), "--mode", "apply")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("path_outside_approved_root", result.stderr)

    def test_runtime_rejects_protected_port(self) -> None:
        runtime = self.verified_runtime()
        runtime["runtime"]["production_port"] = 18000
        runtime_path = self.write("runtime.json", runtime)
        result = run("python3", str(VALIDATE_RUNTIME), str(runtime_path), str(POLICY), "--mode", "apply")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("forbidden_or_invalid_port", result.stderr)

    def test_intent_rejects_mutable_image(self) -> None:
        runtime_path = self.write("runtime.json", self.verified_runtime())
        intent = self.approved_intent(runtime_path)
        intent["image"] = "ghcr.io/appolon1908-hue/klyrow-website:latest"
        intent_path = self.write("intent.json", intent)
        result = run(
            "python3",
            str(VALIDATE_INTENT),
            str(intent_path),
            str(POLICY),
            str(runtime_path),
            "--mode",
            "apply",
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("immutable_ghcr_image_required", result.stderr)

    def test_intent_rejects_runtime_digest_mismatch(self) -> None:
        runtime_path = self.write("runtime.json", self.verified_runtime())
        intent = self.approved_intent(runtime_path)
        intent["runtime_paths_sha256"] = "9" * 64
        intent_path = self.write("intent.json", intent)
        result = run(
            "python3",
            str(VALIDATE_INTENT),
            str(intent_path),
            str(POLICY),
            str(runtime_path),
            "--mode",
            "apply",
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("runtime_paths_digest_mismatch", result.stderr)

    def test_example_intent_is_schema_example_only(self) -> None:
        result = run(
            "python3",
            str(VALIDATE_INTENT),
            str(EXAMPLE),
            str(POLICY),
            str(RUNTIME),
            "--mode",
            "example",
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_plan_is_non_mutating_and_blocked(self) -> None:
        output = self.directory / "plan.json"
        result = run("bash", str(PLAN), str(RUNTIME), str(POLICY), str(self.directory / "missing.json"), str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        plan = json.loads(output.read_text())
        self.assertTrue(plan["apply_blocked"])
        self.assertFalse(plan["live_server_changed"])
        self.assertEqual(plan["planned_mutations"], [])


if __name__ == "__main__":
    unittest.main()
