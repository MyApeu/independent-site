import { useEffect, useState } from 'react'
import { Plus, Save, X, Pencil, Trash2 } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { api, type Product } from '../../lib/api'

type ProductForm = {
  name: string
  slug: string
  categoryId: string
  image: string
  gallery: string
  summary: string
  description: string
  specs: string
  featured: boolean
  published: boolean
  sortOrder: number
}

const emptyForm: ProductForm = {
  name: '',
  slug: '',
  categoryId: '',
  image: '',
  gallery: '',
  summary: '',
  description: '',
  specs: '',
  featured: false,
  published: true,
  sortOrder: 0,
}

function toForm(product: Product): ProductForm {
  return {
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId || '',
    image: product.image,
    gallery: product.gallery.join('\n'),
    summary: product.summary,
    description: product.description,
    specs: product.specs.join('\n'),
    featured: product.featured,
    published: product.published,
    sortOrder: product.sortOrder,
  }
}

function linesToArray(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminProducts() {
  const { categories } = useCms()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<{ mode: 'add' | 'edit'; id?: string } | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await api.products.list({ all: true }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载产品失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const openAdd = () => {
    setEditing({ mode: 'add' })
    setForm({ ...emptyForm, categoryId: categories[0]?.id || '', sortOrder: products.length })
  }

  const openEdit = (product: Product) => {
    setEditing({ mode: 'edit', id: product.id })
    setForm(toForm(product))
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert('名称和 slug 必填')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        categoryId: form.categoryId || null,
        image: form.image,
        gallery: linesToArray(form.gallery),
        summary: form.summary,
        description: form.description,
        specs: linesToArray(form.specs),
        featured: form.featured,
        published: form.published,
        sortOrder: form.sortOrder,
      }
      if (editing?.mode === 'add') {
        await api.products.create(payload)
      } else if (editing?.mode === 'edit' && editing.id) {
        await api.products.update(editing.id, payload)
      }
      await load()
      setEditing(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (product: Product) => {
    if (!window.confirm(`确定删除产品“${product.name}”吗？`)) return
    try {
      await api.products.remove(product.id)
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">产品管理</h1>
          <p className="text-gray-600">管理产品及图片，产品将展示在对应分类页面</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
          <Plus size={18} />
          添加产品
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="bg-white border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-500">加载中...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">暂无产品。点击“添加产品”创建第一个产品。</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm">图片</th>
                <th className="text-left p-3 text-sm">名称</th>
                <th className="text-left p-3 text-sm">分类</th>
                <th className="text-left p-3 text-sm">推荐</th>
                <th className="text-left p-3 text-sm">发布</th>
                <th className="text-left p-3 text-sm">排序</th>
                <th className="text-right p-3 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="p-3">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-16 h-12 object-cover border border-gray-200" />
                    ) : (
                      <span className="text-xs text-gray-400">无</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.slug}</div>
                  </td>
                  <td className="p-3 text-gray-600">{product.category?.name || '未分类'}</td>
                  <td className="p-3 text-gray-600">{product.featured ? '是' : '否'}</td>
                  <td className="p-3 text-gray-600">{product.published ? '已发布' : '草稿'}</td>
                  <td className="p-3 text-gray-600">{product.sortOrder}</td>
                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(product)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 inline-flex items-center gap-1">
                      <Pencil size={12} /> 编辑
                    </button>
                    <button onClick={() => void remove(product)} className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center gap-1">
                      <Trash2 size={12} /> 删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing.mode === 'add' ? '添加产品' : '编辑产品'}</h3>
              <button onClick={() => setEditing(null)}><X size={20} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">名称</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300" placeholder="kraft-gift-box" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 border border-gray-300">
                  <option value="">未分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">排序</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">主图 URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300" placeholder="/uploads/xxx.jpg" />
                {form.image && <img src={form.image} alt="" className="mt-2 w-full h-36 object-cover border border-gray-200" />}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">图库 URL（每行一个）</label>
                <textarea value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">简介</label>
                <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">详细描述</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">规格参数（每行一条）</label>
                <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300" placeholder="Material: 350gsm art paper" />
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  首页推荐
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  发布到前台
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2 disabled:opacity-50">
                <Save size={16} />
                {saving ? '保存中...' : '保存'}
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
