#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

require_command docker
require_command nginx
require_command curl
require_command dig
require_command jq
require_command sha256sum

[[ "${KLYROW_OWNER_GO:-}" == YES ]] || fail "owner_go_required"
release="${KLYROW_RELEASE_SHA:?set exact 40-character release SHA}"
[[ "$release" =~ ^[a-f0-9]{40}$ ]] || fail "invalid_release_sha"
verify_immutable_image
[[ "${KLYROW_WEBSITE_IMAGE}" == *"@sha256:"* ]] || fail "image_digest_missing"

manifest="${KLYROW_RELEASE_MANIFEST:?set release manifest path}"
[[ -f "$manifest" ]] || fail "release_manifest_missing:$manifest"
[[ "$(jq -r .release_sha "$manifest")" == "$release" ]] || fail "manifest_release_mismatch"
manifest_image="$(jq -r '.image + "@" + .image_digest' "$manifest")"
[[ "$manifest_image" == "$KLYROW_WEBSITE_IMAGE" ]] || fail "manifest_image_mismatch"
[[ "$(jq -r .source_repository "$manifest")" == appolon1908-hue/klyrow-Website- ]] || fail "manifest_repository_mismatch"
[[ "$(jq '[.reviewed_pull_requests[] | select(.reviewed == true)] | length' "$manifest")" -ge 14 ]] || fail "reviewed_pr_evidence_incomplete"
[[ -n "$(jq -r .sbom "$manifest")" ]] || fail "sbom_reference_missing"

for file in \
  "${KLYROW_SECRETS_DIR:?set secrets directory}/middleware_api_key" \
  "$KLYROW_SECRETS_DIR/middleware_client_cert" \
  "$KLYROW_SECRETS_DIR/middleware_client_key" \
  "$KLYROW_SECRETS_DIR/middleware_ca"; do
  [[ -r "$file" ]] || fail "required_secret_file_missing:$file"
  [[ ! -s "$file" ]] && fail "required_secret_file_empty:$file"
done

legacy="${KLYROW_LEGACY_NGINX_SITE:?set exact legacy Klyrow Nginx file}"
[[ -f "$legacy" ]] || fail "legacy_nginx_site_missing"
nginx -t

expected_ip="${KLYROW_EXPECTED_PUBLIC_IP:-37.27.128.39}"
for host in klyrow.com www.klyrow.com app.klyrow.com api.klyrow.com track.klyrow.com bounce.klyrow.com; do
  addresses="$(dig +short A "$host" | sort -u | tr '\n' ' ')"
  [[ -n "$addresses" ]] || fail "dns_missing:$host"
  echo "DNS_$host=$addresses"
done
[[ " $(dig +short A klyrow.com) " == *" $expected_ip "* ]] || fail "apex_dns_wrong"

curl -fsS --max-time 10 https://app.klyrow.com/ >/dev/null || fail "existing_app_unhealthy"
curl -fsS --max-time 10 https://api.klyrow.com/ >/dev/null || fail "existing_api_unhealthy"
verify_protected_urls

if ss -ltnH "sport = :${KLYROW_PRODUCTION_PORT:-18110}" | grep -q .; then
  existing="$(docker compose -f docker-compose.production.yml ps -q website 2>/dev/null || true)"
  [[ -n "$existing" ]] || fail "production_port_in_use_by_unknown_process"
fi

echo "RELEASE_PREFLIGHT=PASS RELEASE=$release IMAGE=$KLYROW_WEBSITE_IMAGE"
