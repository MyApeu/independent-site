import { useState } from 'react'
import { Upload, Trash2, Copy } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { Button, Card, EmptyState, PageHeader } from '../components/ui'

function formatSize(bytes: number) {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminMedia() {
  const { media, uploadMedia, removeMedia } = useCms()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list || list.length === 0) return
    setUploading(true)
    try {
      await uploadMedia(Array.from(list))
    } catch (error) {
      alert(error instanceof Error ? error.message : '上传失败')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const copyUrl = (url: string) => {
    const absolute = url.startsWith('http') ? url : `${window.location.origin}${url}`
    navigator.clipboard.writeText(absolute)
    alert('URL 已复制')
  }

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`确定删除图片“${name}”吗？`)) return
    try {
      await removeMedia(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <div className="p-6">
      <PageHeader
        title="媒体库"
        description="上传和管理网站所有图片，复制 URL 后可在首页或产品中使用"
        actions={
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#e6741a]">
            <Upload size={16} />
            {uploading ? '上传中...' : '上传图片'}
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        }
      />

      <Card>
        {media.length === 0 ? (
          <EmptyState>暂无上传的图片。点击右上角“上传图片”开始使用。</EmptyState>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {media.map((asset) => (
              <div key={asset.id} className="group overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={asset.url} alt={asset.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-gray-700" title={asset.name}>{asset.name}</p>
                  <p className="mb-2 mt-0.5 text-[11px] text-gray-400">{formatSize(asset.size)}</p>
                  <div className="flex gap-1">
                    <button onClick={() => copyUrl(asset.url)} className="flex flex-1 items-center justify-center gap-1 rounded-md bg-gray-100 px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200">
                      <Copy size={12} /> 复制 URL
                    </button>
                    <Button variant="danger" size="sm" onClick={() => remove(asset.id, asset.name)} aria-label="删除图片">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
