#!/usr/bin/env bash
set -Eeuo pipefail

cat >&2 <<'EOF'
ERROR=direct_production_deploy_disabled

Production deployment is controlled by the reviewed GitOps flow:

  .github/workflows/gitops-promote.yml
  ops/gitops/scripts/apply-deployment.sh
  /usr/local/libexec/klyrow-website-gitops-operator

The legacy direct script is intentionally fail-closed because provider-host
runtime paths have not been verified and the previous release branch referenced
host helper scripts that were not present in the same reviewed tree.

Required before apply:

  1. read-only provider runtime discovery;
  2. reviewed runtime-paths.json with status=verified;
  3. approved repository-owned release-intent.json;
  4. exact current main intent commit;
  5. immutable image digest and SBOM;
  6. staging and rollback evidence;
  7. protected production environment approval;
  8. root-owned restricted operator installation.

No live server change was attempted.
EOF

exit 1
