#!/usr/bin/env bash
set -Eeuo pipefail

apex="${1:-https://klyrow.com}"
www="${2:-https://www.klyrow.com}"

expect_code() {
  local url="$1" expected="$2"
  local code
  code="$(curl -sS -o /tmp/klyrow-release-smoke-body -w '%{http_code}' --max-time 15 "$url")"
  [[ "$code" == "$expected" ]] || {
    echo "SMOKE_CODE_FAIL=$url expected=$expected actual=$code" >&2
    exit 1
  }
}

for path in / /pricing /es /solutions/developers /features/domains /privacy /cookie-settings /sitemap.xml /robots.txt /api/v1/health /api/v1/ready; do
  code="$(curl -sS -o /tmp/klyrow-release-smoke-body -w '%{http_code}' --max-time 15 "$apex$path")"
  [[ "$code" =~ ^[23][0-9][0-9]$ ]] || {
    echo "SMOKE_FAIL=$path:$code" >&2
    exit 1
  }
done

location="$(curl -sSI --max-time 15 "$www/test-path?release=1" | awk 'BEGIN{IGNORECASE=1}/^location:/{sub(/\r$/,""); print $2; exit}')"
[[ "$location" == "https://klyrow.com/test-path?release=1" ]] || {
  echo "WWW_REDIRECT_FAIL=$location" >&2
  exit 1
}

headers="$(curl -sSI --max-time 15 "$apex/")"
grep -qi '^strict-transport-security:' <<<"$headers" || { echo 'HSTS_MISSING' >&2; exit 1; }
grep -qi '^x-content-type-options:.*nosniff' <<<"$headers" || { echo 'NOSNIFF_MISSING' >&2; exit 1; }

asset="$(curl -fsS --max-time 15 "$apex/" | grep -oE '/_nuxt/[^" ]+\.(js|css)' | head -1 || true)"
if [[ -n "$asset" ]]; then
  asset_headers="$(curl -sSI --max-time 15 "$apex$asset")"
  grep -qi 'cache-control:.*immutable' <<<"$asset_headers" || { echo 'IMMUTABLE_ASSET_CACHE_MISSING' >&2; exit 1; }
fi

api_headers="$(curl -sSI --max-time 15 "$apex/api/v1/health")"
grep -qi 'cache-control:.*no-store' <<<"$api_headers" || { echo 'API_NO_STORE_MISSING' >&2; exit 1; }

echo "EXTERNAL_PRODUCTION_SMOKE=PASS APEX=$apex"
