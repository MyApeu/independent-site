// ============================================================================
//  Optional TypeScript seed (same data as seed.sql)
//  File: docs1/prisma/seed.ts
//
//  Run from docs1:
//      npm install
//      npx prisma generate
//      npm run db:seed
//
//  Requires a database already created with schema.sql. Safe to re-run:
//  createMany uses skipDuplicates and singletons use upsert.
// ============================================================================

import { PrismaClient, MediaKind } from '@prisma/client';

const prisma = new PrismaClient();

const locales = [
  { code: 'en', name: 'English', nativeName: 'English', isRtl: false, sortOrder: 1 },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', isRtl: false, sortOrder: 2 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRtl: false, sortOrder: 3 },
  { code: 'fr', name: 'French', nativeName: 'Français', isRtl: false, sortOrder: 4 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isRtl: false, sortOrder: 5 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRtl: true, sortOrder: 6 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isRtl: false, sortOrder: 7 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isRtl: false, sortOrder: 8 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRtl: false, sortOrder: 9 },
];

const media = [
  { id: '10000000-0000-4000-8000-000000000001', name: 'Hero — custom paper packaging', url: '/images/hero-packaging.jpg', altText: 'Custom paper packaging by Jintaihong', folder: 'hero' },
  { id: '10000000-0000-4000-8000-000000000002', name: 'Jintaihong logo (transparent)', url: '/images/JTHLOGO-nav.png', altText: 'Shenzhen Jintaihong Packaging Products Co., Ltd.', folder: 'brand' },
  { id: '10000000-0000-4000-8000-000000000003', name: 'Paper boxes', url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1000&q=80', altText: 'Paper boxes', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000004', name: 'Gift boxes', url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1000&q=80', altText: 'Gift boxes', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000005', name: 'Paper bags', url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=80', altText: 'Paper bags', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000006', name: 'Folding cartons', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000&q=80', altText: 'Folding cartons', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000007', name: 'Food packaging', url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1000&q=80', altText: 'Food packaging', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000008', name: 'Labels and sleeves', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80', altText: 'Labels and sleeves', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000009', name: 'Other custom packaging', url: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1000&q=80', altText: 'Other custom packaging', folder: 'products' },
  { id: '10000000-0000-4000-8000-000000000010', name: 'About section', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80', altText: 'Paper packaging production', folder: 'about' },
  { id: '10000000-0000-4000-8000-000000000011', name: 'Printing', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&q=80', altText: 'Printing', folder: 'capabilities' },
  { id: '10000000-0000-4000-8000-000000000012', name: 'Die-cutting', url: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1000&q=80', altText: 'Die-cutting', folder: 'capabilities' },
  { id: '10000000-0000-4000-8000-000000000013', name: 'Post-processing', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80', altText: 'Post-processing', folder: 'capabilities' },
  { id: '10000000-0000-4000-8000-000000000014', name: 'Quality control', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80', altText: 'Quality control', folder: 'capabilities' },
  { id: '10000000-0000-4000-8000-000000000015', name: 'Call-to-action background', url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1800&q=80', altText: 'Custom paper packaging', folder: 'cta' },
];

const categories = [
  { id: '20000000-0000-4000-8000-000000000001', slug: 'paper-boxes', name: 'Paper Boxes', description: 'Custom rigid and folding paper boxes for premium products.', imageMediaId: '10000000-0000-4000-8000-000000000003', featured: true, sortOrder: 1 },
  { id: '20000000-0000-4000-8000-000000000002', slug: 'gift-boxes', name: 'Gift Boxes', description: 'Elegant gift boxes with custom finishes and inserts.', imageMediaId: '10000000-0000-4000-8000-000000000004', featured: true, sortOrder: 2 },
  { id: '20000000-0000-4000-8000-000000000003', slug: 'paper-bags', name: 'Paper Bags', description: 'Durable custom paper shopping bags with handles.', imageMediaId: '10000000-0000-4000-8000-000000000005', featured: true, sortOrder: 3 },
  { id: '20000000-0000-4000-8000-000000000004', slug: 'folding-cartons', name: 'Folding Cartons', description: 'Versatile folding cartons for retail packaging.', imageMediaId: '10000000-0000-4000-8000-000000000006', featured: false, sortOrder: 4 },
  { id: '20000000-0000-4000-8000-000000000005', slug: 'food-packaging', name: 'Food Packaging', description: 'Food-safe custom packaging solutions.', imageMediaId: '10000000-0000-4000-8000-000000000007', featured: false, sortOrder: 5 },
  { id: '20000000-0000-4000-8000-000000000006', slug: 'labels-sleeves', name: 'Labels & Sleeves', description: 'Custom labels, wraps and sleeve packaging.', imageMediaId: '10000000-0000-4000-8000-000000000008', featured: false, sortOrder: 6 },
  { id: '20000000-0000-4000-8000-000000000007', slug: 'other-custom-packaging', name: 'Other Custom Packaging', description: 'Bespoke packaging solutions tailored to your needs.', imageMediaId: '10000000-0000-4000-8000-000000000009', featured: false, sortOrder: 7 },
];

const capabilities = [
  { id: '30000000-0000-4000-8000-000000000001', slug: 'printing', title: 'Printing', description: 'High-precision offset & digital printing.', imageMediaId: '10000000-0000-4000-8000-000000000011', sortOrder: 1 },
  { id: '30000000-0000-4000-8000-000000000002', slug: 'die-cutting', title: 'Die-Cutting', description: 'Accurate and efficient die-cutting.', imageMediaId: '10000000-0000-4000-8000-000000000012', sortOrder: 2 },
  { id: '30000000-0000-4000-8000-000000000003', slug: 'post-processing', title: 'Post-Processing', description: 'Folding, gluing, and finishing.', imageMediaId: '10000000-0000-4000-8000-000000000013', sortOrder: 3 },
  { id: '30000000-0000-4000-8000-000000000004', slug: 'quality-control', title: 'Quality Control', description: 'Strict inspection standards.', imageMediaId: '10000000-0000-4000-8000-000000000014', sortOrder: 4 },
];

const pageSeo = [
  { path: '/', title: 'Shenzhen Jintaihong Packaging Products Co., Ltd. - Custom Paper Packaging', description: 'Professional paper packaging & printing manufacturer providing high-quality custom packaging solutions for global brands and importers.' },
  { path: '/products', title: 'Our Products | Custom Paper Packaging | Jintaihong', description: 'Explore custom paper boxes, gift boxes, paper bags, folding cartons, food packaging, labels and sleeves.' },
  { path: '/about', title: 'About Us | Jintaihong Packaging', description: 'Learn about Shenzhen Jintaihong Packaging Products Co., Ltd. and our approach to custom paper packaging.' },
  { path: '/capabilities', title: 'Capabilities | Printing, Die-Cutting & Finishing | Jintaihong', description: 'Custom printing, die-cutting, post-processing and quality control for paper packaging projects.' },
  { path: '/case-studies', title: 'Case Studies | Jintaihong Packaging', description: 'Packaging projects and collaborations with brands and importers.' },
  { path: '/contact', title: 'Contact | Jintaihong Packaging', description: 'Contact Shenzhen Jintaihong Packaging Products Co., Ltd. for custom paper packaging.' },
  { path: '/request-quote', title: 'Request a Quote | Custom Paper Packaging | Jintaihong', description: 'Tell us about your packaging requirements and request a custom quote.' },
];

const translations = [
  ['nav', 'home', 'Home'], ['nav', 'products', 'Products'], ['nav', 'capabilities', 'Capabilities'],
  ['nav', 'about', 'About Us'], ['nav', 'case_studies', 'Case Studies'], ['nav', 'contact', 'Contact'],
  ['nav', 'request_quote', 'Request a Quote'],
  ['common', 'explore_products', 'Explore Products'], ['common', 'explore_our_products', 'Explore Our Products'],
  ['common', 'request_a_quote', 'Request a Quote'], ['common', 'learn_more', 'Learn More'],
  ['common', 'view_all_products', 'View All Products'], ['common', 'subscribe', 'Subscribe'],
  ['hero', 'eyebrow', 'PAPER PACKAGING & PRINTING MANUFACTURER'],
  ['hero', 'title', 'Custom Paper Packaging for Global Brands'],
  ['hero', 'secondary_cta', 'Request a Quote'],
  ['products', 'eyebrow', 'CUSTOM PACKAGING SOLUTIONS'], ['products', 'title', 'Our Products'],
  ['products', 'lead', 'Custom paper packaging solutions for global brands.'],
  ['products', 'advantage_1', 'Custom Structural Design'],
  ['products', 'advantage_2', 'Premium Printing Quality'],
  ['products', 'advantage_3', 'Reliable Manufacturing'],
];

async function main() {
  await prisma.locale.createMany({ data: locales, skipDuplicates: true });

  await prisma.mediaAsset.createMany({
    data: media.map((m) => ({ ...m, kind: MediaKind.IMAGE })),
    skipDuplicates: true,
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyNameEn: 'Shenzhen Jintaihong Packaging Products Co., Ltd.',
      companyNameCn: '深圳市金泰鸿包装制品有限公司',
      shortName: 'Jintaihong',
      tagline: 'Professional paper packaging & printing manufacturer',
      description: 'We are a professional paper packaging manufacturer dedicated to providing high-quality custom packaging and printing services to global brands and importers.',
      logoMediaId: '10000000-0000-4000-8000-000000000002',
      defaultLocale: 'en',
      seoTitle: 'Shenzhen Jintaihong Packaging Products Co., Ltd. - Custom Paper Packaging',
      seoDescription: 'Professional paper packaging & printing manufacturer providing high-quality custom packaging solutions for global brands and importers.',
    },
  });

  await prisma.productCategory.createMany({ data: categories, skipDuplicates: true });
  await prisma.capability.createMany({ data: capabilities, skipDuplicates: true });

  await prisma.homepageConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroEyebrow: 'PAPER PACKAGING & PRINTING MANUFACTURER',
      heroTitle: 'Custom Paper Packaging',
      heroSubtitle: 'Professional paper packaging & printing manufacturer, providing high-quality, customized solutions for international brands and importers.',
      heroBackgroundMediaId: '10000000-0000-4000-8000-000000000001',
      heroBackgroundPosition: 'center center',
      aboutMediaId: '10000000-0000-4000-8000-000000000010',
      ctaMediaId: '10000000-0000-4000-8000-000000000015',
    },
  });

  await prisma.homepageCategoryImage.createMany({
    data: categories.map((c) => ({ categoryId: c.id, mediaId: c.imageMediaId })),
    skipDuplicates: true,
  });

  await prisma.homepageCapabilityImage.createMany({
    data: capabilities.map((c) => ({ capabilityId: c.id, mediaId: c.imageMediaId })),
    skipDuplicates: true,
  });

  await prisma.pageSeo.createMany({ data: pageSeo, skipDuplicates: true });

  await prisma.translation.createMany({
    data: translations.map(([namespace, key, value]) => ({ locale: 'en', namespace, key, value })),
    skipDuplicates: true,
  });

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
