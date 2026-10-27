-- ============================================================================
--  Seed data for the Jintaihong website
--  File: docs1/seed.sql
--
--  Run after schema.sql:
--      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f seed.sql
--
--  The digital-asset URLs below match the current front-end demo data.
--  Unsplash URLs are placeholders only — replace them with your own hosted
--  files before going live (see docs1/README.md).
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Locales (the nine languages in the header switcher)
-- ---------------------------------------------------------------------------
INSERT INTO locales (code, name, native_name, is_rtl, is_active, sort_order) VALUES
  ('en', 'English',    'English',  false, true, 1),
  ('zh', 'Chinese',    '简体中文', false, true, 2),
  ('es', 'Spanish',    'Español',  false, true, 3),
  ('fr', 'French',     'Français', false, true, 4),
  ('de', 'German',     'Deutsch',  false, true, 5),
  ('ar', 'Arabic',     'العربية',  true,  true, 6),
  ('ja', 'Japanese',   '日本語',   false, true, 7),
  ('ko', 'Korean',     '한국어',   false, true, 8),
  ('pt', 'Portuguese', 'Português',false, true, 9)
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Media assets
-- ---------------------------------------------------------------------------
INSERT INTO media_assets (id, kind, name, url, alt_text, folder) VALUES
  ('10000000-0000-4000-8000-000000000001', 'image', 'Hero — custom paper packaging', '/images/hero-packaging.jpg', 'Custom paper packaging by Jintaihong', 'hero'),
  ('10000000-0000-4000-8000-000000000002', 'image', 'Jintaihong logo (transparent)', '/images/JTHLOGO-nav.png', 'Shenzhen Jintaihong Packaging Products Co., Ltd.', 'brand'),
  ('10000000-0000-4000-8000-000000000003', 'image', 'Paper boxes',       'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1000&q=80', 'Paper boxes', 'products'),
  ('10000000-0000-4000-8000-000000000004', 'image', 'Gift boxes',        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1000&q=80', 'Gift boxes', 'products'),
  ('10000000-0000-4000-8000-000000000005', 'image', 'Paper bags',        'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=80', 'Paper bags', 'products'),
  ('10000000-0000-4000-8000-000000000006', 'image', 'Folding cartons',   'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000&q=80', 'Folding cartons', 'products'),
  ('10000000-0000-4000-8000-000000000007', 'image', 'Food packaging',    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1000&q=80', 'Food packaging', 'products'),
  ('10000000-0000-4000-8000-000000000008', 'image', 'Labels and sleeves','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80', 'Labels and sleeves', 'products'),
  ('10000000-0000-4000-8000-000000000009', 'image', 'Other custom packaging','https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1000&q=80', 'Other custom packaging', 'products'),
  ('10000000-0000-4000-8000-000000000010', 'image', 'About section',     'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80', 'Paper packaging production', 'about'),
  ('10000000-0000-4000-8000-000000000011', 'image', 'Printing',          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&q=80', 'Printing', 'capabilities'),
  ('10000000-0000-4000-8000-000000000012', 'image', 'Die-cutting',       'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1000&q=80', 'Die-cutting', 'capabilities'),
  ('10000000-0000-4000-8000-000000000013', 'image', 'Post-processing',   'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80', 'Post-processing', 'capabilities'),
  ('10000000-0000-4000-8000-000000000014', 'image', 'Quality control',   'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80', 'Quality control', 'capabilities'),
  ('10000000-0000-4000-8000-000000000015', 'image', 'Call-to-action background','https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1800&q=80', 'Custom paper packaging', 'cta')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Site settings (singleton)
--   Contact details are intentionally NULL: fill them with the factory's real
--   information from the admin panel. Do not publish placeholder values.
-- ---------------------------------------------------------------------------
INSERT INTO site_settings (
  id, company_name_en, company_name_cn, short_name, tagline, description,
  logo_media_id, default_locale, seo_title, seo_description
) VALUES (
  1,
  'Shenzhen Jintaihong Packaging Products Co., Ltd.',
  '深圳市金泰鸿包装制品有限公司',
  'Jintaihong',
  'Professional paper packaging & printing manufacturer',
  'We are a professional paper packaging manufacturer dedicated to providing high-quality custom packaging and printing services to global brands and importers.',
  '10000000-0000-4000-8000-000000000002',
  'en',
  'Shenzhen Jintaihong Packaging Products Co., Ltd. - Custom Paper Packaging',
  'Professional paper packaging & printing manufacturer providing high-quality custom packaging solutions for global brands and importers.'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Product categories
-- ---------------------------------------------------------------------------
INSERT INTO product_categories (id, slug, name, description, image_media_id, featured, sort_order) VALUES
  ('20000000-0000-4000-8000-000000000001', 'paper-boxes',            'Paper Boxes',            'Custom rigid and folding paper boxes for premium products.', '10000000-0000-4000-8000-000000000003', true,  1),
  ('20000000-0000-4000-8000-000000000002', 'gift-boxes',             'Gift Boxes',             'Elegant gift boxes with custom finishes and inserts.',       '10000000-0000-4000-8000-000000000004', true,  2),
  ('20000000-0000-4000-8000-000000000003', 'paper-bags',             'Paper Bags',             'Durable custom paper shopping bags with handles.',           '10000000-0000-4000-8000-000000000005', true,  3),
  ('20000000-0000-4000-8000-000000000004', 'folding-cartons',        'Folding Cartons',        'Versatile folding cartons for retail packaging.',            '10000000-0000-4000-8000-000000000006', false, 4),
  ('20000000-0000-4000-8000-000000000005', 'food-packaging',         'Food Packaging',         'Food-safe custom packaging solutions.',                      '10000000-0000-4000-8000-000000000007', false, 5),
  ('20000000-0000-4000-8000-000000000006', 'labels-sleeves',         'Labels & Sleeves',       'Custom labels, wraps and sleeve packaging.',                 '10000000-0000-4000-8000-000000000008', false, 6),
  ('20000000-0000-4000-8000-000000000007', 'other-custom-packaging', 'Other Custom Packaging', 'Bespoke packaging solutions tailored to your needs.',        '10000000-0000-4000-8000-000000000009', false, 7)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Capabilities
-- ---------------------------------------------------------------------------
INSERT INTO capabilities (id, slug, title, description, image_media_id, sort_order) VALUES
  ('30000000-0000-4000-8000-000000000001', 'printing',         'Printing',         'High-precision offset & digital printing.', '10000000-0000-4000-8000-000000000011', 1),
  ('30000000-0000-4000-8000-000000000002', 'die-cutting',      'Die-Cutting',      'Accurate and efficient die-cutting.',       '10000000-0000-4000-8000-000000000012', 2),
  ('30000000-0000-4000-8000-000000000003', 'post-processing',  'Post-Processing',  'Folding, gluing, and finishing.',           '10000000-0000-4000-8000-000000000013', 3),
  ('30000000-0000-4000-8000-000000000004', 'quality-control',  'Quality Control',  'Strict inspection standards.',              '10000000-0000-4000-8000-000000000014', 4)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Homepage configuration (singleton)
-- ---------------------------------------------------------------------------
INSERT INTO homepage_config (
  id, hero_eyebrow, hero_title, hero_subtitle,
  hero_background_media_id, hero_background_position,
  mobile_background_media_id, about_media_id, cta_media_id
) VALUES (
  1,
  'PAPER PACKAGING & PRINTING MANUFACTURER',
  'Custom Paper Packaging',
  'Professional paper packaging & printing manufacturer, providing high-quality, customized solutions for international brands and importers.',
  '10000000-0000-4000-8000-000000000001',
  'center center',
  NULL,
  '10000000-0000-4000-8000-000000000010',
  '10000000-0000-4000-8000-000000000015'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO homepage_category_images (category_id, media_id) VALUES
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000005'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000006'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000007'),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000008'),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000009')
ON CONFLICT (category_id) DO NOTHING;

INSERT INTO homepage_capability_images (capability_id, media_id) VALUES
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000011'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000012'),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000013'),
  ('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000014')
ON CONFLICT (capability_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Page SEO defaults
-- ---------------------------------------------------------------------------
INSERT INTO page_seo (path, title, description) VALUES
  ('/',                'Shenzhen Jintaihong Packaging Products Co., Ltd. - Custom Paper Packaging', 'Professional paper packaging & printing manufacturer providing high-quality custom packaging solutions for global brands and importers.'),
  ('/products',        'Our Products | Custom Paper Packaging | Jintaihong', 'Explore custom paper boxes, gift boxes, paper bags, folding cartons, food packaging, labels and sleeves.'),
  ('/about',           'About Us | Jintaihong Packaging', 'Learn about Shenzhen Jintaihong Packaging Products Co., Ltd. and our approach to custom paper packaging.'),
  ('/capabilities',    'Capabilities | Printing, Die-Cutting & Finishing | Jintaihong', 'Custom printing, die-cutting, post-processing and quality control for paper packaging projects.'),
  ('/case-studies',    'Case Studies | Jintaihong Packaging', 'Packaging projects and collaborations with brands and importers.'),
  ('/contact',         'Contact | Jintaihong Packaging', 'Contact Shenzhen Jintaihong Packaging Products Co., Ltd. for custom paper packaging.'),
  ('/request-quote',   'Request a Quote | Custom Paper Packaging | Jintaihong', 'Tell us about your packaging requirements and request a custom quote.')
ON CONFLICT (path) DO NOTHING;

-- ---------------------------------------------------------------------------
-- English UI strings (other locales can be added over time; the front end
-- should fall back to English when a key is missing)
-- ---------------------------------------------------------------------------
INSERT INTO translations (locale, namespace, key, value) VALUES
  ('en', 'nav', 'home',           'Home'),
  ('en', 'nav', 'products',       'Products'),
  ('en', 'nav', 'capabilities',   'Capabilities'),
  ('en', 'nav', 'about',          'About Us'),
  ('en', 'nav', 'case_studies',   'Case Studies'),
  ('en', 'nav', 'contact',        'Contact'),
  ('en', 'nav', 'request_quote',  'Request a Quote'),
  ('en', 'common', 'explore_products',   'Explore Products'),
  ('en', 'common', 'explore_our_products','Explore Our Products'),
  ('en', 'common', 'request_a_quote',    'Request a Quote'),
  ('en', 'common', 'learn_more',         'Learn More'),
  ('en', 'common', 'view_all_products',  'View All Products'),
  ('en', 'common', 'subscribe',          'Subscribe'),
  ('en', 'hero', 'eyebrow',       'PAPER PACKAGING & PRINTING MANUFACTURER'),
  ('en', 'hero', 'title',         'Custom Paper Packaging for Global Brands'),
  ('en', 'hero', 'secondary_cta', 'Request a Quote'),
  ('en', 'products', 'eyebrow',   'CUSTOM PACKAGING SOLUTIONS'),
  ('en', 'products', 'title',     'Our Products'),
  ('en', 'products', 'lead',      'Custom paper packaging solutions for global brands.'),
  ('en', 'products', 'advantage_1', 'Custom Structural Design'),
  ('en', 'products', 'advantage_2', 'Premium Printing Quality'),
  ('en', 'products', 'advantage_3', 'Reliable Manufacturing')
ON CONFLICT (locale, namespace, key) DO NOTHING;

COMMIT;
