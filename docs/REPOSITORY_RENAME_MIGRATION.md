# Canonical Repository Rename — Klyrow Website

## Objective

Rename the existing repository without copying or losing history:

```text
from: appolon1908-hue/klyrow-Website-
to:   appolon1908-hue/klyrow-Website
```

The destination name is currently unused. The safe operation is a GitHub repository rename, not a file-by-file copy. Renaming preserves the repository identity, commit graph, all branches, pull requests, issues, Actions history, environments, deploy keys, releases and tags under the same repository object.

## Current inventory

At preparation time the source repository contains 24 branches:

```text
feat/analytics-consent
feat/content-localization-pages
feat/feature-pricing-conversion
feat/forms-conversion-engine
feat/interactive-tools
feat/legal-privacy-cookie-center
feat/middleware-odoo-n8n
feat/nuxt4-marketing-site
feat/public-api-bff
feat/seo-structured-data
feat/site-shell-design-system
feat/website-odoo-n8n-forms
feat/website-seo-performance
main
ops/caddy-edge
ops/caddy-production
ops/docker-runtime
ops/gitops-secure-delivery
ops/provider-host-nginx-edge
perf/core-web-vitals-accessibility
planning/production-website-blueprint
refactor/modular-website-architecture
release/website-production-readiness
release/website-production-v1
```

The rename script captures the live branch, pull-request and issue inventory before mutation and verifies the branch list after mutation.

## Safety rules

- Do not create a second empty repository and copy only `main`.
- Do not force-push branch histories.
- Do not delete the source repository.
- Do not change the live provider host, Nginx, Docker, DNS or public traffic.
- Do not execute the rename until the authenticated GitHub user has repository administration permission.
- Do not execute when `appolon1908-hue/klyrow-Website` already exists.
- Preserve the repository visibility and default branch.

## Execute

From a trusted workstation or server with an authenticated GitHub CLI:

```bash
bash scripts/rename-klyrow-website-repository.sh --plan
bash scripts/rename-klyrow-website-repository.sh --execute
```

The script uses GitHub's repository update API to rename the same repository object. It writes only non-secret inventory evidence locally.

## Update local clones

After the rename, each existing checkout should use the canonical remote:

```bash
git remote set-url origin \
  git@github.com:appolon1908-hue/klyrow-Website.git

git remote -v
git fetch --prune origin
```

For the provider-host Codex workspace:

```bash
git -C /srv/codex-workspaces/klyrow-Website- remote set-url origin \
  git@github.com:appolon1908-hue/klyrow-Website.git

git -C /srv/codex-workspaces/klyrow-Website- fetch --prune origin
```

The workspace directory may be renamed separately after confirming that no active runner or Codex process uses it. Directory renaming is not required for Git functionality.

## Follow-up validation

Confirm:

```text
CANONICAL_REPOSITORY=appolon1908-hue/klyrow-Website
DEFAULT_BRANCH=main
BRANCH_COUNT_MATCH=YES
OPEN_PULL_REQUESTS_PRESENT=YES
ISSUES_PRESENT=YES
GITOPS_BRANCH_PRESENT=YES
PRODUCTION_RELEASE_BRANCH_PRESENT=YES
LIVE_SERVER_CHANGED=NO
```

Then update external systems that store the clone URL literally, including local Git remotes, Codex workspace instructions and any deployment runner checkout configuration. Existing GitHub repository-scoped configuration remains attached to the same repository identity, but external URLs should still be corrected.