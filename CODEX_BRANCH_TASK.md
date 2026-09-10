# Codex Branch Task — Modular Website Architecture Cleanup

## Branch

```text
refactor/modular-website-architecture
```

## Status

```text
FEATURE_STATUS=SCAFFOLDED
APPLICATION_CODE_PRESENT=NO
STAGING_CHANGED=NO
PRODUCTION_CHANGED=NO
```

## Prerequisite

Use the latest accepted `planning/production-website-blueprint` SHA. Read completely:

1. `docs/IMPLEMENTATION_STATUS_AND_RELEASE_TRUTH.md`
2. `docs/REPOSITORY_ARCHITECTURE_AND_API_CATALOG.md`
3. `docs/BRANCH_AND_DELIVERY_PLAN.md`
4. `docs/API_FORM_CTA_CONTRACT.md`
5. `docs/LEGAL_PRIVACY_COOKIE_COMPLIANCE.md`
6. the remaining production, content, form, SEO, Docker, and Caddy contracts.

## Objective

Create the clean modular repository foundation before adding user-facing features. The repository began planning-only, so build the correct structure now instead of creating a temporary root-level application that must be moved later.

This branch owns architecture and developer-experience foundations only. It must not implement bulk pages, conversion features, real forms, production middleware integration, legal content, analytics, Docker/Caddy deployment, or public production.

## Required workspace

Create a lightweight pnpm workspace:

```text
apps/web
packages/contracts
packages/content-schema
packages/design-tokens
packages/i18n
packages/analytics-contracts
packages/test-utils
packages/eslint-config
ops
```

Use Nuxt 4, Vue 3, strict TypeScript, Node 22 active LTS or later supported active LTS, Corepack, and a committed `pnpm-lock.yaml`.

Do not introduce Nx/Turborepo unless measured evidence demonstrates a need and the PR explains the added operational cost.

## Required implementation

### Root foundation

- root `package.json` with safe workspace scripts;
- `pnpm-workspace.yaml`;
- `tsconfig.base.json`;
- `.editorconfig`;
- `.gitignore`;
- one formatter configuration;
- shared ESLint configuration;
- dependency boundary rules;
- root type-check/lint/test/build commands;
- package export maps;
- Node/pnpm version constraints;
- no secrets or production values.

### Nuxt application boundary

Under `apps/web`, create the minimal Nuxt 4 application foundation with:

- `app`, `server`, `content`, `legal`, `public`, and `tests` boundaries;
- no substantial marketing copy or final visual design;
- one minimal health-rendering page used only to prove the scaffold builds;
- SSR enabled;
- strict runtime configuration separation;
- client-safe versus server-only imports;
- foundational error boundary;
- no third-party analytics or integrations.

### Shared contracts

Create typed interfaces/schemas for:

- request context;
- success envelope;
- RFC 7807 problem response;
- route definition;
- CTA definition;
- form definition;
- API operation definition;
- legal-document definition;
- cookie/storage technology definition;
- website domain-event envelope;
- durable middleware acceptance.

Use a schema library only once and share contracts between client and server. Avoid duplicate request types.

### Central configuration

Create a typed configuration module that classifies settings:

```text
PUBLIC_SAFE
SERVER_SECRET
SERVER_NON_SECRET
RELEASE_REQUIRED
OPTIONAL_INTEGRATION
```

Tests must prove server secrets cannot appear in public runtime config or client bundles.

### Module boundaries

Enforce:

```text
UI -> composables/client services -> shared contracts
API routes -> services -> repositories/adapters
```

Block:

- UI imports from server adapters;
- services importing Vue components;
- API routes directly importing Odoo/n8n-specific mappings;
- server secrets in client code;
- circular package dependencies;
- root catch-all `utils.ts`, `api.ts`, or `types.ts` dumping grounds.

### API foundation interfaces

Create interfaces, not final endpoint behavior, for:

- request IDs;
- idempotency store;
- rate/body/cost limits;
- origin/CSRF validation;
- safe redirects;
- middleware adapter;
- structured logging;
- metrics;
- health/readiness dependencies.

### Test foundation

Configure:

- unit tests;
- Nuxt component tests;
- API integration-test harness;
- contract snapshots;
- Playwright configuration without production access;
- axe integration foundation;
- test fixtures and builders.

## Code quality

- strict TypeScript;
- no unbounded `any` in application code;
- no disabled type/lint checks to make CI green;
- no generated code committed unless required and reproducible;
- no application file that combines unrelated domains;
- review warnings for oversized modules/functions;
- unused-export detection;
- dependency and secret scans.

## Required CI

Add or update PR CI to run, at minimum:

```text
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Include module-boundary, public-config-secret-exclusion, and package-contract tests.

Do not add production deployment.

## Required evidence

Report:

1. repository, directory, branch, starting SHA, final SHA;
2. created workspace tree;
3. every commit and changed file;
4. dependency graph and enforced boundaries;
5. shared contracts created;
6. configuration classification and secret-exclusion evidence;
7. exact install/type/lint/test/build results;
8. dependency and secret-scan results;
9. known limitations;
10. confirmation that no user-facing feature, middleware/Odoo/n8n integration, Docker/Caddy deployment, staging, or production behavior was added.

## Prohibited

- no production deployment;
- no direct Odoo/n8n/middleware calls;
- no live forms;
- no legal text presented as approved;
- no analytics SDK;
- no Docker/Caddy activation;
- no production secret;
- no force-push after review begins.

After pushing implementation and evidence to the draft PR, stop before `feat/site-shell-design-system`.