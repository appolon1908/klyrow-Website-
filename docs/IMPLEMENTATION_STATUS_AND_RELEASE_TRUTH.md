# Klyrow Website — Implementation Status and Release Truth

## Purpose

This document prevents planning artifacts, empty branches, draft pull requests, or passing unit tests from being presented as a finished or live website.

## Current repository truth

```text
PLANNING_DOCUMENTS=AVAILABLE
FOCUSED_BRANCH_SCAFFOLDS=AVAILABLE
APPLICATION_CODE=NOT_COMPLETE
MAIN_PRODUCTION_BASELINE=NOT_READY
STAGING=NOT_ACTIVE
PRODUCTION=NOT_ACTIVE
PUBLIC_DOMAIN_VERIFIED=NO
```

The presence of a branch, pull request, task file, Docker plan, Caddy plan, or release branch does not mean the feature is implemented.

## Allowed status vocabulary

Every branch and release report must use only these states:

```text
PLANNED
SCAFFOLDED
IN_PROGRESS
IMPLEMENTED_NOT_VERIFIED
VERIFIED_IN_CI
VERIFIED_IN_STAGING
RELEASE_CANDIDATE
LIVE
ROLLED_BACK
BLOCKED
```

Definitions:

- `PLANNED`: requirements exist; no implementation exists.
- `SCAFFOLDED`: branch/task/PR exists; implementation is still missing.
- `IN_PROGRESS`: code changes exist but required checks are incomplete.
- `IMPLEMENTED_NOT_VERIFIED`: implementation exists but complete evidence is missing.
- `VERIFIED_IN_CI`: all branch-scoped automated checks passed on the exact SHA.
- `VERIFIED_IN_STAGING`: the exact immutable artifact passed staging checks.
- `RELEASE_CANDIDATE`: reviewed feature work is integrated and all release gates except production activation passed.
- `LIVE`: the exact release is serving the public domain and post-deploy checks passed.
- `ROLLED_BACK`: production was reverted to the recorded prior release.
- `BLOCKED`: a named external or technical requirement prevents progression.

## Prohibited wording

Do not say any of the following unless evidence supports it on the exact SHA:

```text
finished
complete
production ready
live
launched
all APIs ready
all forms working
Google tests passed
Lighthouse passed
Odoo connected
n8n connected
Docker deployed
TLS active
```

Use evidence-based wording instead:

```text
The branch task is prepared.
The endpoint contract is defined but not implemented.
The feature is implemented on SHA X and tests Y passed.
The staging artifact digest X passed checks Y.
The production domain returned status X at time Y.
```

## Required status block in every PR

Every feature PR must keep this block current:

```text
FEATURE_STATUS=
APPLICATION_CODE_PRESENT=
TARGETED_TESTS=
FULL_CHECKS=
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

Every ops/release PR must additionally report:

```text
IMAGE_DIGEST=
STAGING_STATUS=
CADDY_VALIDATION=
DNS_STATUS=
TLS_STATUS=
ROLLBACK_REHEARSAL=
PRODUCTION_STATUS=
```

## Required evidence for `LIVE`

A release may be called live only when all are true:

1. exact release commit and immutable image digest are recorded;
2. required PRs were reviewed and merged;
3. CI passed on the exact release SHA;
4. staging passed with the same artifact;
5. route, locale, CTA, form, API, legal-page, SEO, accessibility, and performance checks passed;
6. middleware durable acceptance was verified;
7. approved Odoo and n8n test routing passed;
8. Docker and container security checks passed;
9. DNS points to the intended host;
10. Caddy validates and only the Klyrow site fragment changed;
11. TLS is active;
12. health/readiness pass;
13. rollback was rehearsed;
14. the public domain was checked after deployment;
15. unrelated services remained unchanged.

## Repository surfaces

- `main`: release baseline only; do not imply it is live when it contains no deployable application.
- `planning/production-website-blueprint`: architecture and implementation contracts.
- feature branches: isolated implementation work.
- ops branches: Docker/Caddy implementation and staging evidence.
- `release/website-production-v1`: final integration, production activation, verification, and rollback evidence.

## Release communication

Any public or internal launch note must include:

```text
Release SHA
Image digest
Deployment timestamp
Production URL
Health result
Rollback target
Known limitations
```

Planning progress and production status must never be combined into a single ambiguous percentage.