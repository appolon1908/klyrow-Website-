#!/usr/bin/env bash
set -Eeuo pipefail

runtime="${1:-ops/gitops/environments/production/runtime-paths.json}"
policy="${2:-ops/gitops/environments/production/deployment-policy.json}"
intent="${3:-ops/gitops/environments/production/release-intent.json}"
output="${4:-artifacts/gitops-plan.json}"

mkdir -p "$(dirname "$output")"
python3 ops/gitops/scripts/validate-runtime-paths.py "$runtime" "$policy" --mode plan

intent_state="missing"
if [[ -f "$intent" ]]; then
  python3 ops/gitops/scripts/validate-release-intent.py "$intent" "$policy" "$runtime" --mode plan
  intent_state="present"
fi

python3 - "$runtime" "$policy" "$intent" "$intent_state" "$output" <<'PY'
import hashlib
import json
import os
import sys

runtime_path, policy_path, intent_path, intent_state, output_path = sys.argv[1:]
with open(runtime_path, encoding="utf-8") as handle:
    runtime = json.load(handle)
with open(policy_path, encoding="utf-8") as handle:
    policy = json.load(handle)
intent = None
if intent_state == "present":
    with open(intent_path, encoding="utf-8") as handle:
        intent = json.load(handle)

runtime_hash = hashlib.sha256(open(runtime_path, "rb").read()).hexdigest()
apply_blockers = []
if runtime.get("status") != "verified":
    apply_blockers.append("runtime_paths_unverified")
if intent is None:
    apply_blockers.append("release_intent_missing")
elif intent.get("status") != "approved":
    apply_blockers.append("release_intent_not_approved")

plan = {
    "schema_version": 1,
    "operation": "klyrow_website_gitops_plan",
    "environment": "production",
    "provider_host": runtime["host"],
    "runtime_status": runtime["status"],
    "runtime_paths_sha256": runtime_hash,
    "release_intent_status": None if intent is None else intent.get("status"),
    "release_sha": None if intent is None else intent.get("release_sha"),
    "image": None if intent is None else intent.get("image"),
    "protected_environment": policy["protected_environment"],
    "apply_blocked": bool(apply_blockers),
    "apply_blockers": apply_blockers,
    "planned_mutations": [] if apply_blockers else [
        "pull exact immutable image",
        "start candidate on reviewed loopback port",
        "validate health/readiness/routes/forms",
        "backup and validate Nginx",
        "switch only klyrow.com and www.klyrow.com",
        "soak and retain rollback target"
    ],
    "forbidden_scopes": policy["forbidden_scopes"],
    "live_server_changed": False,
}
with open(output_path, "w", encoding="utf-8") as handle:
    json.dump(plan, handle, indent=2, sort_keys=True)
    handle.write("\n")
print(f"GITOPS_PLAN={output_path}")
print(f"APPLY_BLOCKED={'YES' if apply_blockers else 'NO'}")
for blocker in apply_blockers:
    print(f"BLOCKER={blocker}")
print("LIVE_SERVER_CHANGED=NO")
PY
