# Jintaihong website — database package

PostgreSQL 16 data layer for the Shenzhen Jintaihong Packaging Products website:
schema, seed data, admin bootstrap, Docker setup, Prisma mirror and operating
docs.

> **Honest status:** this is a **database package only**. The React site in this
> repository still stores content in browser `localStorage` (`jth_homepage`,
> `jth_media`, `jth_admin_auth`) and its admin login is a demo constant. There is
> no API server, no upload endpoint and no authentication wired to this database.
> Do not describe the live site as database-backed until the integration work in
> [Front-end integration](#front-end-integration-not-done) is completed.

## What is included

| File | Purpose |
|---|---|
| `schema.sql` | Full PostgreSQL schema: tables, enums, indexes, triggers, view |
| `seed.sql` | 7 categories, 4 capabilities, media, locales, homepage, SEO, English strings |
| `create-admin.sql` | Create/reset an admin with a bcrypt password |
| `reset.sql` | **Destructive** development reset |
| `docker-compose.yml` | PostgreSQL 16 with automatic schema+seed on first start |
| `.env.example` | Environment template (copy to `.env`) |
| `prisma/schema.prisma` | Typed Prisma mirror of `schema.sql` (validated) |
| `prisma/seed.ts` | Optional TypeScript seed, same data as `seed.sql` |
| `package.json` | Prisma/tsx scripts for the optional TS tooling |
| `er-diagram.md` | Mermaid ER diagram and relationship rules |
| `data-dictionary.md` | Column-by-column reference and business rules |
| `api-contract.md` | Proposed REST API (**design only, not implemented**) |
| `backup-restore.md` | Backup, restore, retention and verification |
| `.gitignore` | Excludes `.env`, `node_modules`, backups |

## Requirements

- Docker Desktop / Docker Engine + Compose v2, **or** PostgreSQL 16 with
  `pgcrypto`, `citext`, `pg_trgm`.
- Node.js 20+ only if you want the Prisma tooling.
- No database server is installed in the current development environment, so
  these scripts were reviewed and the Prisma schema was validated, but the SQL
  has **not** been executed against a live server here.

## Quick start (Docker)

```bash
cd docs1
cp .env.example .env
# edit .env: set a long random POSTGRES_PASSWORD and match it in DATABASE_URL
docker compose up -d
docker compose logs -f db
```

On Windows PowerShell:

```powershell
Set-Location docs1
Copy-Item .env.example .env
notepad .env
docker compose up -d
docker compose logs -f db
```

`schema.sql` and `seed.sql` run automatically **only on the first start**, when
the `jth_pgdata` volume is empty. Wait for `database system is ready to accept
connections`, then verify:

```bash
docker compose exec -T db psql -U jintaihong -d jintaihong -c "
  SELECT 'categories' AS t, count(*) FROM product_categories
  UNION ALL SELECT 'capabilities', count(*) FROM capabilities
  UNION ALL SELECT 'locales', count(*) FROM locales
  UNION ALL SELECT 'media', count(*) FROM media_assets;"
```

Expected: categories 7, capabilities 4, locales 9, media 15.

Create the first administrator:

Run from this folder (Linux/macOS/WSL):

```bash
docker compose exec -T db psql -U jintaihong -d jintaihong \
  -v admin_email="you@example.com" \
  -v admin_password="a-long-unique-password" \
  -v admin_name="Your Name" \
  -v admin_role="super_admin" \
  < create-admin.sql
```

PowerShell 5.1 does not support the `<` operator; use `cmd /c`:

```powershell
cmd /c 'docker compose exec -T db psql -U jintaihong -d jintaihong -v admin_email=you@example.com -v admin_password=a-long-unique-password -v admin_name="Your Name" -v admin_role=super_admin < create-admin.sql'
```

`create-admin.sql` is in this folder, not inside `/docker-entrypoint-initdb.d`;
redirect it from the host as shown. Roles: `super_admin`, `editor`, `sales`.
Minimum password length is 12 characters. Re-running with an existing e-mail
resets that password and re-activates the account.

Passwords passed with `-v` can end up in shell history and process listings. On
a shared machine, run `psql` interactively, `\set` the variables there (keep
`HISTFILE` disabled), or use a password manager to inject them. Change any
password that was typed into a shared terminal.

Stop / wipe:

```bash
docker compose down       # keeps data
docker compose down -v    # DESTROYS the jth_pgdata volume
```

Reset schema without removing the volume (development only):

```bash
docker compose exec -T db psql -U jintaihong -d jintaihong -v ON_ERROR_STOP=1 < reset.sql
docker compose exec -T db psql -U jintaihong -d jintaihong -v ON_ERROR_STOP=1 < schema.sql
docker compose exec -T db psql -U jintaihong -d jintaihong -v ON_ERROR_STOP=1 < seed.sql
```

## Manual PostgreSQL install

```bash
createdb jintaihong
export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jintaihong?schema=public"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f seed.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -v admin_email="you@example.com" -v admin_password="..." \
  -v admin_name="Your Name" -v admin_role="super_admin" \
  -f create-admin.sql
```

`CREATE EXTENSION` needs a superuser or a role permitted to install extensions.
On managed PostgreSQL, enable `pgcrypto`, `citext` and `pg_trgm` first
(usually allowed from the provider console).

## Prisma tooling (optional)

```bash
cd docs1
npm install
# .env is loaded automatically; DATABASE_URL must point at the database
npm run db:validate
npm run db:generate
npm run db:seed          # optional; schema.sql must already be applied
```

`prisma/schema.prisma` was validated successfully with Prisma 6.19.3. It mirrors
`schema.sql` for a typed client and introspection. **Do not run
`prisma migrate` or `prisma db push`** against a database created by
`schema.sql`; they would attempt to recreate existing objects. If you change the
schema, update `schema.sql` first, then the Prisma mirror, and regenerate.

## Validation performed

- `prisma validate` and `prisma generate` pass with Prisma 6.19.3.
- `prisma/seed.ts` type-checks with TypeScript 5.
- `schema.sql` and `seed.sql` were executed in PGlite (WASM PostgreSQL) after
  substituting the unavailable extensions (`citext` → `text`, `pg_trgm` indexes
  removed). The seed counts, `JTH-YYYY-00001` reference generation, inquiry
  view and `updated_at` trigger were verified.
- **Not yet verified:** a real PostgreSQL 16 run with `pgcrypto`, `citext` and
  `pg_trgm`, the bcrypt admin script (psql meta-commands), and the Docker setup.
  Run the quick start on your machine or staging before relying on it.

## Design decisions

- **Singleton settings:** `site_settings.id` and `homepage_config.id` are fixed
  to `1` with `CHECK (id = 1)`.
- **No hero overlay opacity:** the current hero uses a fixed left-to-right
  gradient in `src/index.css`; the control was intentionally removed. Store only
  the background image and `object-position`.
- **Inquiry reference:** `next_inquiry_reference()` + `inquiry_reference_seq`
  produce `JTH-YYYY-00001`. Gaps are normal; never reuse numbers.
- **Passwords:** bcrypt via `crypt(..., gen_salt('bf', 12))`. The seed data
  contains **no** admin users.
- **Media:** the table stores metadata and URLs; files live in object storage or
  `server/uploads`. Nothing in this package uploads files.
- **Translations:** only English strings are seeded. The front end currently
  renders English only; the language switcher is presentational.
- **No fictional data:** no inquiries, case studies, clients, certifications or
  contact details are invented. `site_settings` contact fields are `NULL` until
  filled with real data.

## Front-end integration (not done)

Current sources that must be replaced by API calls:

| Front end | Replace with | Tables |
|---|---|---|
| `src/data/products.ts` | `GET /categories`, `GET /products` | `product_categories`, `products`, `product_images` |
| `src/data/cms.ts` (`jth_homepage`, `jth_media`) | `GET /homepage`, `GET /settings`, media admin endpoints | `homepage_config`, `site_settings`, `media_assets` |
| `src/pages/RequestQuote.tsx` (demo submit) | `POST /inquiries` | `inquiries` |
| `src/components/Footer.tsx` newsletter | `POST /newsletter` | `newsletter_subscribers` |
| `src/components/Header.tsx` language switcher | `GET /locales`, `GET /translations` | `locales`, `translations` |
| `src/admin/pages/Inquiries.tsx` (empty demo) | admin inquiry endpoints | `inquiries`, `inquiry_notes` |
| Admin login (`admin123`) | `POST /admin/auth/login` + sessions | `admin_users`, `admin_sessions` |

Also required: remove the demo password, store sessions server-side, add CSRF
protection, validate and rate-limit public forms, and move image files from
Unsplash placeholders to your own storage/CDN. The seed's local paths
(`/images/hero-packaging.jpg`, `/images/JTHLOGO-nav.png`) already exist in
`public/images/`.

## Production notes

- Bind PostgreSQL to a private network (`127.0.0.1` or a Docker network); never
  expose 5432 publicly.
- Use a dedicated, least-privilege application role for the API; keep a separate
  migration/admin role.
- Set `POSTGRES_PASSWORD` to 24+ random characters; keep `.env` out of git.
- Terminate TLS at Nginx/Caddy; enable HSTS, secure cookies, CSP.
- Schedule backups and test restores (`backup-restore.md`).
- Add monitoring for disk, connections, slow queries and failed logins.
- Consider PITR / managed PostgreSQL for real customer inquiries.
- Review privacy: inquiries and newsletter addresses are personal data. Add a
  retention policy and a deletion process.
- This schema has no row-level security; authorisation must be enforced in the
  API.

## File ownership / change workflow

1. Modify `schema.sql` for structural changes (it is intended for a fresh
   database; use `reset.sql` in development).
2. Mirror the change in `prisma/schema.prisma`; run `npm run db:validate` and
   `npm run db:generate`.
3. Update `seed.sql` / `prisma/seed.ts` and the docs in this folder.
4. Rebuild a development database with `reset.sql` + `schema.sql` + `seed.sql`.
5. Back up production before applying any change.

## Known limitations

- No real PostgreSQL server, Docker or `psql` is installed in this environment;
  see [Validation performed](#validation-performed) for what was and was not run.
- No backend, API, upload handling, e-mail delivery or authentication exists.
- `site_settings` contact details and social links are empty by design.
- Seeded product images other than the hero/logo are external Unsplash URLs.
- Only English translations are provided; Arabic is marked RTL but the front end
  has no RTL layout yet.
- The Prisma mirror does not encode `CHECK` constraints, some partial indexes or
  the `inquiry_overview` view; `schema.sql` remains authoritative.
