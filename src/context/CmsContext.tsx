import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mediaStore, homepageStore, type MediaAsset, type HomepageConfig } from '../data/cms'

interface CmsContextType {
  media: MediaAsset[]
  homepage: HomepageConfig
  refreshMedia: () => void
  addMedia: (asset: MediaAsset) => void
  updateMedia: (id: string, updates: Partial<MediaAsset>) => void
  removeMedia: (id: string) => void
  saveHomepage: (config: HomepageConfig) => void
}

const CmsContext = createContext<CmsContextType | undefined>(undefined)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [homepage, setHomepage] = useState<HomepageConfig>(homepageStore.get())

  useEffect(() => {
    setMedia(mediaStore.getAll())
  }, [])

  const refreshMedia = () => setMedia(mediaStore.getAll())
  const addMedia = (asset: MediaAsset) => {
    mediaStore.add(asset)
    refreshMedia()
  }
  const updateMedia = (id: string, updates: Partial<MediaAsset>) => {
    mediaStore.update(id, updates)
    refreshMedia()
  }
  const removeMedia = (id: string) => {
    mediaStore.remove(id)
    refreshMedia()
  }
  const saveHomepage = (config: HomepageConfig) => {
    homepageStore.save(config)
    setHomepage(config)
  }

  return (
    <CmsContext.Provider value={{ media, homepage, refreshMedia, addMedia, updateMedia, removeMedia, saveHomepage }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
