import { useState } from 'react'
import { Save } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { productCategories } from '../../data/products'

export default function AdminHomepage() {
  const { homepage, saveHomepage, media } = useCms()
  const [config, setConfig] = useState(homepage)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveHomepage(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selectImage = (field: string, value: string) => {
    setConfig({ ...config, [field]: value })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Homepage Management</h1>
          <p className="text-gray-600">Manage all homepage images and content</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
          <Save size={18} />
          {saved ? 'Saved!' : 'Save & Publish'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Hero Background Image (full-screen)</label>
              <input
                value={config.heroBackgroundImage || ''}
                onChange={(e) => selectImage('heroBackgroundImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 mb-2"
                placeholder="/images/hero-packaging.jpg"
              />
              {config.heroBackgroundImage && (
                <img src={config.heroBackgroundImage} alt="" className="w-full h-40 object-cover" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Position</label>
              <select
                value={config.heroBackgroundPosition || 'center center'}
                onChange={(e) => selectImage('heroBackgroundPosition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300"
              >
                <option value="center center">Center</option>
                <option value="center left">Left</option>
                <option value="center right">Right</option>
                <option value="top center">Top</option>
                <option value="bottom center">Bottom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Background Image (optional)</label>
              <input
                value={config.mobileBackgroundImage || ''}
                onChange={(e) => selectImage('mobileBackgroundImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300"
                placeholder="Leave empty to reuse desktop image"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Image 1</label>
              <input value={config.heroImage1} onChange={(e) => selectImage('heroImage1', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage1} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Image 2</label>
              <input value={config.heroImage2} onChange={(e) => selectImage('heroImage2', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage2} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Image 3</label>
              <input value={config.heroImage3} onChange={(e) => selectImage('heroImage3', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage3} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Image 4</label>
              <input value={config.heroImage4} onChange={(e) => selectImage('heroImage4', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage4} alt="" className="w-full h-32 object-cover" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {productCategories.map(cat => (
              <div key={cat.slug}>
                <label className="block text-sm font-medium mb-2">{cat.name}</label>
                <input
                  value={config.productCategoryImages[cat.slug] || ''}
                  onChange={(e) => setConfig({ ...config, productCategoryImages: { ...config.productCategoryImages, [cat.slug]: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 mb-2"
                />
                <img src={config.productCategoryImages[cat.slug]} alt="" className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">About Us & Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">About Us Image</label>
              <input value={config.aboutImage} onChange={(e) => selectImage('aboutImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.aboutImage} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Background Image</label>
              <input value={config.ctaImage} onChange={(e) => selectImage('ctaImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.ctaImage} alt="" className="w-full h-32 object-cover" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Media Library</h2>
          <p className="text-sm text-gray-600 mb-4">Copy image URLs from Media Library to use above</p>
          <div className="grid grid-cols-4 gap-2">
            {media.slice(0, 8).map(m => (
              <button key={m.id} onClick={() => navigator.clipboard.writeText(m.url)} className="aspect-square overflow-hidden">
                <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
