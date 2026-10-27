# Entity–relationship diagram

PostgreSQL 16 schema in `schema.sql`; the Prisma mirror is `prisma/schema.prisma`.
Enums: `admin_role`, `media_kind`, `publish_status`, `inquiry_status`,
`inquiry_source`, `subscriber_status`.

```mermaid
erDiagram
    ADMIN_USERS ||--o{ ADMIN_SESSIONS : "has"
    ADMIN_USERS ||--o{ MEDIA_ASSETS : "uploads"
    ADMIN_USERS ||--o{ INQUIRIES : "assigned"
    ADMIN_USERS ||--o{ INQUIRY_NOTES : "writes"
    ADMIN_USERS ||--o{ AUDIT_LOGS : "acts"

    MEDIA_ASSETS ||--o{ PRODUCT_IMAGES : "shown in"
    MEDIA_ASSETS ||--o{ INQUIRY_ATTACHMENTS : "attached"
    MEDIA_ASSETS ||--o{ HOMEPAGE_CATEGORY_IMAGES : "homepage"
    MEDIA_ASSETS ||--o{ HOMEPAGE_CAPABILITY_IMAGES : "homepage"
    MEDIA_ASSETS }o--o| SITE_SETTINGS : "logo"
    MEDIA_ASSETS }o--o| HOMEPAGE_CONFIG : "hero/about/cta"
    MEDIA_ASSETS }o--o| PRODUCT_CATEGORIES : "cover"
    MEDIA_ASSETS }o--o| PRODUCTS : "cover"
    MEDIA_ASSETS }o--o| CAPABILITIES : "cover"
    MEDIA_ASSETS }o--o| CASE_STUDIES : "cover"
    MEDIA_ASSETS }o--o| PAGE_SEO : "og image"

    PRODUCT_CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCT_CATEGORIES ||--o| HOMEPAGE_CATEGORY_IMAGES : "homepage image"
    PRODUCT_CATEGORIES ||--o{ INQUIRIES : "requested"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "gallery"
    CAPABILITIES ||--o| HOMEPAGE_CAPABILITY_IMAGES : "homepage image"

    LOCALES ||--o{ TRANSLATIONS : "localises"
    LOCALES ||--o{ SITE_SETTINGS : "default"

    INQUIRIES ||--o{ INQUIRY_NOTES : "follow-ups"
    INQUIRIES ||--o{ INQUIRY_ATTACHMENTS : "files"

    ADMIN_USERS {
        uuid id PK
        citext email UK
        text password_hash "bcrypt"
        text name
        admin_role role
        boolean is_active
        timestamptz last_login_at
        timestamptz created_at
        timestamptz updated_at
    }

    ADMIN_SESSIONS {
        uuid id PK
        uuid user_id FK
        text token_hash UK
        timestamptz expires_at
        timestamptz revoked_at
        inet ip
        text user_agent
        timestamptz created_at
    }

    MEDIA_ASSETS {
        uuid id PK
        media_kind kind
        text name
        text url
        text storage_key UK
        text mime_type
        bigint size_bytes
        int width
        int height
        text alt_text
        text caption
        text folder
        uuid uploaded_by FK
        timestamptz created_at
        timestamptz updated_at
    }

    LOCALES {
        varchar code PK
        text name
        text native_name
        boolean is_rtl
        boolean is_active
        smallint sort_order
    }

    SITE_SETTINGS {
        smallint id PK "always 1"
        text company_name_en
        text company_name_cn
        text short_name
        text tagline
        text description
        citext email
        text phone
        text whatsapp
        text wechat
        text address_en
        text address_cn
        text business_hours
        uuid logo_media_id FK
        varchar default_locale FK
        text seo_title
        text seo_description
        jsonb social_links
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCT_CATEGORIES {
        uuid id PK
        text slug UK
        text name
        text description
        uuid image_media_id FK
        boolean featured
        int sort_order
        boolean is_active
        text seo_title
        text seo_description
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCTS {
        uuid id PK
        uuid category_id FK
        text slug UK
        text name
        text short_description
        text description
        uuid cover_media_id FK
        text moq
        text lead_time
        jsonb specs
        boolean featured
        boolean is_active
        int sort_order
        text seo_title
        text seo_description
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        uuid media_id FK
        text alt_text
        int sort_order
        timestamptz created_at
    }

    CAPABILITIES {
        uuid id PK
        text slug UK
        text title
        text description
        uuid image_media_id FK
        int sort_order
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    CASE_STUDIES {
        uuid id PK
        text slug UK
        text title
        text client_name
        text industry
        text summary
        text content
        uuid cover_media_id FK
        publish_status status
        timestamptz published_at
        boolean featured
        int sort_order
        text seo_title
        text seo_description
        timestamptz created_at
        timestamptz updated_at
    }

    HOMEPAGE_CONFIG {
        smallint id PK "always 1"
        text hero_eyebrow
        text hero_title
        text hero_subtitle
        uuid hero_background_media_id FK
        text hero_background_position
        uuid mobile_background_media_id FK
        uuid about_media_id FK
        uuid cta_media_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    HOMEPAGE_CATEGORY_IMAGES {
        uuid category_id PK "FK"
        uuid media_id FK
        timestamptz created_at
    }

    HOMEPAGE_CAPABILITY_IMAGES {
        uuid capability_id PK "FK"
        uuid media_id FK
        timestamptz created_at
    }

    PAGE_SEO {
        uuid id PK
        text path UK
        text title
        text description
        uuid og_media_id FK
        boolean no_index
        timestamptz created_at
        timestamptz updated_at
    }

    INQUIRIES {
        uuid id PK
        text reference_code UK "JTH-YYYY-00001"
        text full_name
        text company_name
        citext email
        text phone
        text country
        uuid product_category_id FK
        text product_type
        text quantity
        text packaging_size
        text material
        text printing_requirements
        text additional_requirements
        inquiry_source source
        text source_page
        text referrer
        inquiry_status status
        uuid assigned_to FK
        inet ip
        text user_agent
        timestamptz first_responded_at
        timestamptz closed_at
        timestamptz created_at
        timestamptz updated_at
    }

    INQUIRY_NOTES {
        uuid id PK
        uuid inquiry_id FK
        uuid author_id FK
        text body
        boolean is_internal
        timestamptz created_at
        timestamptz updated_at
    }

    INQUIRY_ATTACHMENTS {
        uuid id PK
        uuid inquiry_id FK
        uuid media_id FK
        timestamptz created_at
    }

    NEWSLETTER_SUBSCRIBERS {
        uuid id PK
        citext email UK
        subscriber_status status
        text source
        inet consent_ip
        timestamptz confirmed_at
        timestamptz unsubscribed_at
        timestamptz created_at
        timestamptz updated_at
    }

    TRANSLATIONS {
        uuid id PK
        varchar locale FK
        text namespace
        text key
        text value
        timestamptz created_at
        timestamptz updated_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        text action
        text entity_type
        text entity_id
        jsonb changes
        inet ip
        timestamptz created_at
    }
```

## Relationship notes

- `site_settings` and `homepage_config` are singleton tables (`id = 1`, enforced by `CHECK`).
- All child rows are removed with their parent where ownership is implied
  (`product_images`, `inquiry_notes`, `inquiry_attachments`, homepage join tables,
  `translations`, sessions). Catalogue parents use `RESTRICT`/`SET NULL` so a
  category cannot be deleted while products still reference it.
- `media_assets.storage_key` points at object storage; `url` is the public URL.
  Deleting a media row sets referencing content covers to `NULL` but does **not**
  delete the stored file — the backend must do that explicitly.
- Inquiries intentionally keep a snapshot of contact data even if a category or
  admin user is later deleted (`SET NULL`).
