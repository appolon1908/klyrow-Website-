#!/usr/bin/env python3
"""Validate a repository-owned Klyrow Website release intent."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime
from typing import Any

HEX40 = re.compile(r"^[a-f0-9]{40}$")
HEX64 = re.compile(r"^[a-f0-9]{64}$")
IMAGE = re.compile(r"^ghcr\.io/appolon1908-hue/klyrow-website@sha256:[a-f0-9]{64}$")


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


def require_hex(value: Any, pattern: re.Pattern[str], field: str, allow_zero: bool) -> str:
    if not isinstance(value, str) or not pattern.fullmatch(value):
        fail(f"invalid_digest_or_sha:{field}")
    if not allow_zero and set(value) == {"0"}:
        fail(f"placeholder_forbidden:{field}")
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("intent")
    parser.add_argument("policy")
    parser.add_argument("runtime_paths")
    parser.add_argument("--mode", choices=("example", "plan", "apply"), default="plan")
    args = parser.parse_args()

    intent = read_json(args.intent)
    policy = read_json(args.policy)
    runtime = read_json(args.runtime_paths)
    allow_zero = args.mode == "example"

    if intent.get("schema_version") != 1 or intent.get("environment") != "production":
        fail("invalid_intent_schema_or_environment")
    if intent.get("source_repository") != policy.get("source_repository"):
        fail("source_repository_mismatch")
    if intent.get("status") not in {"draft", "approved", "retired"}:
        fail("invalid_intent_status")
    if args.mode == "apply" and intent.get("status") != "approved":
        fail("approved_intent_required")

    require_hex(intent.get("intent_commit"), HEX40, "intent_commit", allow_zero)
    require_hex(intent.get("release_sha"), HEX40, "release_sha", allow_zero)
    image = intent.get("image")
    if not isinstance(image, str) or not IMAGE.fullmatch(image):
        fail("immutable_ghcr_image_required")
    if not allow_zero and image.endswith("0" * 64):
        fail("placeholder_forbidden:image")
    for field in (
        "sbom_sha256",
        "runtime_paths_sha256",
        "staging_evidence_sha256",
        "rollback_evidence_sha256",
    ):
        require_hex(intent.get(field), HEX64, field, allow_zero)

    runtime_digest = hashlib.sha256(open(args.runtime_paths, "rb").read()).hexdigest()
    if args.mode != "example" and intent.get("runtime_paths_sha256") != runtime_digest:
        fail("runtime_paths_digest_mismatch")
    if args.mode == "apply" and runtime.get("status") != "verified":
        fail("verified_runtime_paths_required")

    reviewed = intent.get("reviewed_pull_requests")
    minimum = policy.get("minimum_reviewed_pull_requests")
    if not isinstance(reviewed, list) or not isinstance(minimum, int) or len(reviewed) < minimum:
        fail("reviewed_pull_request_evidence_incomplete")
    numbers: set[int] = set()
    for item in reviewed:
        if not isinstance(item, dict):
            fail("invalid_reviewed_pull_request_item")
        number = item.get("number")
        if not isinstance(number, int) or number < 1 or number in numbers:
            fail("invalid_or_duplicate_pull_request_number")
        numbers.add(number)
        require_hex(item.get("head_sha"), HEX40, f"pull_request_{number}_head", allow_zero)
        if item.get("approved") is not True:
            fail(f"pull_request_not_approved:{number}")

    if intent.get("legal_release_state") not in {"approved", "approved_exception"}:
        fail("legal_release_state_required")
    created_by = intent.get("created_by")
    if not isinstance(created_by, str) or not created_by.strip():
        fail("created_by_required")
    created_at = intent.get("created_at")
    if not isinstance(created_at, str):
        fail("created_at_required")
    try:
        datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    except ValueError:
        fail("invalid_created_at")

    digest = hashlib.sha256(open(args.intent, "rb").read()).hexdigest()
    print(f"RELEASE_INTENT_STATUS={intent['status']}")
    print(f"RELEASE_INTENT_SHA256={digest}")
    print(f"RELEASE_SHA={intent['release_sha']}")
    print(f"IMAGE={intent['image']}")
    print(f"REVIEWED_PULL_REQUESTS={len(reviewed)}")
    print(f"APPLY_ELIGIBLE={'YES' if args.mode == 'apply' else 'NOT_EVALUATED'}")


if __name__ == "__main__":
    main()
