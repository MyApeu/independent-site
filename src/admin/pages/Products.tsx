import { useEffect, useState } from 'react'
import { Plus, Save, Pencil, Trash2 } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { api, type Product } from '../../lib/api'
import {
  Button,
  Card,
  EmptyState,
  Field,
  ImagePreview,
  Modal,
  PageHeader,
  inputClass,
  tableClass,
  tdClass,
  thClass,
  theadClass,
} from '../components/ui'

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
  const [formError, setFormError] = useState('')

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
    setFormError('')
  }

  const openEdit = (product: Product) => {
    setEditing({ mode: 'edit', id: product.id })
    setForm(toForm(product))
    setFormError('')
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError('名称和 slug 必填')
      return
    }
    setSaving(true)
    setFormError('')
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
      setFormError(err instanceof Error ? err.message : '保存失败')
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
      <PageHeader
        title="产品管理"
        description="产品会展示在对应分类页面，支持图片、规格和发布状态管理"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            添加产品
          </Button>
        }
      />

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Card>
        {loading ? (
          <EmptyState>加载中...</EmptyState>
        ) : products.length === 0 ? (
          <EmptyState>暂无产品。点击右上角“添加产品”创建第一个产品。</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>图片</th>
                  <th className={thClass}>名称</th>
                  <th className={thClass}>分类</th>
                  <th className={thClass}>推荐</th>
                  <th className={thClass}>状态</th>
                  <th className={thClass}>排序</th>
                  <th className={`${thClass} text-right`}>操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60">
                    <td className={tdClass}>
                      <div className="w-20">
                        <ImagePreview src={product.image} alt={product.name} ratio="aspect-[4/3]" />
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.slug}</div>
                    </td>
                    <td className={tdClass}>{product.category?.name || '未分类'}</td>
                    <td className={tdClass}>{product.featured ? '是' : '否'}</td>
                    <td className={tdClass}>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${product.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.published ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className={tdClass}>{product.sortOrder}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => openEdit(product)}>
                          <Pencil size={12} /> 编辑
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => remove(product)}>
                          <Trash2 size={12} /> 删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <Modal
          title={editing.mode === 'add' ? '添加产品' : '编辑产品'}
          subtitle="图片建议使用 4:3 比例，保存后立即同步到前台"
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEditing(null)}>取消</Button>
              <Button onClick={save} disabled={saving}>
                <Save size={16} />
                {saving ? '保存中...' : '保存'}
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            {formError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="名称">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Slug">
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="kraft-gift-box" />
              </Field>
              <Field label="分类">
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                  <option value="">未分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="排序">
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputClass} />
              </Field>
            </div>
            <Field label="主图 URL" hint="可从媒体库复制图片链接">
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} placeholder="/uploads/xxx.jpg" />
            </Field>
            {form.image && <ImagePreview src={form.image} alt={form.name} ratio="aspect-[4/3]" />}
            <Field label="图库 URL" hint="每行一个链接">
              <textarea value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} rows={2} className={inputClass} />
            </Field>
            <Field label="简介">
              <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={inputClass} />
            </Field>
            <Field label="详细描述">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
            </Field>
            <Field label="规格参数" hint="每行一条，例如：Material: 350gsm art paper">
              <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={3} className={inputClass} />
            </Field>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-brand-orange" />
                首页推荐
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-brand-orange" />
                发布到前台
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
