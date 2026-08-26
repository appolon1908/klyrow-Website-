#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

candidate="${1:?candidate path required}"
[[ -f "$candidate/klyrow-website-staging.conf" ]] || fail "staging_candidate_missing"
verify_protected_urls

install -m 0644 "$candidate/klyrow-website-staging.conf" \
  /etc/nginx/conf.d/klyrow-website-staging.conf
if ! nginx -t; then
  rm -f /etc/nginx/conf.d/klyrow-website-staging.conf
  fail "nginx_validation_failed"
fi
systemctl reload nginx

for attempt in {1..15}; do
  if curl -fsS --max-time 3 \
    -H 'Host: staging.klyrow.internal' \
    http://127.0.0.1:18113/api/v1/health >/dev/null; then
    break
  fi
  sleep 1
  [[ "$attempt" != 15 ]] || fail "staging_edge_health_failed"
done
verify_protected_urls
echo "STAGING_NGINX_EDGE=PASS"
