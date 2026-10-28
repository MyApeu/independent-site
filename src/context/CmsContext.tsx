import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { homepageStore, footerStore, type MediaAsset, type HomepageConfig, type FooterConfig } from '../data/cms'
import { productCategories } from '../data/products'
import { api, type Category } from '../lib/api'

const fallbackCategories: Category[] = productCategories.map((category, index) => ({
  ...category,
  featured: Boolean(category.featured),
  sortOrder: index,
}))

interface CmsContextType {
  media: MediaAsset[]
  homepage: HomepageConfig
  footer: FooterConfig
  categories: Category[]
  refreshMedia: () => Promise<void>
  refreshCategories: () => Promise<void>
  uploadMedia: (files: File[]) => Promise<MediaAsset[]>
  addMediaUrl: (data: { name: string; url: string; alt?: string; description?: string }) => Promise<void>
  updateMedia: (id: string, updates: Partial<MediaAsset>) => Promise<void>
  removeMedia: (id: string) => Promise<void>
  saveHomepage: (config: HomepageConfig) => Promise<void>
  saveFooter: (config: FooterConfig) => Promise<void>
}

const CmsContext = createContext<CmsContextType | undefined>(undefined)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [homepage, setHomepage] = useState<HomepageConfig>(homepageStore.get())
  const [footer, setFooter] = useState<FooterConfig>(footerStore.get())

  const refreshMedia = useCallback(async () => {
    try {
      setMedia(await api.media.list())
    } catch (error) {
      console.warn('加载媒体库失败', error)
    }
  }, [])

  const refreshCategories = useCallback(async () => {
    try {
      const list = await api.categories.list()
      if (list.length > 0) setCategories(list)
    } catch (error) {
      console.warn('加载产品分类失败', error)
    }
  }, [])

  useEffect(() => {
    let alive = true
    Promise.allSettled([
      api.categories.list(),
      api.media.list(),
      api.settings.getHomepage(),
      api.settings.getFooter(),
    ]).then(([categoryResult, mediaResult, homepageResult, footerResult]) => {
      if (!alive) return
      if (categoryResult.status === 'fulfilled' && categoryResult.value.length > 0) {
        setCategories(categoryResult.value)
      }
      if (mediaResult.status === 'fulfilled') setMedia(mediaResult.value)
      if (homepageResult.status === 'fulfilled') {
        setHomepage((prev) => ({ ...prev, ...homepageResult.value }))
      }
      if (footerResult.status === 'fulfilled') {
        setFooter((prev) => ({ ...prev, ...footerResult.value }))
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const uploadMedia = useCallback(async (files: File[]) => {
    const created = await api.media.upload(files)
    await refreshMedia()
    return created
  }, [refreshMedia])

  const addMediaUrl = useCallback(async (data: { name: string; url: string; alt?: string; description?: string }) => {
    await api.media.addUrl(data)
    await refreshMedia()
  }, [refreshMedia])

  const updateMedia = useCallback(async (id: string, updates: Partial<MediaAsset>) => {
    await api.media.update(id, updates)
    await refreshMedia()
  }, [refreshMedia])

  const removeMedia = useCallback(async (id: string) => {
    await api.media.remove(id)
    await refreshMedia()
  }, [refreshMedia])

  const saveHomepage = useCallback(async (config: HomepageConfig) => {
    const saved = await api.settings.saveHomepage(config)
    setHomepage((prev) => ({ ...prev, ...saved }))
  }, [])

  const saveFooter = useCallback(async (config: FooterConfig) => {
    const saved = await api.settings.saveFooter(config)
    setFooter((prev) => ({ ...prev, ...saved }))
  }, [])

  return (
    <CmsContext.Provider
      value={{
        media,
        homepage,
        footer,
        categories,
        refreshMedia,
        refreshCategories,
        uploadMedia,
        addMediaUrl,
        updateMedia,
        removeMedia,
        saveHomepage,
        saveFooter,
      }}
    >
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
