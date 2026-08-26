#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  printf 'ERROR=%s\n' "$*" >&2
  exit 1
}

[[ "${KLYROW_GITOPS_MODE:-}" == apply ]] || fail "apply_mode_not_explicit"
[[ "$(id -u)" -ne 0 ]] || fail "runner_must_not_be_root"

runtime="${1:-ops/gitops/environments/production/runtime-paths.json}"
policy="${2:-ops/gitops/environments/production/deployment-policy.json}"
intent="${3:-ops/gitops/environments/production/release-intent.json}"

for file in "$runtime" "$policy" "$intent"; do
  [[ -f "$file" ]] || fail "required_gitops_file_missing:$file"
done

python3 ops/gitops/scripts/validate-runtime-paths.py "$runtime" "$policy" --mode apply
python3 ops/gitops/scripts/validate-release-intent.py "$intent" "$policy" "$runtime" --mode apply

json_value() {
  python3 - "$1" "$2" <<'PY'
import json
import sys
with open(sys.argv[1], encoding="utf-8") as handle:
    value = json.load(handle)
for part in sys.argv[2].split('.'):
    value = value[part]
if not isinstance(value, (str, int)):
    raise SystemExit(1)
print(value)
PY
}

expected_public_ip="$(json_value "$runtime" host.expected_public_ip)"
expected_private_ip="$(json_value "$runtime" host.expected_private_ip)"
expected_machine_hash="$(json_value "$runtime" host.machine_id_sha256)"
operator="$(json_value "$runtime" runtime.operator_path)"
release_sha="$(json_value "$intent" release_sha)"
intent_commit="$(json_value "$intent" intent_commit)"

host_ips=" $(hostname -I 2>/dev/null || true) "
[[ "$host_ips" == *" $expected_public_ip "* || "$host_ips" == *" $expected_private_ip "* ]] || \
  fail "provider_host_identity_mismatch"
[[ -r /etc/machine-id ]] || fail "machine_id_unreadable"
actual_machine_hash="$(sha256sum /etc/machine-id | awk '{print $1}')"
[[ "$actual_machine_hash" == "$expected_machine_hash" ]] || fail "machine_fingerprint_mismatch"

command -v git >/dev/null 2>&1 || fail "git_missing"
git fetch --quiet origin main
git merge-base --is-ancestor "$release_sha" origin/main || fail "release_sha_not_reachable_from_main"
[[ "$intent_commit" == "$(git rev-parse origin/main)" ]] || fail "intent_commit_is_not_current_main"
[[ "$(git rev-parse HEAD)" == "$intent_commit" ]] || fail "checkout_is_not_intent_commit"
[[ -z "$(git status --porcelain)" ]] || fail "working_tree_not_clean"

[[ "$operator" == /usr/local/libexec/klyrow-website-gitops-operator ]] || fail "unexpected_operator_path"
[[ -f "$operator" && -x "$operator" ]] || fail "restricted_operator_missing_or_not_executable"
owner="$(stat -Lc '%U' "$operator")"
mode="$(stat -Lc '%a' "$operator")"
[[ "$owner" == root ]] || fail "operator_not_root_owned"
mode_value=$((8#$mode))
(( (mode_value & 0022) == 0 )) || fail "operator_group_or_world_writable"

for command in sudo realpath; do
  command -v "$command" >/dev/null 2>&1 || fail "missing_command:$command"
done

runtime_abs="$(realpath "$runtime")"
intent_abs="$(realpath "$intent")"
policy_abs="$(realpath "$policy")"
repository_abs="$(pwd -P)"

printf 'GITOPS_APPLY_PRECHECK=PASS\n'
printf 'RELEASE_SHA=%s\n' "$release_sha"
printf 'OPERATOR=%s\n' "$operator"
printf 'LIVE_SERVER_CHANGED=NO_BEFORE_OPERATOR\n'

exec sudo -n "$operator" \
  --runtime "$runtime_abs" \
  --policy "$policy_abs" \
  --intent "$intent_abs" \
  --repository-root "$repository_abs"
