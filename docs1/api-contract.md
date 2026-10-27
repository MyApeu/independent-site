# API contract (proposed — NOT implemented)

> **Status: design only.** This folder contains a database package. There is no
> backend, API server or upload service in this repository yet. The current site
> keeps content in browser `localStorage` and the admin password is a demo
> constant. Nothing below is live; do not point the production site at it.

Recommended stack: Node.js + Fastify/Express + Prisma, same repository, base
path `/api/v1`. All requests and responses are JSON except uploads.

## Conventions

- Auth: HTTP-only, `Secure`, `SameSite=Lax` session cookie (`jth_session`).
  The raw token is returned once; only `admin_sessions.token_hash` is stored.
  Expiry comes from `admin_sessions.expires_at`; logout sets `revoked_at`.
- Roles: `super_admin` (everything, including admins/audit),
  `editor` (content/media), `sales` (inquiries + read-only content).
- Public endpoints never require auth; admin endpoints require a session.
- Validation: reject unknown fields; trim strings; slugs lowercase; e-mail
  lower-cased; max lengths from `schema.sql`.
- Error envelope:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "fields": { "email": "Invalid e-mail" } } }
```

- Pagination: `?page=1&pageSize=20` (max 100) →

```json
{ "data": [], "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 } }
```

- Rate limits (per IP): login 10/15 min, public inquiry 5/hour, newsletter
  3/hour, uploads 60/hour.
- Never trust client-supplied `status`, `assigned_to`, ids, timestamps, or
  reference codes.

## Public endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness/readiness (`{ "status": "ok", "db": "up" }`) |
| GET | `/settings` | company identity, contact, social links, default locale |
| GET | `/locales` | active locales (code, native name, rtl, order) |
| GET | `/translations?locale=en&namespace=common` | UI strings with English fallback |
| GET | `/homepage` | hero, about/cta images, category and capability images |
| GET | `/categories` | active categories, ordered |
| GET | `/categories/:slug` | one category + active products |
| GET | `/products?category=&q=&featured=&page=` | active products |
| GET | `/products/:slug` | product + gallery |
| GET | `/capabilities` | active capabilities |
| GET | `/case-studies?page=` | published case studies only |
| GET | `/case-studies/:slug` | one published case study |
| GET | `/seo?path=/products` | title, description, og image, no_index |
| POST | `/inquiries` | create a quote request |
| POST | `/newsletter` | subscribe (double opt-in) |
| GET | `/newsletter/confirm?token=` | confirm subscription |
| GET | `/newsletter/unsubscribe?token=` | unsubscribe |

### `POST /inquiries`

```json
{
  "fullName": "Jane Doe",
  "companyName": "Acme Imports",
  "email": "jane@acme.example",
  "phone": "+1 555 0100",
  "country": "United States",
  "productCategorySlug": "gift-boxes",
  "productType": "Rigid gift box",
  "quantity": "5,000 pcs",
  "packagingSize": "20 × 15 × 8 cm",
  "material": "Greyboard 1200gsm + art paper",
  "printingRequirements": "CMYK + gold foil",
  "additionalRequirements": "Custom insert",
  "sourcePage": "/request-quote",
  "consent": true
}
```

Server sets `source = 'quote_form'` (or `contact_form`), `status = 'new'`,
`ip`, `user_agent`, `referrer`, and lets the database generate
`reference_code`. Response `201`:

```json
{ "referenceCode": "JTH-2026-00042", "message": "Thank you. We will reply within one business day." }
```

Optionally send an acknowledgement e-mail and an internal notification. Never
echo other inquiries or expose the internal id.

### `POST /newsletter`

`{ "email": "...", "consent": true }` → `202` regardless of whether the address
already exists (prevents enumeration). Store `pending`, e-mail a signed
confirmation link, then set `subscribed` and `confirmed_at`.

## Admin endpoints

All under `/admin`, session required. `super_admin` only where marked.

### Auth

| Method | Path | Notes |
|---|---|---|
| POST | `/admin/auth/login` | `{ email, password }`; verify bcrypt, set cookie, set `last_login_at`; generic failure message; rate-limited |
| POST | `/admin/auth/logout` | revoke current session, clear cookie |
| GET | `/admin/auth/me` | current user + role |
| POST | `/admin/auth/password` | `{ currentPassword, newPassword }`; min 12 chars |

### Content

| Method | Path | Role | Notes |
|---|---|---|---|
| GET/PUT | `/admin/settings` | editor | singleton update |
| GET/PUT | `/admin/homepage` | editor | hero/about/cta + homepage images |
| GET/POST | `/admin/categories` | editor | list/create |
| GET/PATCH/DELETE | `/admin/categories/:id` | editor | delete only if unused (`RESTRICT`) |
| GET/POST | `/admin/products` | editor | list/create |
| GET/PATCH/DELETE | `/admin/products/:id` | editor | manage gallery via `imageIds` |
| GET/POST | `/admin/capabilities` | editor | |
| GET/POST | `/admin/case-studies` | editor | draft/publish |
| GET/PUT | `/admin/seo/:path` | editor | upsert page SEO |
| GET/PUT | `/admin/translations` | editor | bulk upsert by locale/namespace |

### Media

| Method | Path | Role | Notes |
|---|---|---|---|
| GET | `/admin/media?folder=&q=&page=` | editor | metadata list |
| POST | `/admin/media` | editor | multipart upload; validate MIME + magic bytes; max 10 MB; random storage key |
| PATCH | `/admin/media/:id` | editor | name/alt/caption/folder |
| DELETE | `/admin/media/:id` | editor | refuse if referenced, or return reference list |

Store files outside the web root (or object storage) and serve via CDN. Never
serve user uploads from the API origin as HTML.

### Inquiries

| Method | Path | Role | Notes |
|---|---|---|---|
| GET | `/admin/inquiries?status=&q=&page=` | sales | `inquiry_overview` |
| GET | `/admin/inquiries/:id` | sales | inquiry + notes + attachments |
| PATCH | `/admin/inquiries/:id` | sales | status, assignee, first response |
| POST | `/admin/inquiries/:id/notes` | sales | internal note |
| POST | `/admin/inquiries/:id/attachments` | sales | attach existing media |
| GET | `/admin/inquiries/export.csv` | sales | filtered export; audit the action |

On status change: set `first_responded_at` on the first non-`new` transition and
`closed_at` for `won`/`lost`/`archived`.

### Administration (super_admin)

| Method | Path | Notes |
|---|---|---|
| GET/POST | `/admin/users` | list/create admins |
| PATCH | `/admin/users/:id` | name, role, `isActive` |
| POST | `/admin/users/:id/reset-password` | invalidate sessions |
| GET | `/admin/audit-logs?page=` | read-only |
| GET | `/admin/stats` | counts: new inquiries, media, products |

## Status codes

- `200` read/update, `201` created, `202` accepted (newsletter),
  `204` deleted, `400` validation, `401` no/expired session, `403` role,
  `404` not found, `409` conflict (slug/e-mail), `413` upload too large,
  `415` unsupported media, `422` business rule, `429` rate limited,
  `500` unexpected (log without personal data).

## Security checklist

- Password hashing: bcrypt cost ≥ 12 (or argon2id), compare in constant time.
- CSRF protection for cookie-auth mutations (double-submit token or
  `SameSite=Strict` + origin check).
- HTML from editors is sanitised server-side; product/case-study bodies are
  untrusted.
- Parameterised SQL only; Prisma handles this.
- No secrets in the front end; admin API on the same origin or allow-listed CORS.
- Log admin mutations to `audit_logs`; redact passwords and tokens.
- Add `helmet`, request size limits, and HTTPS/HSTS at the reverse proxy.
