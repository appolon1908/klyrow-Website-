#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

"$(dirname "$0")/release-preflight.sh"
release="$KLYROW_RELEASE_SHA"
root="${KLYROW_RELEASE_ROOT:-/srv/klyrow-website}"
release_dir="$root/releases/$release"
evidence="$root/evidence/production-$release"
mkdir -p "$release_dir" "$evidence"

previous=""
if [[ -L "$root/current" ]]; then
  previous="$(basename "$(readlink -f "$root/current")")"
fi
printf '%s\n' "$KLYROW_WEBSITE_IMAGE" >"$release_dir/image.txt"
cp "$KLYROW_RELEASE_MANIFEST" "$release_dir/release-manifest.json"
printf '%s\n' "$previous" >"$release_dir/previous-release.txt"

snapshot_protected_services "$evidence/before.txt"
verify_protected_urls

backup_output="$("$(dirname "$0")/backup-provider-nginx.sh")"
nginx_archive="${backup_output#NGINX_BACKUP=}"
printf '%s\n' "$nginx_archive" >"$release_dir/nginx-backup.txt"

candidate_output="$("$(dirname "$0")/build-nginx-candidate.sh")"
candidate="${candidate_output#CANDIDATE_PATH=}"
printf '%s\n' "$candidate" >"$release_dir/nginx-candidate.txt"

rollback_required=1
rollback() {
  local exit_code=$?
  if [[ "$rollback_required" == 1 ]]; then
    echo "DEPLOYMENT_FAILED=YES EXIT_CODE=$exit_code" | tee -a "$evidence/deployment.log"
    if [[ "$previous" =~ ^[a-f0-9]{40}$ ]]; then
      KLYROW_NGINX_ROLLBACK_ARCHIVE="$nginx_archive" \
        "$(dirname "$0")/rollback-production.sh" "$previous" "$nginx_archive" \
        | tee "$evidence/rollback.log" || true
    else
      "$(dirname "$0")/rollback-provider-nginx.sh" "$nginx_archive" \
        | tee "$evidence/nginx-rollback.log" || true
      docker compose -f docker-compose.production.yml down \
        | tee "$evidence/candidate-stop.log" || true
    fi
  fi
  exit "$exit_code"
}
trap rollback ERR INT TERM

docker pull "$KLYROW_WEBSITE_IMAGE" | tee "$evidence/image-pull.log"
docker compose -f docker-compose.production.yml up -d --no-build --pull never website \
  | tee "$evidence/compose-up.log"

for attempt in {1..30}; do
  if curl -fsS --max-time 3 \
    "http://127.0.0.1:${KLYROW_PRODUCTION_PORT:-18110}/api/v1/health" >/dev/null; then
    break
  fi
  sleep 2
  [[ "$attempt" != 30 ]] || fail "production_candidate_health_timeout"
done

"$(dirname "$0")/docker-smoke.sh" \
  "http://127.0.0.1:${KLYROW_PRODUCTION_PORT:-18110}" \
  | tee "$evidence/loopback-smoke.log"
container_id="$(docker compose -f docker-compose.production.yml ps -q website)"
"$(dirname "$0")/verify-container.sh" "$container_id" \
  | tee "$evidence/container-security.log"

KLYROW_OWNER_GO=YES \
  "$(dirname "$0")/apply-provider-nginx-edge.sh" "$candidate" \
  | tee "$evidence/nginx-activation.log"
"$(dirname "$0")/external-production-smoke.sh" \
  | tee "$evidence/external-smoke.log"

soak_seconds="${KLYROW_SOAK_SECONDS:-120}"
started="$(date +%s)"
while (( $(date +%s) - started < soak_seconds )); do
  curl -fsS --max-time 5 https://klyrow.com/api/v1/health >/dev/null
  curl -fsS --max-time 5 https://app.klyrow.com/ >/dev/null
  curl -fsS --max-time 5 https://api.klyrow.com/ >/dev/null
  verify_protected_urls
  sleep 10
done

snapshot_protected_services "$evidence/after.txt"
"$(dirname "$0")/collect-release-evidence.sh" "$evidence"
ln -sfn "$release_dir" "$root/current"
if [[ "$previous" =~ ^[a-f0-9]{40}$ ]]; then
  ln -sfn "$root/releases/$previous" "$root/previous"
fi
rollback_required=0
trap - ERR INT TERM
echo "PRODUCTION_DEPLOYMENT=PASS RELEASE=$release IMAGE=$KLYROW_WEBSITE_IMAGE PREVIOUS=${previous:-none}"
