import { useEffect, useMemo, useState } from 'react'
import { Search, X, Trash2, Paperclip } from 'lucide-react'
import { api, type Inquiry } from '../../lib/api'

const statusLabels: Record<string, string> = {
  pending: '待处理',
  contacted: '已联系',
  quoted: '已报价',
  closed: '已关闭',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  quoted: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-600',
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setInquiries(await api.inquiries.list())
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载询盘失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const keyword = searchTerm.trim().toLowerCase()
      const matchesSearch =
        keyword === '' ||
        inquiry.fullName.toLowerCase().includes(keyword) ||
        inquiry.companyName.toLowerCase().includes(keyword) ||
        inquiry.businessEmail.toLowerCase().includes(keyword) ||
        inquiry.phone.toLowerCase().includes(keyword)
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
      const matchesDate = dateFilter === '' || inquiry.createdAt.startsWith(dateFilter)
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [inquiries, searchTerm, statusFilter, dateFilter])

  const updateStatus = async (inquiry: Inquiry, status: string) => {
    try {
      const updated = await api.inquiries.update(inquiry.id, { status })
      setInquiries((prev) => prev.map((item) => (item.id === inquiry.id ? updated : item)))
      if (selected?.id === inquiry.id) setSelected(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新状态失败')
    }
  }

  const openDetail = (inquiry: Inquiry) => {
    setSelected(inquiry)
    setNote(inquiry.note || '')
  }

  const saveNote = async () => {
    if (!selected) return
    setSavingNote(true)
    try {
      const updated = await api.inquiries.update(selected.id, { note })
      setInquiries((prev) => prev.map((item) => (item.id === selected.id ? updated : item)))
      setSelected(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存备注失败')
    } finally {
      setSavingNote(false)
    }
  }

  const remove = async (inquiry: Inquiry) => {
    if (!window.confirm(`确定删除来自“${inquiry.fullName}”的询盘吗？`)) return
    try {
      await api.inquiries.remove(inquiry.id)
      setInquiries((prev) => prev.filter((item) => item.id !== inquiry.id))
      if (selected?.id === inquiry.id) setSelected(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">询盘管理</h1>
          <p className="text-gray-600">管理来自报价表单的询盘</p>
        </div>
        <button onClick={() => void load()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm">刷新</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <div className="bg-white border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、公司、邮箱、电话..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="contacted">已联系</option>
            <option value="quoted">已报价</option>
            <option value="closed">已关闭</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-500">加载中...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {inquiries.length === 0 ? '暂无询盘。来自报价表单的询盘将显示在这里。' : '没有符合筛选条件的询盘。'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm">姓名</th>
                <th className="text-left p-3 text-sm">公司</th>
                <th className="text-left p-3 text-sm">邮箱</th>
                <th className="text-left p-3 text-sm">电话</th>
                <th className="text-left p-3 text-sm">产品类型</th>
                <th className="text-left p-3 text-sm">日期</th>
                <th className="text-left p-3 text-sm">状态</th>
                <th className="text-left p-3 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b last:border-0">
                  <td className="p-3 text-sm">{inquiry.fullName}</td>
                  <td className="p-3 text-sm">{inquiry.companyName || '-'}</td>
                  <td className="p-3 text-sm">{inquiry.businessEmail}</td>
                  <td className="p-3 text-sm">{inquiry.phone || '-'}</td>
                  <td className="p-3 text-sm">{inquiry.productType || '-'}</td>
                  <td className="p-3 text-sm">{new Date(inquiry.createdAt).toLocaleDateString('zh-CN')}</td>
                  <td className="p-3 text-sm">
                    <select
                      value={inquiry.status}
                      onChange={(e) => void updateStatus(inquiry, e.target.value)}
                      className={`px-2 py-1 text-xs border-0 ${statusStyles[inquiry.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-sm space-x-2 whitespace-nowrap">
                    <button onClick={() => openDetail(inquiry)} className="text-brand-orange hover:underline">查看详情</button>
                    <button onClick={() => void remove(inquiry)} className="text-red-600 hover:underline">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="text-lg font-semibold">{selected.fullName}</h3>
                <p className="text-sm text-gray-500">{new Date(selected.createdAt).toLocaleString('zh-CN')}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">公司：</span>{selected.companyName || '-'}</div>
                <div><span className="text-gray-500">邮箱：</span>{selected.businessEmail}</div>
                <div><span className="text-gray-500">电话：</span>{selected.phone || '-'}</div>
                <div><span className="text-gray-500">国家/地区：</span>{selected.country || '-'}</div>
                <div><span className="text-gray-500">产品类型：</span>{selected.productType || '-'}</div>
                <div><span className="text-gray-500">数量：</span>{selected.quantity || '-'}</div>
                <div><span className="text-gray-500">尺寸：</span>{selected.packagingSize || '-'}</div>
                <div><span className="text-gray-500">材质：</span>{selected.material || '-'}</div>
                <div className="sm:col-span-2"><span className="text-gray-500">印刷要求：</span>{selected.printingRequirements || '-'}</div>
                <div className="sm:col-span-2"><span className="text-gray-500">其他要求：</span>{selected.additionalRequirements || '-'}</div>
              </div>

              {selected.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">附件</h4>
                  <ul className="space-y-1">
                    {selected.attachments.map((file) => (
                      <li key={file.url}>
                        <a href={file.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-brand-orange hover:underline">
                          <Paperclip size={14} /> {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">内部备注</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300" />
                <button onClick={() => void saveNote()} disabled={savingNote} className="mt-2 px-4 py-2 bg-brand-orange text-white text-sm hover:bg-[#e6741a] disabled:opacity-50">
                  {savingNote ? '保存中...' : '保存备注'}
                </button>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button onClick={() => void remove(selected)} className="px-3 py-2 bg-red-50 text-red-600 text-sm hover:bg-red-100 flex items-center gap-1">
                  <Trash2 size={14} /> 删除询盘
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
