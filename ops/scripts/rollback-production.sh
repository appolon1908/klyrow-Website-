#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

root="${KLYROW_RELEASE_ROOT:-/srv/klyrow-website}"
target="${1:-${KLYROW_PREVIOUS_RELEASE_SHA:-}}"
archive="${2:-${KLYROW_NGINX_ROLLBACK_ARCHIVE:-}}"
[[ "$target" =~ ^[a-f0-9]{40}$ ]] || fail "valid_previous_release_required"
[[ -n "$archive" ]] || fail "nginx_backup_archive_required"
image_file="$root/releases/$target/image.txt"
[[ -f "$image_file" ]] || fail "previous_release_image_missing:$target"

export KLYROW_RELEASE_SHA="$target"
export KLYROW_WEBSITE_IMAGE="$(cat "$image_file")"
verify_immutable_image

docker compose -f docker-compose.production.yml up -d --no-build --pull never website
for attempt in {1..30}; do
  if curl -fsS --max-time 3 \
    "http://127.0.0.1:${KLYROW_PRODUCTION_PORT:-18110}/api/v1/health" >/dev/null; then
    break
  fi
  sleep 2
  [[ "$attempt" != 30 ]] || fail "rollback_container_health_timeout"
done

"$(dirname "$0")/rollback-provider-nginx.sh" "$archive"
"$(dirname "$0")/external-production-smoke.sh"
verify_protected_urls
ln -sfn "$root/releases/$target" "$root/current"
echo "PRODUCTION_ROLLBACK=PASS TARGET=$target"
