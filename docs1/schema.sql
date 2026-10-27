-- ============================================================================
--  Shenzhen Jintaihong Packaging Products Co., Ltd.
--  Website database schema — PostgreSQL 16+
--  File: docs1/schema.sql
--
--  Run this file once on an EMPTY database:
--      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f schema.sql
--
--  Required privileges: CREATE EXTENSION requires a superuser (or a role
--  allowed to install pgcrypto / citext / pg_trgm). The Docker setup in this
--  folder creates the database with a superuser, so it works out of the box.
--
--  Destructive reset (development only): docs1/reset.sql
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid(), crypt() for admin passwords
CREATE EXTENSION IF NOT EXISTS citext;     -- case-insensitive e-mail addresses
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- fast fuzzy search on names

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Human-readable inquiry number: JTH-2026-00001
CREATE SEQUENCE IF NOT EXISTS inquiry_reference_seq AS bigint START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION next_inquiry_reference()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'JTH-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('inquiry_reference_seq')::text, 5, '0');
$$;

-- ---------------------------------------------------------------------------
-- Enumerated types
-- ---------------------------------------------------------------------------

CREATE TYPE admin_role AS ENUM ('super_admin', 'editor', 'sales');
CREATE TYPE media_kind AS ENUM ('image', 'document', 'video', 'other');
CREATE TYPE publish_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'quoted', 'won', 'lost', 'archived');
CREATE TYPE inquiry_source AS ENUM ('quote_form', 'contact_form', 'manual', 'email');
CREATE TYPE subscriber_status AS ENUM ('pending', 'subscribed', 'unsubscribed', 'bounced');

-- ---------------------------------------------------------------------------
-- Admin users and sessions
-- ---------------------------------------------------------------------------

