# Provider-host Nginx edge

Target: `37.27.128.39` / `10.40.0.4`, existing Nginx and Certbot.

1. Run `audit-provider-nginx.sh` and identify the exact live Klyrow site file.
2. Record all protected listeners, containers and configured health URLs.
3. Back up `/etc/nginx` and verify the generated SHA-256 checksum.
4. Build a candidate that removes only `klyrow.com` and `www.klyrow.com` from the legacy combined site while preserving `app`, `api`, `track` and `bounce`.
5. Validate the isolated candidate using the system Nginx prefix and validate the complete live configuration before any reload.
6. Stage only the loopback Nginx listener against the website staging container.
7. Rehearse checksum-verified rollback.
8. During the final release only, start the exact immutable production image on loopback, set `KLYROW_OWNER_GO=YES`, install the candidate, reload Nginx only, verify apex/`www`, and recheck every protected service.

Never install Caddy, restart the Docker daemon or provider stack, expose website loopback ports, change Postal/SMTP/billing, commit TLS keys, or overwrite unrelated Nginx files.
