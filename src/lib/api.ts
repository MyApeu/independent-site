import type { FooterConfig, HomepageConfig, MediaAsset } from '../data/cms'

export type Category = {
  id: string
  slug: string
  name: string
  image: string
  description: string
  featured?: boolean
  sortOrder?: number
}

export type Product = {
  id: string
  slug: string
  name: string
  categoryId: string | null
  category?: Category | null
  image: string
  gallery: string[]
  summary: string
  description: string
  specs: string[]
  featured: boolean
  published: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export type MediaItem = {
  id: string
  name: string
  url: string
  alt: string
  description: string
  size: number
  type: string
  width?: number | null
  height?: number | null
  createdAt: string
}

export type Inquiry = {
  id: string
  fullName: string
  companyName: string
  businessEmail: string
  phone: string
  country: string
  productType: string
  quantity: string
  packagingSize: string
  material: string
  printingRequirements: string
  additionalRequirements: string
  attachments: { name: string; url: string; size?: number; type?: string }[]
  status: string
  note: string
  createdAt: string
  updatedAt: string
}

export type Stats = {
  online: number
  historyOnline: number
  monthOnline: number
  pageViews: number
  todayPageViews: number
  ipSources: { ip: string; count: number }[]
  daily: { date: string; count: number }[]
  counts: { inquiries: number; media: number; products: number }
}

const TOKEN_KEY = 'jth_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem('jth_admin_auth', '1')
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('jth_admin_auth')
}

async function request<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(init.headers)
  if (auth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`/api${path}`, { ...init, headers })
  if (!res.ok) {
    let message = `请求失败 (${res.status})`
    try {
      const data = await res.json()
      if (data && typeof data.error === 'string') message = data.error
    } catch {
      // ignore json parse errors
    }
    if (res.status === 401) {
      clearToken()
      window.dispatchEvent(new Event('jth:unauthorized'))
    }
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

function toMediaAsset(item: MediaItem): MediaAsset {
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    alt: item.alt,
    description: item.description,
    size: item.size,
    type: item.type,
    width: item.width ?? undefined,
    height: item.height ?? undefined,
    uploadedAt: item.createdAt,
  }
}

export const api = {
  auth: {
    login: (password: string) =>
      request<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      }),
  },
  categories: {
    list: () => request<Category[]>('/categories'),
    create: (data: Partial<Category>) =>
      request<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }, true),
    update: (id: string, data: Partial<Category>) =>
      request<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    remove: (id: string) => request<{ ok: boolean }>(`/categories/${id}`, { method: 'DELETE' }, true),
  },
  products: {
    list: (params?: { category?: string; search?: string; all?: boolean }) => {
      const search = new URLSearchParams()
      if (params?.category) search.set('category', params.category)
      if (params?.search) search.set('search', params.search)
      if (params?.all) search.set('all', '1')
      const qs = search.toString()
      return request<Product[]>(`/products${qs ? `?${qs}` : ''}`)
    },
    get: (slug: string) => request<Product>(`/products/${slug}`),
    create: (data: Partial<Product>) =>
      request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }, true),
    update: (id: string, data: Partial<Product>) =>
      request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    remove: (id: string) => request<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE' }, true),
  },
  media: {
    list: async () => (await request<MediaItem[]>('/media')).map(toMediaAsset),
    upload: async (files: File[]) => {
      const form = new FormData()
      files.forEach((file) => form.append('files', file))
      const items = await request<MediaItem[]>('/media/upload', { method: 'POST', body: form }, true)
      return items.map(toMediaAsset)
    },
    addUrl: async (data: { name: string; url: string; alt?: string; description?: string }) =>
      toMediaAsset(
        await request<MediaItem>('/media', { method: 'POST', body: JSON.stringify(data) }, true),
      ),
    update: (id: string, data: Partial<MediaAsset>) =>
      request<MediaItem>(`/media/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    remove: (id: string) => request<{ ok: boolean }>(`/media/${id}`, { method: 'DELETE' }, true),
  },
  settings: {
    getHomepage: () => request<HomepageConfig>('/settings/homepage'),
    saveHomepage: (data: HomepageConfig) =>
      request<HomepageConfig>(
        '/settings/homepage',
        { method: 'PUT', body: JSON.stringify(data) },
        true,
      ),
    getFooter: () => request<FooterConfig>('/settings/footer'),
    saveFooter: (data: FooterConfig) =>
      request<FooterConfig>('/settings/footer', { method: 'PUT', body: JSON.stringify(data) }, true),
  },
  inquiries: {
    list: (params?: { search?: string; status?: string; from?: string; to?: string }) => {
      const search = new URLSearchParams()
      if (params?.search) search.set('search', params.search)
      if (params?.status && params.status !== 'all') search.set('status', params.status)
      if (params?.from) search.set('from', params.from)
      if (params?.to) search.set('to', params.to)
      const qs = search.toString()
      return request<Inquiry[]>(`/inquiries${qs ? `?${qs}` : ''}`, {}, true)
    },
    create: (data: FormData) =>
      request<Inquiry>('/inquiries', { method: 'POST', body: data }),
    update: (id: string, data: { status?: string; note?: string }) =>
      request<Inquiry>(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    remove: (id: string) => request<{ ok: boolean }>(`/inquiries/${id}`, { method: 'DELETE' }, true),
  },
  stats: {
    get: () => request<Stats>('/stats', {}, true),
    track: (sessionId: string, path: string) => {
      const body = JSON.stringify({ sessionId, path, referer: document.referrer || '' })
      if (typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/stats/track', new Blob([body], { type: 'application/json' }))
        return
      }
      void fetch('/api/stats/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    },
  },
}
