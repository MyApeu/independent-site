import { useState } from 'react'
import { Save } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { productCategories } from '../../data/products'

function FooterEdit() {
  const { footer, saveFooter } = useCms()
  const [config, setConfig] = useState(footer)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveFooter(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">公司英文名</label>
          <input value={config.companyNameEn} onChange={(e) => setConfig({ ...config, companyNameEn: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">公司中文名</label>
          <input value={config.companyNameCn} onChange={(e) => setConfig({ ...config, companyNameCn: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">描述</label>
        <textarea value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300" rows={2} />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">地址</label>
          <input value={config.address} onChange={(e) => setConfig({ ...config, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <input value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">电话</label>
          <input value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
        </div>
      </div>
      <button onClick={handleSave} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
        <Save size={16} />
        {saved ? '已保存！' : '保存页尾'}
      </button>
    </div>
  )
}

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
          <h1 className="text-2xl font-bold mb-1">首页管理</h1>
          <p className="text-gray-600">管理首页所有图片和内容</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
          <Save size={18} />
          {saved ? '已保存！' : '保存并发布'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">首屏区域</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">首屏标题</label>
              <input
                value={config.heroTitle || ''}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300"
                placeholder="Custom Paper Packaging"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">首屏副标题</label>
              <textarea
                value={config.heroSubtitle || ''}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300"
                rows={3}
                placeholder="副标题内容"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">首屏背景图（全屏）</label>
              <input
                value={config.heroBackgroundImage || ''}
                onChange={(e) => selectImage('heroBackgroundImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 mb-2"
                placeholder="/images/hero-packaging.jpg"
              />
              {config.heroBackgroundImage && (
                <img src={config.heroBackgroundImage} alt="" className="w-full h-40 object-cover" style={{ objectPosition: config.heroBackgroundPosition || 'center center' }} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">背景位置</label>
              <select
                value={config.heroBackgroundPosition || 'center center'}
                onChange={(e) => selectImage('heroBackgroundPosition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300"
              >
                <option value="center center">居中</option>
                <option value="center left">左侧</option>
                <option value="center right">右侧</option>
                <option value="top center">顶部</option>
                <option value="bottom center">底部</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">移动端背景图（可选）</label>
              <input
                value={config.mobileBackgroundImage || ''}
                onChange={(e) => selectImage('mobileBackgroundImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300"
                placeholder="留空则复用桌面端图片"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">首屏图片 1</label>
              <input value={config.heroImage1} onChange={(e) => selectImage('heroImage1', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage1} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">首屏图片 2</label>
              <input value={config.heroImage2} onChange={(e) => selectImage('heroImage2', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage2} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">首屏图片 3</label>
              <input value={config.heroImage3} onChange={(e) => selectImage('heroImage3', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage3} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">首屏图片 4</label>
              <input value={config.heroImage4} onChange={(e) => selectImage('heroImage4', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.heroImage4} alt="" className="w-full h-32 object-cover" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">产品分类</h2>
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
          <h2 className="text-lg font-semibold mb-4">关于我们与能力</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">关于我们图片</label>
              <input value={config.aboutImage} onChange={(e) => selectImage('aboutImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.aboutImage} alt="" className="w-full h-32 object-cover" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">行动号召背景图</label>
              <input value={config.ctaImage} onChange={(e) => selectImage('ctaImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 mb-2" />
              <img src={config.ctaImage} alt="" className="w-full h-32 object-cover" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">页尾联系方式（修改界面）</h2>
          <p className="text-sm text-gray-600 mb-4">修改页尾显示的公司信息</p>
          <FooterEdit />
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">媒体库</h2>
          <p className="text-sm text-gray-600 mb-4">从媒体库复制图片 URL 以在上方使用</p>
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
