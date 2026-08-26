# Klyrow Website provider-host production release

Target: `37.27.128.39` / `10.40.0.4`, existing Nginx and Certbot.

## Required inputs

- exact reviewed 40-character release SHA;
- immutable `ghcr.io/...@sha256:...` image reference;
- release manifest matching the SHA and digest;
- SBOM/provenance references;
- independently reviewed PR heads;
- readable middleware secret files;
- exact live legacy Nginx site path;
- verified DNS for apex and all protected Klyrow hostnames;
- previous known-good release and checksummed Nginx backup;
- explicit owner GO through the protected GitHub production environment.

## Sequence

1. Run the provider-host preflight.
2. Capture listeners, containers, Nginx and protected-service health.
3. Back up `/etc/nginx` and build the audited hostname-split candidate.
4. Pull the immutable image digest and start it only on `127.0.0.1:18110`.
5. Run health, readiness, page, legal, sitemap, API and container-security smoke tests.
6. Validate the complete Nginx configuration.
7. Switch only apex and `www`, reload Nginx only, and verify HTTPS/redirect/cache/security behavior.
8. Recheck `app`, `api`, `track`, `bounce`, Postal, SMTP, Klyrow, Mautic, Grafana, billing and Kyqra health.
9. Soak the release and mark it current only after every check remains healthy.
10. Preserve the previous image, release directory, Nginx archive and evidence.

Any failed gate triggers the rehearsed rollback. Do not restart the Docker daemon or provider stack, modify Postal/SMTP/billing, bypass a missing secret or DNS record, or invent test evidence.
