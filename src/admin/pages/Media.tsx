import { useState } from 'react'
import { Upload, Trash2, Copy } from 'lucide-react'
import { useCms } from '../../context/CmsContext'

export default function AdminMedia() {
  const { media, addMedia, removeMedia } = useCms()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = () => {
        const asset = {
          id: Date.now().toString() + i,
          name: file.name,
          url: reader.result as string,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }
        addMedia(asset)
        if (i === files.length - 1) setUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL 已复制')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">媒体库</h1>
          <p className="text-gray-600">上传和管理网站所有图片</p>
        </div>
        <label className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] cursor-pointer flex items-center gap-2">
          <Upload size={18} />
          {uploading ? '上传中...' : '上传图片'}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
      <div className="bg-white border border-gray-200">
        {media.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            暂无上传的图片。点击“上传图片”开始使用。
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {media.map((asset) => (
              <div key={asset.id} className="border border-gray-200 group">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={asset.url} alt={asset.alt} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-xs truncate mb-1">{asset.name}</p>
                  <div className="flex gap-1">
                    <button onClick={() => copyUrl(asset.url)} className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1">
                      <Copy size={12} /> 复制
                    </button>
                    <button onClick={() => removeMedia(asset.id)} className="px-2 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
