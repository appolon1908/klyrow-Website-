#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

for port in 25 80 443 1401 2525 2775 3100 8443 18000 18001 18002 18003 18080 18082 18443; do
  if ss -ltnH "sport = :$port" | grep -q .; then
    echo "PORT_$port=LISTENING"
  else
    echo "PORT_$port=NOT_LISTENING"
  fi
done
verify_protected_urls
