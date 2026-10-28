import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import { useCms } from '../../context/CmsContext'
import { api, type Category } from '../../lib/api'

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

export default function AdminCategories() {
  const { categories, refreshCategories } = useCms()
  const [editing, setEditing] = useState<{ mode: 'add' | 'edit'; id?: string } | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openAdd = () => {
    setEditing({ mode: 'add' })
    setForm({ ...emptyForm, sortOrder: categories.length })
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
  }

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert('名称和 slug 必填')
      return
    }
    setSaving(true)
    try {
      if (editing?.mode === 'add') {
        await api.categories.create(form)
      } else if (editing?.mode === 'edit' && editing.id) {
        await api.categories.update(editing.id, form)
      }
      await refreshCategories()
      setEditing(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category: Category) => {
    if (!window.confirm(`确定删除分类“${category.name}”吗？该分类下的产品将变为未分类。`)) return
    try {
      await api.categories.remove(category.id)
      await refreshCategories()
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">分类管理</h1>
          <p className="text-gray-600">管理产品分类（同步前台导航与产品页）</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
          <Plus size={18} />
          添加分类
        </button>
      </div>
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm">图片</th>
              <th className="text-left p-3 text-sm">名称</th>
              <th className="text-left p-3 text-sm">Slug</th>
              <th className="text-left p-3 text-sm">排序</th>
              <th className="text-left p-3 text-sm">推荐</th>
              <th className="text-right p-3 text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-0">
                <td className="p-3">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-16 h-12 object-cover border border-gray-200" />
                  ) : (
                    <span className="text-xs text-gray-400">无</span>
                  )}
                </td>
                <td className="p-3">{category.name}</td>
                <td className="p-3 text-gray-600">{category.slug}</td>
                <td className="p-3 text-gray-600">{category.sortOrder ?? 0}</td>
                <td className="p-3 text-gray-600">{category.featured ? '是' : '否'}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => openEdit(category)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200">编辑</button>
                  <button onClick={() => remove(category)} className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100">删除</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">暂无分类</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing.mode === 'add' ? '添加分类' : '编辑分类'}</h3>
              <button onClick={() => setEditing(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">名称</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300" placeholder="paper-boxes" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">图片 URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300" placeholder="/uploads/xxx.jpg" />
                {form.image && <img src={form.image} alt="" className="mt-2 w-full h-32 object-cover border border-gray-200" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300" />
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-24 px-3 py-2 border border-gray-300" />
                </div>
                <label className="flex items-center gap-2 mt-5 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  首页推荐
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
