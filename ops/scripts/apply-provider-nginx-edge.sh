#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

[[ "${KLYROW_OWNER_GO:-}" == YES ]] || fail "owner_go_required"
candidate="${1:?candidate path required}"
legacy="${KLYROW_LEGACY_NGINX_SITE:?set exact legacy Klyrow site file}"
release="${KLYROW_RELEASE_SHA:?set exact release SHA}"
[[ -f "$candidate/legacy-without-apex.conf" ]] || fail "legacy_candidate_missing"
[[ -f "$candidate/klyrow-website.conf" ]] || fail "website_candidate_missing"

backup_output="$("$(dirname "$0")/backup-provider-nginx.sh")"
archive="${backup_output#NGINX_BACKUP=}"
verify_protected_urls
curl -fsS --max-time 5 \
  "http://127.0.0.1:${KLYROW_PRODUCTION_PORT:-18110}/api/v1/health" \
  >/dev/null || fail "website_candidate_unhealthy"

legacy_backup="$legacy.pre-klyrow-website-$release"
cp "$legacy" "$legacy_backup"
install -m 0644 "$candidate/legacy-without-apex.conf" "$legacy"
install -m 0644 "$candidate/klyrow-website.conf" \
  /etc/nginx/conf.d/klyrow-website.conf

if ! nginx -t; then
  cp "$legacy_backup" "$legacy"
  rm -f /etc/nginx/conf.d/klyrow-website.conf
  nginx -t
  fail "full_nginx_validation_failed_restored"
fi
systemctl reload nginx
sleep 2

if ! curl -fsS --max-time 10 https://klyrow.com/api/v1/health >/dev/null; then
  "$(dirname "$0")/rollback-provider-nginx.sh" "$archive"
  fail "external_health_failed_rolled_back"
fi
verify_protected_urls
echo "PROVIDER_NGINX_EDGE=PASS RELEASE=$release BACKUP=$archive"
