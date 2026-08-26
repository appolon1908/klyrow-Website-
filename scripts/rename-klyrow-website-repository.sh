#!/usr/bin/env bash
set -Eeuo pipefail

OLD_REPOSITORY="appolon1908-hue/klyrow-Website-"
NEW_REPOSITORY="appolon1908-hue/klyrow-Website"
NEW_NAME="klyrow-Website"
MODE="${1:---plan}"

fail() {
  printf 'ERROR=%s\n' "$*" >&2
  exit 1
}

case "$MODE" in
  --plan|--execute) ;;
  *) fail "usage: $0 [--plan|--execute]" ;;
esac

for command in gh jq git sha256sum date; do
  command -v "$command" >/dev/null 2>&1 || fail "missing_command:$command"
done

gh auth status --hostname github.com >/dev/null 2>&1 || \
  fail "github_cli_not_authenticated"

old_json="$(gh api "repos/$OLD_REPOSITORY")" || \
  fail "source_repository_not_accessible:$OLD_REPOSITORY"

old_id="$(jq -r '.id' <<<"$old_json")"
old_default="$(jq -r '.default_branch' <<<"$old_json")"
old_visibility="$(jq -r '.visibility' <<<"$old_json")"
admin="$(jq -r '.permissions.admin // false' <<<"$old_json")"

[[ "$admin" == true ]] || fail "repository_admin_permission_required"
[[ "$old_default" == main ]] || fail "unexpected_default_branch:$old_default"

set +e
gh api "repos/$NEW_REPOSITORY" >/tmp/klyrow-new-repository-check.json 2>/dev/null
new_status=$?
set -e
rm -f /tmp/klyrow-new-repository-check.json
[[ "$new_status" -ne 0 ]] || fail "destination_repository_already_exists:$NEW_REPOSITORY"

evidence_root="${KLYROW_RENAME_EVIDENCE_DIR:-repository-rename-evidence}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
evidence="$evidence_root/$stamp"
mkdir -p "$evidence"

gh api --paginate "repos/$OLD_REPOSITORY/branches?per_page=100" \
  --jq '.[].name' | sort -u >"$evidence/branches.before.txt"

gh api --paginate "repos/$OLD_REPOSITORY/pulls?state=all&per_page=100" \
  --jq '.[] | [.number, .state, .draft, .head.ref, .base.ref] | @tsv' \
  >"$evidence/pull-requests.before.tsv"

gh api --paginate "repos/$OLD_REPOSITORY/issues?state=all&per_page=100" \
  --jq '.[] | select(.pull_request == null) | [.number, .state, .title] | @tsv' \
  >"$evidence/issues.before.tsv"

gh api --paginate "repos/$OLD_REPOSITORY/tags?per_page=100" \
  --jq '.[].name' | sort -u >"$evidence/tags.before.txt"

jq -n \
  --arg source "$OLD_REPOSITORY" \
  --arg destination "$NEW_REPOSITORY" \
  --arg repository_id "$old_id" \
  --arg default_branch "$old_default" \
  --arg visibility "$old_visibility" \
  --arg mode "$MODE" \
  '{
    source: $source,
    destination: $destination,
    repository_id: $repository_id,
    default_branch: $default_branch,
    visibility: $visibility,
    mode: $mode,
    live_server_changed: false
  }' >"$evidence/rename-plan.json"

