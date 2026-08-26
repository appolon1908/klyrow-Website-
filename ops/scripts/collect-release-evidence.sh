#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

release="${KLYROW_RELEASE_SHA:?set release SHA}"
root="${KLYROW_RELEASE_ROOT:-/srv/klyrow-website}"
out="${1:-$root/evidence/production-$release}"
mkdir -p "$out"

{
  echo "captured_at=$(date -u +%FT%TZ)"
  echo "hostname=$(hostname)"
  echo "host_ips=$(hostname -I)"
  echo "release_sha=$release"
  echo "image=$KLYROW_WEBSITE_IMAGE"
} >"$out/release.txt"

ss -lntup >"$out/listeners.txt"
docker ps --format '{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}' >"$out/containers.txt"
docker compose -f docker-compose.production.yml ps >"$out/website-compose.txt" 2>&1 || true
nginx -T >"$out/nginx-expanded.txt" 2>&1
nginx -t >"$out/nginx-validate.txt" 2>&1
curl -sS --max-time 10 https://klyrow.com/api/v1/health >"$out/public-health.json"
curl -sS --max-time 10 https://klyrow.com/api/v1/ready >"$out/public-ready.json"
curl -sSI --max-time 10 https://klyrow.com/ >"$out/public-headers.txt"
curl -sSI --max-time 10 https://www.klyrow.com/ >"$out/www-headers.txt"
sha256sum "$out"/* >"$out/checksums.txt"
echo "RELEASE_EVIDENCE=$out"
