#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host
require_command nginx
require_command python3

legacy="${KLYROW_LEGACY_NGINX_SITE:?set exact legacy Klyrow site file}"
[[ -f "$legacy" ]] || fail "legacy_site_missing:$legacy"
root="${KLYROW_NGINX_CANDIDATE_ROOT:-/var/lib/klyrow-website/nginx-candidates}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
candidate="$root/$stamp"
mkdir -p "$candidate"

python3 "$(dirname "$0")/../nginx/render-host-split.py" \
  "$legacy" \
  "$candidate/legacy-without-apex.conf"
cp "$(dirname "$0")/../nginx/klyrow-website.conf.template" \
  "$candidate/klyrow-website.conf"
cp "$(dirname "$0")/../nginx/klyrow-website-staging.conf.template" \
  "$candidate/klyrow-website-staging.conf"

# Validate a temporary full configuration using the system Nginx prefix so
# existing relative includes such as proxy_params continue to resolve.
cat >"$candidate/syntax-check.conf" <<EOF
events {}
http {
  include /etc/nginx/mime.types;
  include $candidate/legacy-without-apex.conf;
  include $candidate/klyrow-website.conf;
  include $candidate/klyrow-website-staging.conf;
}
EOF
nginx -t -p /etc/nginx -c "$candidate/syntax-check.conf" |& tee "$candidate/validate.log"

grep -q 'app.klyrow.com' "$candidate/legacy-without-apex.conf" || fail "app_host_not_preserved"
grep -q 'api.klyrow.com' "$candidate/legacy-without-apex.conf" || fail "api_host_not_preserved"
grep -q 'track.klyrow.com' "$candidate/legacy-without-apex.conf" || fail "track_host_not_preserved"
grep -q 'bounce.klyrow.com' "$candidate/legacy-without-apex.conf" || fail "bounce_host_not_preserved"
! grep -Eq 'server_name[^;]*(^|[[:space:]])(www\.)?klyrow\.com([[:space:];]|$)' \
  "$candidate/legacy-without-apex.conf" || fail "apex_still_in_legacy"
sha256sum "$candidate"/*.conf >"$candidate/checksums.txt"
printf 'CANDIDATE_PATH=%s\n' "$candidate"
