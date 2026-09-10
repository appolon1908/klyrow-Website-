# Restricted Provider-Host Operator Contract

The GitHub runner must not receive broad root access. Production apply may invoke exactly one host-installed operator:

```text
/usr/local/libexec/klyrow-website-gitops-operator
```

The operator is provisioned outside Git after runtime-path review. It must be:

```text
owner: root
mode: 0755 or more restrictive
not group/world writable
not a symlink into a writable directory
```

## Accepted arguments

```text
--runtime <absolute reviewed runtime-paths.json>
--policy <absolute reviewed deployment-policy.json>
--intent <absolute reviewed release-intent.json>
--repository-root <absolute exact checkout>
```

The operator must reject every additional argument and must not accept shell fragments, commands, URLs, image overrides, manifest overrides or arbitrary environment-file paths.

## Mandatory internal checks

Before mutation, the operator independently revalidates:

- host public/private IP;
- SHA-256 machine fingerprint;
- exact current `main` intent commit;
- release SHA reachable from `main`;
- immutable GHCR digest;
- reviewed runtime-path digest;
- root-owned secrets directory and exact required secret files;
- exact Nginx and Compose paths;
- free/expected staging and production listeners;
- Nginx configuration validity;
- existing Klyrow app/API and protected services;
- previous immutable image and checksummed Nginx rollback target.

The operator must call repository deployment scripts by absolute path from the verified checkout and must never execute a generated shell command.

## Required sudoers shape

Use a dedicated unprivileged account such as `klyrow-deploy`. A sudoers entry may authorize only the exact operator executable, not a shell or wildcarded subsystem command.

Example policy concept:

```text
Cmnd_Alias KLYROW_WEBSITE_GITOPS = /usr/local/libexec/klyrow-website-gitops-operator --runtime * --policy * --intent * --repository-root *
klyrow-deploy ALL=(root) NOPASSWD: KLYROW_WEBSITE_GITOPS
```

The example still requires host-side argument validation by the operator. Prefer a sudoers plugin/wrapper capable of fixed path matching where available.

Never authorize:

```text
sudo bash
sudo sh
sudo docker *
sudo systemctl *
sudo nginx *
NOPASSWD: ALL
```

## Deployment scope

The operator may manage only:

- the Klyrow Website release directory;
- the Klyrow Website production Compose service;
- the reviewed Klyrow apex/`www` Nginx site candidate;
- the website evidence and rollback directories;
- a graceful Nginx validation/reload through its internal fixed implementation.

It may not modify Postal, SMTP, Klyrow app/API services, Mautic, Grafana, billing, Keycloak, Kyqra, Odoo, n8n, DNS, Docker daemon configuration or unrelated Nginx sites.

## Installation gate

Do not install the operator until:

1. read-only runtime discovery is complete;
2. `runtime-paths.json` is verified by pull request;
3. the operator source receives independent review;
4. the restricted runner account and sudoers policy are reviewed;
5. staging and rollback are certified.

Until then, GitOps remains plan-only.