(
  cd "$evidence"
  sha256sum ./* >checksums.before.sha256
)

branch_count_before="$(wc -l <"$evidence/branches.before.txt" | tr -d ' ')"
pr_count_before="$(wc -l <"$evidence/pull-requests.before.tsv" | tr -d ' ')"
issue_count_before="$(wc -l <"$evidence/issues.before.tsv" | tr -d ' ')"

printf 'MODE=%s\n' "$MODE"
printf 'SOURCE_REPOSITORY=%s\n' "$OLD_REPOSITORY"
printf 'DESTINATION_REPOSITORY=%s\n' "$NEW_REPOSITORY"
printf 'REPOSITORY_ID=%s\n' "$old_id"
printf 'DEFAULT_BRANCH=%s\n' "$old_default"
printf 'VISIBILITY=%s\n' "$old_visibility"
printf 'BRANCH_COUNT_BEFORE=%s\n' "$branch_count_before"
printf 'PULL_REQUEST_COUNT_BEFORE=%s\n' "$pr_count_before"
printf 'ISSUE_COUNT_BEFORE=%s\n' "$issue_count_before"
printf 'EVIDENCE_DIRECTORY=%s\n' "$evidence"
printf 'LIVE_SERVER_CHANGED=NO\n'

if [[ "$MODE" == --plan ]]; then
  printf 'REPOSITORY_RENAMED=NO\n'
  printf 'NEXT_COMMAND=bash scripts/rename-klyrow-website-repository.sh --execute\n'
  exit 0
fi

result="$(gh api \
  --method PATCH \
  -H 'Accept: application/vnd.github+json' \
  -H 'X-GitHub-Api-Version: 2022-11-28' \
  "repos/$OLD_REPOSITORY" \
  -f "name=$NEW_NAME")" || fail "github_repository_rename_failed"

new_id="$(jq -r '.id' <<<"$result")"
new_full_name="$(jq -r '.full_name' <<<"$result")"
new_default="$(jq -r '.default_branch' <<<"$result")"

[[ "$new_id" == "$old_id" ]] || fail "repository_identity_changed"
[[ "$new_full_name" == "$NEW_REPOSITORY" ]] || \
  fail "unexpected_new_repository_name:$new_full_name"
[[ "$new_default" == "$old_default" ]] || fail "default_branch_changed"

gh api --paginate "repos/$NEW_REPOSITORY/branches?per_page=100" \
  --jq '.[].name' | sort -u >"$evidence/branches.after.txt"

diff -u "$evidence/branches.before.txt" "$evidence/branches.after.txt" \
  >"$evidence/branches.diff" || {
    cat "$evidence/branches.diff" >&2
    fail "branch_inventory_changed_after_rename"
  }

gh api --paginate "repos/$NEW_REPOSITORY/pulls?state=all&per_page=100" \
  --jq '.[] | [.number, .state, .draft, .head.ref, .base.ref] | @tsv' \
  >"$evidence/pull-requests.after.tsv"

gh api --paginate "repos/$NEW_REPOSITORY/issues?state=all&per_page=100" \
  --jq '.[] | select(.pull_request == null) | [.number, .state, .title] | @tsv' \
  >"$evidence/issues.after.tsv"

gh api --paginate "repos/$NEW_REPOSITORY/tags?per_page=100" \
  --jq '.[].name' | sort -u >"$evidence/tags.after.txt"

cmp -s "$evidence/pull-requests.before.tsv" "$evidence/pull-requests.after.tsv" || \
  fail "pull_request_inventory_changed_after_rename"
cmp -s "$evidence/issues.before.tsv" "$evidence/issues.after.tsv" || \
  fail "issue_inventory_changed_after_rename"
cmp -s "$evidence/tags.before.txt" "$evidence/tags.after.txt" || \
  fail "tag_inventory_changed_after_rename"

(
  cd "$evidence"
  sha256sum ./* >checksums.after.sha256
)

printf 'CANONICAL_REPOSITORY=%s\n' "$NEW_REPOSITORY"
printf 'REPOSITORY_ID_PRESERVED=YES\n'
printf 'DEFAULT_BRANCH_PRESERVED=YES\n'
printf 'BRANCH_COUNT_MATCH=YES\n'
printf 'PULL_REQUEST_INVENTORY_MATCH=YES\n'
printf 'ISSUE_INVENTORY_MATCH=YES\n'
printf 'TAG_INVENTORY_MATCH=YES\n'
printf 'REPOSITORY_RENAMED=YES\n'
printf 'LIVE_SERVER_CHANGED=NO\n'
printf '\nUpdate local remotes with:\n'
printf 'git remote set-url origin git@github.com:%s.git\n' "$NEW_REPOSITORY"
