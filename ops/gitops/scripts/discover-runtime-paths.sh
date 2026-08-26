#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  printf 'ERROR=%s\n' "$*" >&2
  exit 1
}

[[ "$(id -u)" -ne 0 ]] || fail "runtime_discovery_must_not_run_as_root"

for command in python3 sha256sum hostname id date; do
  command -v "$command" >/dev/null 2>&1 || fail "missing_command:$command"
done

output_dir="${1:-artifacts}"
mkdir -p "$output_dir"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="$output_dir/runtime-discovery-$stamp.json"

hostname_value="$(hostname -f 2>/dev/null || hostname)"
host_ips="$(hostname -I 2>/dev/null | xargs || true)"
machine_hash="unknown"
if [[ -r /etc/machine-id ]]; then
  machine_hash="$(sha256sum /etc/machine-id | awk '{print $1}')"
fi

command_path() {
  command -v "$1" 2>/dev/null || true
}

file_metadata() {
  local path="$1"
  if [[ -e "$path" ]]; then
    stat -Lc '%n|%U|%G|%a|%F' "$path" 2>/dev/null || printf '%s|unreadable\n' "$path"
  else
    printf '%s|missing\n' "$path"
  fi
}

nginx_binary="$(command_path nginx)"
docker_binary="$(command_path docker)"
nginx_fragment=""
if command -v systemctl >/dev/null 2>&1; then
  nginx_fragment="$(systemctl show nginx -p FragmentPath --value 2>/dev/null || true)"
fi
nginx_conf_path=""
if [[ -n "$nginx_binary" ]]; then
  nginx_conf_path="$("$nginx_binary" -V 2>&1 | sed -n 's/.*--conf-path=\([^ ]*\).*/\1/p' | head -1)"
fi

nginx_test="not_available"
if [[ -n "$nginx_binary" ]]; then
  set +e
  "$nginx_binary" -t >/tmp/klyrow-nginx-test.out 2>&1
  nginx_status=$?
  set -e
  nginx_test="exit_$nginx_status"
  rm -f /tmp/klyrow-nginx-test.out
fi

listeners=""
if command -v ss >/dev/null 2>&1; then
  listeners="$(ss -H -ltn 2>/dev/null | awk '{print $4}' | sort -u | tr '\n' ' ' || true)"
fi

containers=""
if [[ -n "$docker_binary" ]]; then
  containers="$("$docker_binary" ps --format '{{.Names}}|{{.Image}}|{{.Status}}' 2>/dev/null | sort | tr '\n' ';' || true)"
fi

candidate_paths=(
  /srv/klyrow-website
  /srv/klyrow-website/secrets
  /srv/klyrow-website/config/docker-compose.production.yml
  /etc/nginx
  /etc/nginx/sites-available/klyrow.conf
  /etc/nginx/sites-enabled/klyrow.conf
  /usr/local/libexec/klyrow-website-gitops-operator
)
metadata=""
for candidate in "${candidate_paths[@]}"; do
  metadata+="$(file_metadata "$candidate")"$'\n'
done

export KLYROW_DISCOVERY_TIMESTAMP="$stamp"
export KLYROW_DISCOVERY_HOSTNAME="$hostname_value"
export KLYROW_DISCOVERY_IPS="$host_ips"
export KLYROW_DISCOVERY_MACHINE_HASH="$machine_hash"
export KLYROW_DISCOVERY_NGINX="$nginx_binary"
export KLYROW_DISCOVERY_DOCKER="$docker_binary"
export KLYROW_DISCOVERY_NGINX_UNIT="$nginx_fragment"
export KLYROW_DISCOVERY_NGINX_CONF="$nginx_conf_path"
export KLYROW_DISCOVERY_NGINX_TEST="$nginx_test"
export KLYROW_DISCOVERY_LISTENERS="$listeners"
export KLYROW_DISCOVERY_CONTAINERS="$containers"
export KLYROW_DISCOVERY_METADATA="$metadata"

python3 - "$output" <<'PY'
import json
import os
import sys

metadata = []
for line in os.environ["KLYROW_DISCOVERY_METADATA"].splitlines():
    parts = line.split("|")
    if len(parts) == 2:
        metadata.append({"path": parts[0], "state": parts[1]})
    elif len(parts) >= 5:
        metadata.append(
            {
                "path": parts[0],
                "owner": parts[1],
                "group": parts[2],
                "mode": parts[3],
                "kind": "|".join(parts[4:]),
            }
        )

data = {
    "schema_version": 1,
    "mode": "read_only_discovery",
    "timestamp": os.environ["KLYROW_DISCOVERY_TIMESTAMP"],
    "host": {
        "hostname": os.environ["KLYROW_DISCOVERY_HOSTNAME"],
        "ips": os.environ["KLYROW_DISCOVERY_IPS"].split(),
        "machine_id_sha256": os.environ["KLYROW_DISCOVERY_MACHINE_HASH"],
        "runner_uid": os.getuid(),
    },
    "commands": {
        "nginx": os.environ["KLYROW_DISCOVERY_NGINX"] or None,
        "docker": os.environ["KLYROW_DISCOVERY_DOCKER"] or None,
    },
    "nginx": {
        "service_fragment": os.environ["KLYROW_DISCOVERY_NGINX_UNIT"] or None,
        "compiled_conf_path": os.environ["KLYROW_DISCOVERY_NGINX_CONF"] or None,
        "validation": os.environ["KLYROW_DISCOVERY_NGINX_TEST"],
    },
    "listeners": os.environ["KLYROW_DISCOVERY_LISTENERS"].split(),
    "containers": [item for item in os.environ["KLYROW_DISCOVERY_CONTAINERS"].split(";") if item],
    "candidate_path_metadata": metadata,
    "mutations_performed": [],
    "secret_contents_read": False,
}

with open(sys.argv[1], "w", encoding="utf-8") as handle:
    json.dump(data, handle, indent=2, sort_keys=True)
    handle.write("\n")
PY

sha256sum "$output" >"$output.sha256"
printf 'RUNTIME_DISCOVERY=%s\n' "$output"
printf 'RUNTIME_DISCOVERY_SHA256=%s\n' "$(awk '{print $1}' "$output.sha256")"
printf 'LIVE_SERVER_MUTATION=NO\n'
