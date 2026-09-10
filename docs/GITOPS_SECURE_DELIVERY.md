# Klyrow Website — Secure GitOps Delivery

## Objective

Prepare, review and certify deployment configuration through Git while leaving the provider host unchanged until its real runtime paths and host identity are independently verified.

Production target:

```text
public IP:  37.27.128.39
private IP: 10.40.0.4
edge:       existing Nginx + Certbot
```

The website must preserve the existing Klyrow application/API, Postal, SMTP, tracking, bounce, Mautic, Grafana, billing, identity/private gateway, Kyqra and unrelated services.

## Core rule

```text
Git describes desired state.
CI validates desired state.
A read-only host job discovers actual state.
A reviewed PR records verified runtime paths.
A protected environment approves one exact release intent.
A restricted host operator applies that intent.
```

No workflow may guess a live path, accept an arbitrary host manifest path, deploy a mutable tag, execute an arbitrary Git ref, or use broad sudo.

## Repository-owned state

The following files are authoritative after review:

```text
ops/gitops/environments/production/runtime-paths.json
ops/gitops/environments/production/deployment-policy.json
ops/gitops/environments/production/release-intent.json
```

`runtime-paths.json` starts with `status: unverified`. Production apply remains impossible until a separate PR changes it to `verified` and includes:

- provider-host hostname;
- SHA-256 of `/etc/machine-id` rather than its raw value;
- exact Nginx root and legacy Klyrow site path;
- exact release, secrets and Compose paths;
- exact restricted operator path;
- confirmed loopback ports;
- discovery artifact checksum;
- reviewer and verification timestamp.

## GitOps flow

### 1. Pull-request verification

`.github/workflows/gitops-verify.yml` performs only repository checks:

- validates runtime-path and release-intent schemas;
- proves the production runtime file is either safely unverified or complete;
- rejects mutable image tags;
- rejects non-GHCR or non-digest images;
- rejects paths outside approved roots;
- checks shell and Python syntax;
- generates a non-mutating deployment plan.

### 2. Read-only runtime discovery

`.github/workflows/gitops-runtime-discovery.yml` runs manually on the restricted `klyrow-provider` runner under the `provider-readonly` environment.

It does not use sudo and does not write to `/etc`, `/srv`, Docker, Nginx, systemd or application directories. It records only non-secret metadata:

- host/IP identity;
- hashed machine ID;
- command and service paths;
- candidate release directories;
- listeners and container names;
- Nginx validation result when readable;
- file owner/mode metadata without file contents.

The output is an artifact. It is never committed automatically. A human reviews it and creates the runtime-path verification PR.

### 3. Release intent

A production release is represented by one fixed repository file. The intent binds:

- source repository;
- exact 40-character source SHA reachable from `main`;
- immutable GHCR image digest;
- SBOM digest;
- reviewed PR heads;
- staging evidence digest;
- rollback evidence digest;
- legal release state or approved exception;
- intended runtime-path revision.

No workflow input may substitute a different manifest path.

### 4. Plan

`.github/workflows/gitops-promote.yml` defaults to `plan`.

The workflow checks out an exact commit and requires it to equal the current `origin/main` head. It then validates the fixed production runtime and release-intent files and publishes a plan artifact. This job runs on GitHub-hosted infrastructure and cannot alter the provider host.

### 5. Apply

The `apply` job is separate and requires all of the following:

```text
mode=apply
intent commit equals current main
runtime paths status=verified
release SHA is reachable from main
immutable image digest
protected production environment approval
self-hosted runner label klyrow-provider
exact host and machine fingerprint match
root-owned, non-writable restricted operator
```

The runner does not receive unrestricted root access. It may invoke only the reviewed operator path recorded in `runtime-paths.json`, using one narrowly scoped sudoers rule. The operator receives only the fixed repository runtime and intent files.

## Required GitHub settings

Configure outside Git:

- protect `main`;
- require pull requests;
- require exact-head CI;
- require an independent approval for workflow, runtime, Nginx and release-intent changes;
- dismiss stale approvals after new commits;
- restrict production environment deployment to the approved branch/ref policy;
- require production environment reviewers;
- prevent self-approval where supported;
- install a restricted self-hosted runner account without broad sudo;
- give the workflow token `contents: read` and `packages: read` only.

## Prohibited sudo patterns

Never authorize:

```text
sudo bash
sudo sh
sudo docker *
sudo systemctl *
sudo nginx *
NOPASSWD: ALL
```

The only permitted production elevation is a specific, root-owned operator binary/script with fixed argument shapes and no shell escape.

## Runtime-path verification acceptance

Runtime paths are considered verified only when:

1. read-only discovery completed on `37.27.128.39`;
2. the artifact checksum is recorded;
3. paths are absolute and within approved roots;
4. production/staging ports are free or owned by the expected website service;
5. Nginx and legacy Klyrow paths match the actual host;
6. the restricted operator exists, is root-owned and is not group/world writable;
7. protected Klyrow services are inventoried;
8. an independent reviewer approves the runtime-path PR.

Until then:

```text
GITOPS_PLAN=AVAILABLE
GITOPS_APPLY=BLOCKED
LIVE_SERVER_CHANGED=NO
```

## Rollback

Every apply intent must identify the previous immutable image and checksummed Nginx backup. The operator must stop and roll back when health, readiness, HTTPS, routes, forms, app/API protection or soak checks fail. Failed candidates and evidence remain available for investigation.

## Scope exclusion

This GitOps flow authorizes only the public Klyrow Website release. It does not authorize Postal/SMTP changes, live email activation, real billing, Odoo accounting mutation, unrestricted n8n activation, Keycloak/Kyqra changes, DNS mutation or unrelated service changes.