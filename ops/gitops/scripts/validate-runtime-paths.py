#!/usr/bin/env python3
"""Validate the reviewed provider-host runtime inventory without mutating the host."""

from __future__ import annotations

import argparse
import hashlib
import ipaddress
import json
import re
import sys
from datetime import datetime
from pathlib import PurePosixPath
from typing import Any

HEX64 = re.compile(r"^[a-f0-9]{64}$")


def fail(message: str) -> None:
    print(f"ERROR={message}", file=sys.stderr)
    raise SystemExit(1)


def read_json(path: str) -> dict[str, Any]:
    try:
        with open(path, "r", encoding="utf-8") as handle:
            value = json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"unable_to_read_json:{path}:{exc}")
    if not isinstance(value, dict):
        fail(f"json_root_must_be_object:{path}")
    return value


def require_absolute(value: Any, field: str) -> PurePosixPath:
    if not isinstance(value, str) or not value.startswith("/"):
        fail(f"absolute_path_required:{field}")
    path = PurePosixPath(value)
    if ".." in path.parts:
        fail(f"parent_path_forbidden:{field}")
    return path


def within(path: PurePosixPath, root: PurePosixPath, field: str) -> None:
    try:
        path.relative_to(root)
    except ValueError:
        fail(f"path_outside_approved_root:{field}:{path}:{root}")


def parse_time(value: Any, field: str) -> None:
    if not isinstance(value, str):
        fail(f"timestamp_required:{field}")
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        fail(f"invalid_timestamp:{field}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("runtime_paths")
    parser.add_argument("policy")
    parser.add_argument("--mode", choices=("plan", "apply"), default="plan")
    args = parser.parse_args()

    runtime = read_json(args.runtime_paths)
    policy = read_json(args.policy)

    if runtime.get("schema_version") != 1:
        fail("unsupported_runtime_schema")
    if runtime.get("environment") != "production":
        fail("production_runtime_required")
    if policy.get("schema_version") != 1 or policy.get("environment") != "production":
        fail("invalid_production_policy")

    host = runtime.get("host")
    paths = runtime.get("runtime")
    evidence = runtime.get("evidence")
    if not all(isinstance(item, dict) for item in (host, paths, evidence)):
        fail("runtime_sections_missing")

    try:
        ipaddress.ip_address(host.get("expected_public_ip"))
        ipaddress.ip_address(host.get("expected_private_ip"))
    except ValueError:
        fail("invalid_expected_host_ip")
    if host.get("expected_public_ip") != "37.27.128.39" or host.get("expected_private_ip") != "10.40.0.4":
        fail("unexpected_provider_host")

    status = runtime.get("status")
    if status not in {"unverified", "verified", "retired"}:
        fail("invalid_runtime_status")
    if status != "verified":
        if args.mode == "apply":
            fail(f"runtime_paths_not_verified:{status}")
        print(f"RUNTIME_PATHS_STATUS={status}")
        print("APPLY_BLOCKED=YES")
        digest = hashlib.sha256(open(args.runtime_paths, "rb").read()).hexdigest()
        print(f"RUNTIME_PATHS_SHA256={digest}")
        return

    parse_time(runtime.get("verified_at"), "verified_at")
    if not isinstance(runtime.get("verified_by"), str) or not runtime["verified_by"].strip():
        fail("verified_by_required")
    hostname = host.get("hostname")
    if not isinstance(hostname, str) or not hostname.strip():
        fail("verified_hostname_required")
    machine_hash = host.get("machine_id_sha256")
    if not isinstance(machine_hash, str) or not HEX64.fullmatch(machine_hash):
        fail("machine_id_sha256_required")

    release_root = require_absolute(paths.get("release_root"), "release_root")
    allowed_release_root = require_absolute(policy.get("allowed_release_root_prefix"), "policy.allowed_release_root_prefix")
    within(release_root, allowed_release_root, "release_root")

    secrets_root = require_absolute(paths.get("secrets_root"), "secrets_root")
    compose_file = require_absolute(paths.get("compose_file"), "compose_file")
    within(secrets_root, release_root, "secrets_root")
    within(compose_file, release_root, "compose_file")

    nginx_root = require_absolute(paths.get("nginx_root"), "nginx_root")
    required_nginx_root = require_absolute(policy.get("allowed_nginx_root"), "policy.allowed_nginx_root")
    if nginx_root != required_nginx_root:
        fail("nginx_root_mismatch")
    legacy_site = require_absolute(paths.get("legacy_nginx_site"), "legacy_nginx_site")
    within(legacy_site, nginx_root, "legacy_nginx_site")

    require_absolute(paths.get("nginx_binary"), "nginx_binary")
    require_absolute(paths.get("docker_binary"), "docker_binary")
    operator = require_absolute(paths.get("operator_path"), "operator_path")
    required_operator = require_absolute(policy.get("required_operator_path"), "policy.required_operator_path")
    if operator != required_operator:
        fail("operator_path_mismatch")

    production_port = paths.get("production_port")
    staging_port = paths.get("staging_port")
    if not isinstance(production_port, int) or not isinstance(staging_port, int):
        fail("integer_ports_required")
    if production_port == staging_port:
        fail("staging_and_production_ports_must_differ")
    forbidden = set(policy.get("forbidden_ports", []))
    for field, port in (("production_port", production_port), ("staging_port", staging_port)):
        if port <= 1024 or port > 65535 or port in forbidden:
            fail(f"forbidden_or_invalid_port:{field}:{port}")

    artifact_hash = evidence.get("discovery_artifact_sha256")
    if not isinstance(artifact_hash, str) or not HEX64.fullmatch(artifact_hash):
        fail("discovery_artifact_sha256_required")
    if not isinstance(evidence.get("reviewed_pr"), int) or evidence["reviewed_pr"] < 1:
        fail("runtime_review_pr_required")

    digest = hashlib.sha256(open(args.runtime_paths, "rb").read()).hexdigest()
    print("RUNTIME_PATHS_STATUS=verified")
    print("APPLY_BLOCKED=NO")
    print(f"RUNTIME_PATHS_SHA256={digest}")
    print(f"PRODUCTION_PORT={production_port}")
    print(f"STAGING_PORT={staging_port}")


if __name__ == "__main__":
    main()
