import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import { productCategories } from '../../data/products'

export default function AdminCategories() {
  const [items, setItems] = useState(productCategories)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', slug: '' })

  const openAdd = () => {
    setEditing({ mode: 'add' })
    setForm({ name: '', slug: '' })
  }

  const openEdit = (cat: any) => {
    setEditing({ mode: 'edit', id: cat.id })
    setForm({ name: cat.name, slug: cat.slug })
  }

  const save = () => {
    if (editing?.mode === 'add') {
      const newCat = { id: Date.now().toString(), name: form.name, slug: form.slug }
      setItems([...items, newCat])
    } else if (editing?.mode === 'edit') {
      setItems(items.map((i: any) => i.id === editing.id ? { ...i, ...form } : i))
    }
    setEditing(null)
  }

  const remove = (id: string) => {
    setItems(items.filter((i: any) => i.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">分类管理</h1>
          <p className="text-gray-600">管理产品分类</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
          <Plus size={18} />
          添加分类
        </button>
      </div>
      <div className="bg-white border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-sm">名称</th>
              <th className="text-left p-3 text-sm">Slug</th>
              <th className="text-right p-3 text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((cat: any) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 text-gray-600">{cat.slug}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => openEdit(cat)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200">编辑</button>
                  <button onClick={() => remove(cat.id)} className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6">
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
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a] flex items-center gap-2">
                <Save size={16} />
                保存
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