CREATE TABLE admin_users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          citext NOT NULL UNIQUE
                 CHECK (email::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password_hash  text NOT NULL,
  name           text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  role           admin_role NOT NULL DEFAULT 'editor',
  is_active      boolean NOT NULL DEFAULT true,
  last_login_at  timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  revoked_at  timestamptz,
  ip          inet,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Media library
--   Files themselves live in object storage / server/uploads. This table keeps
--   metadata plus the public URL and (optionally) the private storage key.
-- ---------------------------------------------------------------------------

CREATE TABLE media_assets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind          media_kind NOT NULL DEFAULT 'image',
  name          text NOT NULL,
  url           text NOT NULL,
  storage_key   text UNIQUE,
  mime_type     text,
  size_bytes    bigint CHECK (size_bytes IS NULL OR size_bytes >= 0),
  width         integer CHECK (width IS NULL OR width > 0),
  height        integer CHECK (height IS NULL OR height > 0),
  alt_text      text,
  caption       text,
  folder        text NOT NULL DEFAULT 'general',
  uploaded_by   uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Locales and site settings (singleton row id = 1)
-- ---------------------------------------------------------------------------

CREATE TABLE locales (
  code         varchar(5) PRIMARY KEY,
  name         text NOT NULL,
  native_name  text NOT NULL,
  is_rtl       boolean NOT NULL DEFAULT false,
  is_active    boolean NOT NULL DEFAULT true,
  sort_order   smallint NOT NULL DEFAULT 0
);

CREATE TABLE site_settings (
  id                  smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name_en     text NOT NULL,
  company_name_cn     text,
  short_name          text,
  tagline             text,
  description         text,
  email               citext CHECK (email IS NULL OR email::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone               text,
  whatsapp            text,
  wechat              text,
  address_en          text,
  address_cn          text,
  business_hours      text,
  logo_media_id       uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  default_locale      varchar(5) NOT NULL DEFAULT 'en' REFERENCES locales(code),
  seo_title           text,
  seo_description     text,
  social_links        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

CREATE TABLE product_categories (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text NOT NULL UNIQUE
                 CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name           text NOT NULL,
  description    text,
  image_media_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  featured       boolean NOT NULL DEFAULT false,
  sort_order     integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_active      boolean NOT NULL DEFAULT true,
  seo_title      text,
  seo_description text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    uuid NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  slug           text NOT NULL UNIQUE
                 CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name           text NOT NULL,
  short_description text,
  description    text,
  cover_media_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  moq            text,
  lead_time      text,
  specs          jsonb NOT NULL DEFAULT '{}'::jsonb,
  featured       boolean NOT NULL DEFAULT false,
  is_active      boolean NOT NULL DEFAULT true,
  sort_order     integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  seo_title      text,
  seo_description text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id    uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  alt_text    text,
  sort_order  integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, media_id)
);

CREATE TABLE capabilities (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text NOT NULL UNIQUE
                 CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title          text NOT NULL,
  description    text,
  image_media_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order     integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE case_studies (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL UNIQUE
                  CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text NOT NULL,
  client_name     text,
  industry        text,
  summary         text,
  content         text,
  cover_media_id  uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  status          publish_status NOT NULL DEFAULT 'draft',
  published_at    timestamptz,
  featured        boolean NOT NULL DEFAULT false,
  sort_order      integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  seo_title       text,
  seo_description text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Homepage content
-- ---------------------------------------------------------------------------

CREATE TABLE homepage_config (
  id                         smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_eyebrow               text NOT NULL DEFAULT 'PAPER PACKAGING & PRINTING MANUFACTURER',
  hero_title                 text NOT NULL DEFAULT 'Custom Paper Packaging',
  hero_subtitle              text,
  hero_background_media_id   uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  hero_background_position   text NOT NULL DEFAULT 'center center',
  mobile_background_media_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  about_media_id             uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  cta_media_id               uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE homepage_category_images (
  category_id uuid PRIMARY KEY REFERENCES product_categories(id) ON DELETE CASCADE,
  media_id    uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE homepage_capability_images (
  capability_id uuid PRIMARY KEY REFERENCES capabilities(id) ON DELETE CASCADE,
  media_id      uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Per-page SEO overrides
-- ---------------------------------------------------------------------------

CREATE TABLE page_seo (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path            text NOT NULL UNIQUE,
  title           text,
  description     text,
  og_media_id     uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  no_index        boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Inquiries (quote requests) and follow-up notes / attachments
-- ---------------------------------------------------------------------------

CREATE TABLE inquiries (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code          text NOT NULL UNIQUE DEFAULT next_inquiry_reference(),
  full_name               text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  company_name            text NOT NULL CHECK (char_length(company_name) BETWEEN 1 AND 160),
  email                   citext NOT NULL
                          CHECK (email::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone                   text,
  country                 text,
  product_category_id     uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  product_type            text,
  quantity                text,
  packaging_size          text,
  material                text,
  printing_requirements   text,
  additional_requirements text,
  source                  inquiry_source NOT NULL DEFAULT 'quote_form',
  source_page             text,
  referrer                text,
  status                  inquiry_status NOT NULL DEFAULT 'new',
  assigned_to             uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  ip                      inet,
  user_agent              text,
  first_responded_at      timestamptz,
  closed_at               timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inquiry_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id  uuid NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  author_id   uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  is_internal boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inquiry_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id  uuid NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  media_id    uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (inquiry_id, media_id)
);

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------

CREATE TABLE newsletter_subscribers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email            citext NOT NULL UNIQUE
                   CHECK (email::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  status           subscriber_status NOT NULL DEFAULT 'pending',
  source           text NOT NULL DEFAULT 'footer',
  consent_ip       inet,
  confirmed_at     timestamptz,
  unsubscribed_at  timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- UI translations (the language switcher can read from here)
-- ---------------------------------------------------------------------------

CREATE TABLE translations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  locale      varchar(5) NOT NULL REFERENCES locales(code) ON DELETE CASCADE,
  namespace   text NOT NULL DEFAULT 'common',
  key         text NOT NULL,
  value       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (locale, namespace, key)
);

-- ---------------------------------------------------------------------------
-- Admin audit log
-- ---------------------------------------------------------------------------

CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text,
  entity_id   text,
  changes     jsonb,
  ip          inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

CREATE TRIGGER trg_admin_users_updated        BEFORE UPDATE ON admin_users        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_media_assets_updated       BEFORE UPDATE ON media_assets       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_site_settings_updated      BEFORE UPDATE ON site_settings      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_categories_updated         BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated           BEFORE UPDATE ON products           FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_capabilities_updated       BEFORE UPDATE ON capabilities       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_case_studies_updated       BEFORE UPDATE ON case_studies       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_homepage_config_updated    BEFORE UPDATE ON homepage_config    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_page_seo_updated           BEFORE UPDATE ON page_seo           FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inquiries_updated          BEFORE UPDATE ON inquiries          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inquiry_notes_updated      BEFORE UPDATE ON inquiry_notes      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subscribers_updated        BEFORE UPDATE ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_translations_updated       BEFORE UPDATE ON translations       FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX idx_admin_sessions_user           ON admin_sessions (user_id);
CREATE INDEX idx_admin_sessions_expires        ON admin_sessions (expires_at);
CREATE INDEX idx_admin_sessions_active         ON admin_sessions (user_id) WHERE revoked_at IS NULL;

CREATE INDEX idx_media_folder_created          ON media_assets (folder, created_at DESC);
CREATE INDEX idx_media_name_trgm               ON media_assets USING gin (name gin_trgm_ops);

CREATE INDEX idx_categories_active_sort        ON product_categories (is_active, sort_order);
CREATE INDEX idx_products_category_active      ON products (category_id, is_active, sort_order);
CREATE INDEX idx_products_name_trgm            ON products USING gin (name gin_trgm_ops);
CREATE INDEX idx_product_images_product        ON product_images (product_id, sort_order);
CREATE INDEX idx_case_studies_status           ON case_studies (status, published_at DESC);

CREATE INDEX idx_inquiries_status_created      ON inquiries (status, created_at DESC);
CREATE INDEX idx_inquiries_created             ON inquiries (created_at DESC);
CREATE INDEX idx_inquiries_email               ON inquiries (email);
CREATE INDEX idx_inquiries_category            ON inquiries (product_category_id);
CREATE INDEX idx_inquiries_assigned            ON inquiries (assigned_to);
CREATE INDEX idx_inquiries_full_name_trgm      ON inquiries USING gin (full_name gin_trgm_ops);
CREATE INDEX idx_inquiries_company_trgm        ON inquiries USING gin (company_name gin_trgm_ops);
CREATE INDEX idx_inquiry_notes_inquiry         ON inquiry_notes (inquiry_id, created_at DESC);
CREATE INDEX idx_inquiry_attachments_inquiry   ON inquiry_attachments (inquiry_id);

CREATE INDEX idx_subscribers_status_created    ON newsletter_subscribers (status, created_at DESC);
CREATE INDEX idx_translations_locale_ns        ON translations (locale, namespace);
CREATE INDEX idx_audit_created                 ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_entity                  ON audit_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- Convenience view for the admin inquiry list
-- ---------------------------------------------------------------------------

CREATE VIEW inquiry_overview AS
SELECT
  i.id,
  i.reference_code,
  i.full_name,
  i.company_name,
  i.email,
  i.country,
  i.product_type,
  i.status,
  i.created_at,
  i.first_responded_at,
  a.name AS assigned_to_name,
  (SELECT count(*) FROM inquiry_notes n WHERE n.inquiry_id = i.id)       AS note_count,
  (SELECT count(*) FROM inquiry_attachments att WHERE att.inquiry_id = i.id) AS attachment_count
FROM inquiries i
LEFT JOIN admin_users a ON a.id = i.assigned_to;

COMMIT;
