#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/provider-host-lib.sh"
verify_provider_host

root="${KLYROW_NGINX_BACKUP_ROOT:-/var/backups/klyrow-website-nginx}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$root"
archive="$root/nginx-$stamp.tar.gz"
tar --xattrs --acls -czf "$archive" /etc/nginx
sha256sum "$archive" >"$archive.sha256"
nginx -T >"$root/nginx-$stamp.expanded.txt" 2>&1
printf 'NGINX_BACKUP=%s\n' "$archive"
