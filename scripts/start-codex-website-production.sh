#!/usr/bin/env bash
set -Eeuo pipefail

REPOSITORY="appolon1908-hue/klyrow-Website-"
REPOSITORY_HTTPS="https://github.com/${REPOSITORY}.git"
REPOSITORY_SSH="git@github.com:${REPOSITORY}.git"
BLUEPRINT_BRANCH="planning/production-website-blueprint"
WORKSPACE="${KLYROW_WEBSITE_CODEX_WORKSPACE:-/srv/codex-workspaces/klyrow-Website-}"
TASK_FILE="CODEX_WEBSITE_PRODUCTION_TASK.md"
PROVIDER_OVERRIDE_FILE="CODEX_PROVIDER_HOST_DEPLOYMENT_TASK.md"
OWNER_DIRECTIVE_FILE="OWNER_WEBSITE_PRODUCTION_DIRECTIVE.md"

log() {
  printf '%s\n' "$*"
}

fail() {
  printf 'ERROR=%s\n' "$*" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || fail "git_not_installed"
command -v gh >/dev/null 2>&1 || fail "github_cli_not_installed"
command -v codex >/dev/null 2>&1 || fail "codex_cli_not_installed"
command -v ss >/dev/null 2>&1 || fail "ss_not_installed"

HOST_IPS="$(hostname -I 2>/dev/null || true)"
case " ${HOST_IPS} " in
  *" 37.27.128.39 "*|*" 10.40.0.4 "*) ;;
  *) fail "not_expected_klyrow_provider_host HOSTNAME=$(hostname) HOST_IPS=${HOST_IPS:-unknown}" ;;
esac

log "HOSTNAME=$(hostname)"
log "HOST_IPS=${HOST_IPS:-unknown}"
log "CODEX_VERSION=$(codex --version 2>/dev/null || printf unknown)"
log "EDGE_EXPECTED=NGINX"
log "WEBSITE_PRODUCTION_PORT_PREFERRED=18110"
log "WEBSITE_STAGING_PORT_PREFERRED=18111"

gh auth status --hostname github.com >/dev/null 2>&1 || fail "github_cli_not_authenticated"

case "$WORKSPACE" in
  /opt/klyrow|/opt/klyrow/*|/opt/codestra/compose|/opt/codestra/compose/*|/srv/klyrow-website|/srv/klyrow-website/*|/var/www|/var/www/*|/etc/nginx|/etc/nginx/*)
    fail "refusing_live_or_production_workspace WORKSPACE=$WORKSPACE"
    ;;
esac

mkdir -p "$(dirname "$WORKSPACE")"

if [[ ! -d "$WORKSPACE/.git" ]]; then
  if [[ -e "$WORKSPACE" ]] && [[ -n "$(find "$WORKSPACE" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]]; then
    fail "workspace_exists_but_is_not_git_repository WORKSPACE=$WORKSPACE"
  fi
  git clone "$REPOSITORY_HTTPS" "$WORKSPACE"
fi

cd "$WORKSPACE"

REMOTE="$(git remote get-url origin 2>/dev/null || true)"
case "$REMOTE" in
  "$REPOSITORY_HTTPS"|"$REPOSITORY_SSH"|"https://github.com/${REPOSITORY}"|"git://github.com/${REPOSITORY}.git") ;;
  *) fail "unexpected_repository_remote REMOTE=${REMOTE:-missing}" ;;
esac

if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
  fail "working_tree_not_clean WORKSPACE=$WORKSPACE"
fi

git fetch --prune origin

git show-ref --verify --quiet "refs/remotes/origin/$BLUEPRINT_BRANCH" || \
  fail "blueprint_branch_missing BRANCH=$BLUEPRINT_BRANCH"

git switch --detach "origin/$BLUEPRINT_BRANCH"

[[ -f "$TASK_FILE" ]] || fail "task_file_missing TASK_FILE=$TASK_FILE"
[[ -f "$PROVIDER_OVERRIDE_FILE" ]] || fail "provider_override_missing FILE=$PROVIDER_OVERRIDE_FILE"
[[ -f "$OWNER_DIRECTIVE_FILE" ]] || fail "owner_directive_missing FILE=$OWNER_DIRECTIVE_FILE"

BLUEPRINT_SHA="$(git rev-parse HEAD)"

log "CURRENT_DIRECTORY=$(pwd)"
log "REPOSITORY_REMOTE=$REMOTE"
log "BLUEPRINT_BRANCH=$BLUEPRINT_BRANCH"
log "BLUEPRINT_SHA=$BLUEPRINT_SHA"
log "GIT_STATUS=$(git status --short | tr '\n' ';')"
log "TASK_FILE=$(pwd)/$TASK_FILE"
log "PROVIDER_OVERRIDE_FILE=$(pwd)/$PROVIDER_OVERRIDE_FILE"
log "OWNER_DIRECTIVE_FILE=$(pwd)/$OWNER_DIRECTIVE_FILE"
log "PUBLIC_WEBSITE_PRODUCTION_AUTHORIZED_AFTER_GATES=YES"
log "LIVE_EMAIL_OR_BILLING_CHANGES_AUTHORIZED=NO"
log "CADDY_INSTALLATION_AUTHORIZED=NO"

log "===== LISTENER SUMMARY ====="
ss -lntup | sed -n '1,120p'

log "===== EDGE SERVICE SUMMARY ====="
systemctl is-active nginx 2>/dev/null || true
systemctl is-active caddy 2>/dev/null || true

TASK_CONTENT="$(
  cat "$OWNER_DIRECTIVE_FILE"
  printf '\n\n---\n\n'
  cat "$TASK_FILE"
  printf '\n\n---\n\n'
  cat "$PROVIDER_OVERRIDE_FILE"
)"

if codex --help 2>&1 | grep -qE '(^|[[:space:]])exec([[:space:]]|$)'; then
  exec codex exec "$TASK_CONTENT"
else
  exec codex "$TASK_CONTENT"
fi
