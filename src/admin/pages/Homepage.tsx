import { useEffect, useState } from 'react'
import { Save, Copy } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import {
  Button,
  Field,
  ImagePreview,
  PageHeader,
  SectionCard,
  inputClass,
} from '../components/ui'

function FooterEdit() {
  const { footer, saveFooter } = useCms()
  const [config, setConfig] = useState(footer)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setConfig(footer)
  }, [footer])

  const handleSave = async () => {
    setError('')
    try {
      await saveFooter(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="公司英文名">
          <input value={config.companyNameEn} onChange={(e) => setConfig({ ...config, companyNameEn: e.target.value })} className={inputClass} />
        </Field>
        <Field label="公司中文名">
          <input value={config.companyNameCn} onChange={(e) => setConfig({ ...config, companyNameCn: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <Field label="描述">
        <textarea value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} className={inputClass} rows={2} />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="地址">
          <input value={config.address} onChange={(e) => setConfig({ ...config, address: e.target.value })} className={inputClass} />
        </Field>
        <Field label="邮箱">
          <input value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })} className={inputClass} />
        </Field>
        <Field label="电话">
          <input value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <Button onClick={handleSave}>
        <Save size={16} />
        {saved ? '已保存！' : '保存页尾'}
      </Button>
    </div>
  )
}

export default function AdminHomepage() {
  const { homepage, saveHomepage, media, categories } = useCms()
  const [config, setConfig] = useState(homepage)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setConfig(homepage)
  }, [homepage])

  const handleSave = async () => {
    setError('')
    try {
      await saveHomepage(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const copyUrl = (url: string) => {
    const absolute = url.startsWith('http') ? url : `${window.location.origin}${url}`
    navigator.clipboard.writeText(absolute)
    alert('URL 已复制')
  }

  return (
    <div className="p-6">
      <PageHeader
        title="首页管理"
        description="编辑首屏文字、全站图片和页尾联系方式，保存后立即同步到前台"
        actions={
          <Button onClick={handleSave}>
            <Save size={16} />
            {saved ? '已保存！' : '保存并发布'}
          </Button>
        }
      />

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-6">
        <SectionCard title="首屏区域" description="网站第一屏的标题、副标题和背景图">
          <div className="grid gap-4">
            <Field label="首屏标题">
              <input
                value={config.heroTitle || ''}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className={inputClass}
                placeholder="Custom Paper Packaging"
              />
            </Field>
            <Field label="首屏副标题">
              <textarea
                value={config.heroSubtitle || ''}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className={inputClass}
                rows={2}
                placeholder="副标题内容"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="背景图 URL" hint="建议尺寸 1920×1080，16:9 比例">
                <input
                  value={config.heroBackgroundImage || ''}
                  onChange={(e) => setConfig({ ...config, heroBackgroundImage: e.target.value })}
                  className={inputClass}
                  placeholder="/images/hero-packaging.jpg"
                />
              </Field>
              <Field label="背景位置">
                <select
                  value={config.heroBackgroundPosition || 'center center'}
                  onChange={(e) => setConfig({ ...config, heroBackgroundPosition: e.target.value })}
                  className={inputClass}
                >
                  <option value="center center">居中</option>
                  <option value="center left">左侧</option>
                  <option value="center right">右侧</option>
                  <option value="top center">顶部</option>
                  <option value="bottom center">底部</option>
                </select>
              </Field>
            </div>
            <Field label="移动端背景图（可选）" hint="留空则复用桌面端背景图">
              <input
                value={config.mobileBackgroundImage || ''}
                onChange={(e) => setConfig({ ...config, mobileBackgroundImage: e.target.value })}
                className={inputClass}
                placeholder="留空则复用桌面端图片"
              />
            </Field>
            {config.heroBackgroundImage && <ImagePreview src={config.heroBackgroundImage} alt="首屏背景图" ratio="aspect-[16/9]" />}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(['heroImage1', 'heroImage2', 'heroImage3', 'heroImage4'] as const).map((field, index) => (
                <div key={field} className="space-y-2">
                  <Field label={`首屏图片 ${index + 1}`}>
                    <input value={config[field]} onChange={(e) => setConfig({ ...config, [field]: e.target.value })} className={inputClass} />
                  </Field>
                  <ImagePreview src={config[field]} alt={`首屏图片 ${index + 1}`} ratio="aspect-[4/3]" />
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="关于我们文字" description="首页“关于我们”板块的标签、标题和介绍文字">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="标签">
                <input value={config.aboutTagline || ''} onChange={(e) => setConfig({ ...config, aboutTagline: e.target.value })} className={inputClass} placeholder="ABOUT US" />
              </Field>
              <Field label="标题">
                <input value={config.aboutTitle || ''} onChange={(e) => setConfig({ ...config, aboutTitle: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="介绍文字">
              <textarea value={config.aboutDescription || ''} onChange={(e) => setConfig({ ...config, aboutDescription: e.target.value })} className={inputClass} rows={3} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Field label="关于我们图片 URL" hint="建议 4:3 比例">
                  <input value={config.aboutImage} onChange={(e) => setConfig({ ...config, aboutImage: e.target.value })} className={inputClass} />
                </Field>
                <ImagePreview src={config.aboutImage} alt="关于我们" ratio="aspect-[4/3]" />
              </div>
              <div className="space-y-2">
                <Field label="行动号召背景图 URL" hint="建议 16:9 比例">
                  <input value={config.ctaImage} onChange={(e) => setConfig({ ...config, ctaImage: e.target.value })} className={inputClass} />
                </Field>
                <ImagePreview src={config.ctaImage} alt="行动号召背景" ratio="aspect-[16/9]" />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="行动号召文字" description="首页底部行动号召板块的标题和说明">
          <div className="grid gap-4">
            <Field label="标题">
              <input value={config.ctaTitle || ''} onChange={(e) => setConfig({ ...config, ctaTitle: e.target.value })} className={inputClass} />
            </Field>
            <Field label="说明文字">
              <textarea value={config.ctaDescription || ''} onChange={(e) => setConfig({ ...config, ctaDescription: e.target.value })} className={inputClass} rows={2} />
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="产品分类图片" description="为每个产品分类设置首页展示图片，建议 4:3 比例">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.slug} className="space-y-2">
                <Field label={category.name}>
                  <input
                    value={config.productCategoryImages[category.slug] || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        productCategoryImages: { ...config.productCategoryImages, [category.slug]: e.target.value },
                      })
                    }
                    className={inputClass}
                  />
                </Field>
                <ImagePreview src={config.productCategoryImages[category.slug]} alt={category.name} ratio="aspect-[4/3]" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="页尾联系方式" description="修改页尾显示的公司信息和联系方式">
          <FooterEdit />
        </SectionCard>

        <SectionCard title="媒体库" description="点击图片复制 URL，粘贴到上方任意图片输入框">
          {media.length === 0 ? (
            <p className="text-sm text-gray-500">媒体库暂无图片，请先到“媒体库”上传。</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {media.slice(0, 12).map((asset) => (
                <button key={asset.id} onClick={() => copyUrl(asset.url)} className="group relative overflow-hidden rounded-lg border border-gray-200" title={asset.name}>
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img src={asset.url} alt={asset.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/60 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Copy size={11} /> 复制 URL
                  </span>
                </button>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
