#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host
require_command nginx
require_command ss
require_command docker

out="${1:-/tmp/klyrow-nginx-audit-$(date -u +%Y%m%dT%H%M%SZ)}"
mkdir -p "$out"
nginx -V >"$out/nginx-version.txt" 2>&1
nginx -T >"$out/nginx-expanded.txt" 2>&1
systemctl cat nginx >"$out/nginx-unit.txt" 2>&1 || true
ss -lntup >"$out/listeners.txt"
docker ps --format '{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}' >"$out/containers.txt"
find /etc/nginx -xdev -type f -print0 | sort -z | xargs -0 sha256sum >"$out/nginx-checksums.txt"
certbot certificates >"$out/certificates.txt" 2>&1 || true
printf 'AUDIT_PATH=%s\n' "$out"
