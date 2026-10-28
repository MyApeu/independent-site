import { useState } from 'react'
import { Plus, Save, Trash2, Pencil } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { api, type Category } from '../../lib/api'
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

type FormState = {
  name: string
  slug: string
  image: string
  description: string
  featured: boolean
  sortOrder: number
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  image: '',
  description: '',
  featured: false,
  sortOrder: 0,
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminCategories() {
  const { categories, refreshCategories } = useCms()
  const [editing, setEditing] = useState<{ mode: 'add' | 'edit'; id?: string } | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setEditing({ mode: 'add' })
    setForm({ ...emptyForm, sortOrder: categories.length })
    setError('')
  }

  const openEdit = (category: Category) => {
    setEditing({ mode: 'edit', id: category.id })
    setForm({
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
      featured: Boolean(category.featured),
      sortOrder: category.sortOrder ?? 0,
    })
    setError('')
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('名称和 slug 必填')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editing?.mode === 'add') {
        await api.categories.create(form)
      } else if (editing?.mode === 'edit' && editing.id) {
        await api.categories.update(editing.id, form)
      }
      await refreshCategories()
      setEditing(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category: Category) => {
    if (!window.confirm(`确定删除分类“${category.name}”吗？该分类下的产品将变为未分类。`)) return
    try {
      await api.categories.remove(category.id)
      await refreshCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  return (
    <div className="p-6">
      <PageHeader
        title="分类管理"
        description="分类会同步显示在前台导航和产品页面"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} />
            添加分类
          </Button>
        }
      />

      <Card>
        {categories.length === 0 ? (
          <EmptyState>暂无分类。点击右上角“添加分类”创建第一个分类。</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>图片</th>
                  <th className={thClass}>名称</th>
                  <th className={thClass}>Slug</th>
                  <th className={thClass}>排序</th>
                  <th className={thClass}>首页推荐</th>
                  <th className={`${thClass} text-right`}>操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/60">
                    <td className={tdClass}>
                      <div className="w-20">
                        <ImagePreview src={category.image} alt={category.name} ratio="aspect-[4/3]" />
                      </div>
                    </td>
                    <td className={`${tdClass} font-medium text-gray-900`}>{category.name}</td>
                    <td className={`${tdClass} text-gray-500`}>{category.slug}</td>
                    <td className={tdClass}>{category.sortOrder ?? 0}</td>
                    <td className={tdClass}>{category.featured ? '是' : '否'}</td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => openEdit(category)}>
                          <Pencil size={12} /> 编辑
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => remove(category)}>
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
          title={editing.mode === 'add' ? '添加分类' : '编辑分类'}
          subtitle="图片建议使用 4:3 比例，显示效果最佳"
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
            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="名称">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="例如：Paper Boxes" />
              </Field>
              <Field label="Slug">
                <div className="flex gap-2">
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="paper-boxes" />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setForm({ ...form, slug: slugify(form.name) })}
                    type="button"
                  >
                    生成
                  </Button>
                </div>
              </Field>
            </div>
            <Field label="图片 URL" hint="可从媒体库复制图片链接粘贴到这里">
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} placeholder="/uploads/xxx.jpg" />
            </Field>
            {form.image && <ImagePreview src={form.image} alt={form.name} ratio="aspect-[4/3]" />}
            <Field label="描述">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
            </Field>
            <div className="flex flex-wrap items-end gap-6">
              <Field label="排序" className="w-24">
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputClass} />
              </Field>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-brand-orange" />
                首页推荐
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
