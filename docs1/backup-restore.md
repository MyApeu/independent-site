# Backup and restore

The database holds inquiries (personal data), so backups are sensitive. Encrypt
them and restrict access. Test a restore at least once before launch.

## What to back up

1. PostgreSQL database (`pg_dump`).
2. Uploaded files (`server/uploads` or the object-storage bucket) — **not**
   covered by `pg_dump`; the database only stores URLs/keys.
3. `docs1/.env` and reverse-proxy/TLS configuration — store secrets in a
   password manager, not in the backup archive itself.

## Docker (this package)

```bash
# Logical backup (custom format, compressed)
docker compose exec -T db pg_dump \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --format=custom --no-owner --no-privileges \
  > "backups/jintaihong-$(date +%Y%m%d-%H%M).dump"

# Plain SQL (portable, good for review)
docker compose exec -T db pg_dump \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --no-owner --no-privileges \
  > "backups/jintaihong-$(date +%Y%m%d-%H%M).sql"
```

`mkdir -p backups` first. On Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
docker compose exec -T db pg_dump -U jintaihong -d jintaihong --format=custom --no-owner --no-privileges |
  Set-Content -Encoding Byte "backups/jintaihong-$(Get-Date -Format yyyyMMdd-HHmm).dump"
```

(PowerShell redirection can corrupt binary output; prefer `cmd /c` redirection
or run `pg_dump` from a Linux shell/WSL.)

## Restore

Restore into an **empty** database (the dump contains the schema and data):

```bash
# Stop the app/API first so no writes race the restore.
docker compose exec -T db dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB"
docker compose exec -T db createdb -U "$POSTGRES_USER" "$POSTGRES_DB"

docker compose exec -T db pg_restore \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --no-owner --no-privileges --clean --if-exists \
  < backups/jintaihong-YYYYMMDD-HHMM.dump
```

Or from a plain SQL file:

```bash
docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -v ON_ERROR_STOP=1 < backups/jintaihong-YYYYMMDD-HHMM.sql
```

After restoring, run `ANALYZE;`, verify row counts, then restart the API. The
`docker-entrypoint-initdb.d` scripts do **not** run again because the volume is
not empty.

## Verify a backup

```bash
# List archive contents without restoring
pg_restore --list backups/jintaihong-YYYYMMDD-HHMM.dump | head -40

# Spot-check counts in the target
docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
  SELECT 'inquiries' AS table, count(*) FROM inquiries
  UNION ALL SELECT 'products', count(*) FROM products
  UNION ALL SELECT 'media_assets', count(*) FROM media_assets;"
```

Run a full restore into a temporary database (e.g. `jintaihong_restore_test`) at
least quarterly.

## Retention schedule (suggested)

| Frequency | Keep | Where |
|---|---|---|
| Daily | 14 days | local disk / server volume |
| Weekly | 8 weeks | off-site encrypted storage |
| Monthly | 12 months | off-site, immutable/versioned bucket |
| Before schema changes | 1 snapshot | off-site |

Use `pg_dump` for logical backups; for large databases enable WAL archiving and
point-in-time recovery (e.g. `pgBackRest` or a managed provider). Managed
PostgreSQL usually offers automated backups + PITR — enable both.

## Uploads

```bash
tar -czf "backups/uploads-$(date +%Y%m%d).tar.gz" server/uploads
```

Back up object storage with its native versioning/replication. Keep database and
file backups from the same point in time when possible.

## Security

- Encrypt archives (age/GPG) and store encryption keys separately.
- Never commit backups; `docs1/.gitignore` already excludes `backups/` and
  `*.dump`.
- Restrict restore access to trusted operators; restoring replaces data.
- Before deleting a server or volume, take a final dump and copy it off-site.
- Periodically prune old backups; personal data should not live forever.
