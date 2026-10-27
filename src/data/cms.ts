export type MediaAsset = {
  id: string
  name: string
  url: string
  alt: string
  description?: string
  size: number
  type: string
  width?: number
  height?: number
  uploadedAt: string
}

export type HomepageConfig = {
  heroTitle: string
  heroSubtitle: string
  heroBackgroundImage?: string
  heroBackgroundPosition?: string
  mobileBackgroundImage?: string
  heroImage1: string
  heroImage2: string
  heroImage3: string
  heroImage4: string
  productCategoryImages: Record<string, string>
  aboutImage: string
  capabilityImages: Record<string, string>
  ctaImage: string
}

const STORAGE_KEY_MEDIA = 'jth_media'
const STORAGE_KEY_HOMEPAGE = 'jth_homepage'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const mediaStore = {
  getAll(): MediaAsset[] {
    return load<MediaAsset[]>(STORAGE_KEY_MEDIA, [])
  },
  add(asset: MediaAsset) {
    const all = this.getAll()
    all.unshift(asset)
    save(STORAGE_KEY_MEDIA, all)
  },
  update(id: string, updates: Partial<MediaAsset>) {
    const all = this.getAll()
    const idx = all.findIndex(a => a.id === id)
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates }
      save(STORAGE_KEY_MEDIA, all)
    }
  },
  remove(id: string) {
    const all = this.getAll().filter(a => a.id !== id)
    save(STORAGE_KEY_MEDIA, all)
  }
}

export const homepageStore = {
  get(): HomepageConfig {
    return load<HomepageConfig>(STORAGE_KEY_HOMEPAGE, {
      heroTitle: 'Custom Paper Packaging',
      heroSubtitle: 'Professional paper packaging & printing manufacturer, providing high-quality, customized solutions for international brands and importers.',
      heroBackgroundImage: '/images/hero-packaging.jpg',
      heroBackgroundPosition: 'center center',
      mobileBackgroundImage: '',
      heroImage1: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80',
      heroImage2: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=900&q=80',
      heroImage3: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=900&q=80',
      heroImage4: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=900&q=80',
      productCategoryImages: {
        'paper-boxes': 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1000&q=80',
        'gift-boxes': 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1000&q=80',
        'paper-bags': 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=80',
        'folding-cartons': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000&q=80',
        'food-packaging': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1000&q=80',
        'labels-sleeves': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80',
        'other-custom-packaging': 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1000&q=80',
      },
      aboutImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80',
      capabilityImages: {
        'Printing': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&q=80',
        'Die-Cutting': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1000&q=80',
        'Post-Processing': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80',
        'Quality Control': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80',
      },
      ctaImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1800&q=80',
    })
  },
  save(config: HomepageConfig) {
    save(STORAGE_KEY_HOMEPAGE, config)
  }
}
