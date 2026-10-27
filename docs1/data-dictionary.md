# Data dictionary

Authoritative source: `schema.sql` (types, constraints, indexes, triggers).
This page explains intent and the rules a backend must enforce.

Conventions

- Primary keys are `uuid` with `DEFAULT gen_random_uuid()` (except singleton tables).
- All timestamps are `timestamptz`; `updated_at` is maintained by database triggers.
- `citext` makes e-mail matching case-insensitive; e-mails are validated with a
  `CHECK` regex as a last line of defence (the API must validate first).
- Money is not stored yet. Add an explicit currency and integer minor units if
  quoting/pricing is introduced.
- Slugs use `^[a-z0-9]+(-[a-z0-9]+)*$`.

## Admin

### `admin_users`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `email` | citext | unique, required, regex-checked |
| `password_hash` | text | required; bcrypt via `crypt(..., gen_salt('bf', 12))` |
| `name` | text | 1–120 chars |
| `role` | `admin_role` | `super_admin` / `editor` / `sales`, default `editor` |
| `is_active` | boolean | default `true`; set false instead of deleting |
| `last_login_at` | timestamptz | nullable |
| `created_at`, `updated_at` | timestamptz | automatic |

### `admin_sessions`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `admin_users`, cascade |
| `token_hash` | text | unique; store a hash, never the raw token |
| `expires_at` | timestamptz | required |
| `revoked_at` | timestamptz | nullable; logout sets it |
| `ip`, `user_agent` | inet, text | optional audit context |
| `created_at` | timestamptz | automatic |

## Content & media

### `media_assets`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `kind` | `media_kind` | `image` / `document` / `video` / `other` |
| `name` | text | display name |
| `url` | text | public URL |
| `storage_key` | text | unique nullable key in object storage |
| `mime_type`, `size_bytes`, `width`, `height` | text, bigint, int, int | optional metadata |
| `alt_text`, `caption` | text | accessibility / editorial |
| `folder` | text | default `general` (`hero`, `brand`, `products`, …) |
| `uploaded_by` | uuid | FK → `admin_users`, set null on delete |
| `created_at`, `updated_at` | timestamptz | automatic |

### `locales`

| Column | Type | Rules |
|---|---|---|
| `code` | varchar(5) | PK (`en`, `zh`, `pt-BR` max 5) |
| `name`, `native_name` | text | required |
| `is_rtl` | boolean | true for Arabic |
| `is_active` | boolean | controls the switcher |
| `sort_order` | smallint | display order |

### `site_settings` (singleton `id = 1`)

Company identity, contact data, logo, default locale, default SEO and
`social_links` (jsonb). Contact fields are nullable on purpose: **fill them with
real data**; do not publish placeholders.

### `translations`

`locale` FK, `namespace` (default `common`), `key`, `value`;
unique `(locale, namespace, key)`. The front end should fall back to `en` for
missing keys.

### `page_seo`

One row per route path (unique): `title`, `description`, optional `og_media_id`,
`no_index`.

## Catalogue

### `product_categories`

`slug` unique, `name`, `description`, `image_media_id`, `featured`,
`sort_order`, `is_active`, SEO fields, timestamps.

### `products`

`category_id` (required, `RESTRICT`), `slug` unique, name/descriptions,
`cover_media_id`, `moq`, `lead_time`, `specs` jsonb (free-form attributes such as
material, dimensions, finishes), `featured`, `is_active`, `sort_order`, SEO.

`specs` example:

```json
{ "material": "157gsm art paper", "printing": "CMYK offset", "finish": "matte lamination" }
```

### `product_images`

Gallery rows: `product_id`, `media_id`, `alt_text`, `sort_order`; unique pair.

### `capabilities`

`slug`, `title`, `description`, `image_media_id`, `sort_order`, `is_active`.

### `case_studies`

`slug`, `title`, `client_name`, `industry`, `summary`, `content`,
`cover_media_id`, `status` (`draft`/`published`/`archived`), `published_at`,
`featured`, `sort_order`, SEO. Public queries must filter `status = 'published'`
and `published_at <= now()`.

## Homepage

### `homepage_config` (singleton `id = 1`)

`hero_eyebrow`, `hero_title`, `hero_subtitle`, `hero_background_media_id`,
`hero_background_position` (CSS object-position), `mobile_background_media_id`,
`about_media_id`, `cta_media_id`.

There is deliberately **no overlay-opacity column**: the current hero uses a
fixed left-to-right gradient in the front end.

### `homepage_category_images` / `homepage_capability_images`

Optional per-item image overrides for the home page; PK is the content id, with
`media_id` and `created_at`.

## Sales

### `inquiries`

| Group | Columns |
|---|---|
| Identity | `reference_code` unique, auto `JTH-YYYY-00001`; `full_name` (2–120), `company_name` (1–160), `email` (citext, validated), `phone`, `country` |
| Request | `product_category_id`, `product_type`, `quantity`, `packaging_size`, `material`, `printing_requirements`, `additional_requirements` |
| Attribution | `source` (`quote_form`/`contact_form`/`manual`/`email`), `source_page`, `referrer`, `ip`, `user_agent` |
| Workflow | `status` (`new`/`in_progress`/`quoted`/`won`/`lost`/`archived`), `assigned_to`, `first_responded_at`, `closed_at` |
| Timestamps | `created_at`, `updated_at` |

The `inquiry_overview` view adds assignee name plus note/attachment counts.
Public inserts must never accept `status`, `assigned_to` or timestamps from the
client.

### `inquiry_notes`

`inquiry_id`, `author_id`, `body` (1–10 000), `is_internal` (default true),
timestamps. Cascades with the inquiry; author becomes `NULL` if the admin is
deleted.

### `inquiry_attachments`

Join of `inquiry_id` + `media_id`, unique pair. Files live in storage.

### `newsletter_subscribers`

`email` unique, `status` (`pending`/`subscribed`/`unsubscribed`/`bounced`),
`source`, `consent_ip`, `confirmed_at`, `unsubscribed_at`. Use double opt-in and
send a confirmation mail before setting `subscribed`.

## Operations

### `audit_logs`

`actor_id`, `action`, `entity_type`, `entity_id`, `changes` jsonb, `ip`,
`created_at`. Append-only; record admin mutations and logins. Do not store
passwords, tokens or full inquiry personal data in `changes`.

## Functions, triggers, indexes

- `set_updated_at()` + one trigger per mutable table.
- `next_inquiry_reference()` uses `inquiry_reference_seq`; it is the default for
  `inquiries.reference_code`. Sequence gaps are normal.
- B-tree indexes cover foreign keys, status/sort lists and expiry lookups.
- `pg_trgm` GIN indexes support fuzzy search on media names, product names,
  inquiry names and companies.
- `inquiry_overview` is a convenience view, not a security boundary.

## Retention / privacy (recommended, not automated)

- Inquiries: retain as long as needed for sales; support deletion on request.
- Sessions: delete expired/revoked rows periodically.
- Audit logs: retain 6–12 months.
- Backups contain personal data — encrypt and restrict access.
