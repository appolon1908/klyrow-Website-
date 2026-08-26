# Codex Task — Review Klyrow Website Secure GitOps Scaffolding

## Repository and branch

```text
repository: appolon1908-hue/klyrow-Website
branch:     ops/gitops-secure-delivery
base:       release/website-production-v1
```

## Mission

Review, test and improve the GitOps CI/deployment scaffolding without changing the provider host, staging, Nginx, Docker, DNS or public traffic.

The task is complete only when the repository proves:

```text
GITOPS_PLAN=PASS
GITOPS_APPLY=BLOCKED_WHILE_RUNTIME_UNVERIFIED
LEGACY_DEPLOY_WORKFLOWS=DISABLED
DIRECT_DEPLOY_SCRIPT=DISABLED
LIVE_SERVER_CHANGED=NO
```

## Required reading

Read completely:

1. `docs/GITOPS_SECURE_DELIVERY.md`
2. `ops/gitops/OPERATOR_CONTRACT.md`
3. `ops/gitops/runtime-paths.schema.json`
4. `ops/gitops/release-intent.schema.json`
5. `ops/gitops/environments/production/runtime-paths.json`
6. `ops/gitops/environments/production/deployment-policy.json`
7. all `ops/gitops/scripts/*`
8. all `.github/workflows/gitops-*.yml`
9. deprecated provider deployment workflows
10. `ops/scripts/deploy-production.sh`
11. the provider-host Docker, Nginx and release runbooks.

## Preflight

Print:

```text
REPOSITORY=
DIRECTORY=
BRANCH=
STARTING_SHA=
GIT_STATUS=
NODE_VERSION=
PYTHON_VERSION=
BASH_VERSION=
```

Confirm the active checkout is not a live release directory and that no host deployment credential is needed for this review.

## Security review requirements

### Git ref integrity

- Production apply must run only from `main`.
- `intent_commit` must equal the current `origin/main` head.
- The release SHA must be reachable from `main`.
- No arbitrary branch, tag, manifest path or script path may be supplied to apply.

### Artifact integrity

- Require an immutable GHCR `@sha256:` image.
- Require an SBOM digest.
- Require runtime-path, staging and rollback evidence digests.
- Require exact reviewed PR head SHAs.
- Reject placeholders in plan/apply modes.

### Runtime identity

- Plan must pass with `runtime-paths.json` set to `unverified`.
- Apply must fail while it remains unverified.
- Verified mode must require host name, expected IPs, hashed machine ID, exact paths, ports, discovery checksum and review PR.
- Paths must remain inside approved roots.
- Reserved or protected ports must be rejected.

### Privilege boundary

- Read-only discovery must refuse root.
- The apply runner must refuse root.
- No broad sudo command is allowed.
- The only future elevation is the exact root-owned operator path.
- Reject group/world-writable operators.
- Do not install the operator or alter sudoers in this branch.

### Workflow boundary

- GitOps verification runs on GitHub-hosted runners only.
- Runtime discovery is manual, main-only, non-root and artifact-only.
- Apply requires the protected `production` environment and provider runner labels.
- Workflow tokens use minimum permissions.
- Legacy deployment workflows must remain blocked.
- No PR workflow may deploy staging or production.

### Scope isolation

Confirm the GitOps flow cannot mutate:

```text
Postal
SMTP
live email delivery
billing
Odoo accounting
unrestricted n8n
Keycloak
Kyqra
DNS
unrelated Nginx sites
the complete Docker/provider stack
```

## Required checks

Run at minimum:

```bash
python3 -m py_compile ops/gitops/scripts/*.py
bash -n ops/gitops/scripts/*.sh
python3 ops/gitops/scripts/validate-runtime-paths.py \
  ops/gitops/environments/production/runtime-paths.json \
  ops/gitops/environments/production/deployment-policy.json \
  --mode plan

! python3 ops/gitops/scripts/validate-runtime-paths.py \
  ops/gitops/environments/production/runtime-paths.json \
  ops/gitops/environments/production/deployment-policy.json \
  --mode apply

python3 ops/gitops/scripts/validate-release-intent.py \
  ops/gitops/environments/production/release-intent.example.json \
  ops/gitops/environments/production/deployment-policy.json \
  ops/gitops/environments/production/runtime-paths.json \
  --mode example

ops/gitops/scripts/plan-deployment.sh
```

Add negative tests for:

- mutable image tag;
- zero placeholder in plan mode;
- runtime path outside `/srv/klyrow-website`;
- Nginx path outside `/etc/nginx`;
- identical staging/production ports;
- protected port selection;
- unapproved release intent;
- runtime digest mismatch;
- insufficient reviewed PRs;
- intent commit not current main;
- release SHA not reachable from main;
- writable or unexpected operator path.

## Allowed changes

- validators and tests;
- workflow hardening;
- clearer plan output;
- documentation and runbook corrections;
- safe static analysis;
- additional fail-closed checks.

## Prohibited

Do not:

- run runtime discovery from a local or unrelated host;
- invoke the self-hosted provider runner;
- install a runner or operator;
- change sudoers;
- create `release-intent.json` with invented evidence;
- mark runtime paths verified;
- connect to `37.27.128.39`;
- run Docker or Nginx commands against a live host;
- deploy staging or production;
- alter DNS, TLS or public traffic;
- print or commit secrets.

## Completion report

Post to the GitOps PR:

1. starting and final SHA;
2. commits and changed files;
3. threat model findings;
4. workflow permission/ref review;
5. validator positive and negative test results;
6. exact plan output;
7. confirmation that apply remains blocked;
8. remaining external configuration steps;
9. known blockers;
10. confirmation that the live provider host was unchanged.

Stop after the review. Do not begin runtime discovery or production apply.