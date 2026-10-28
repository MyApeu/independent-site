import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2, Paperclip, RefreshCw, Mail, Phone, Building2, Globe } from 'lucide-react'
import { api, type Inquiry } from '../../lib/api'
import {
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  inputClass,
  tableClass,
  tdClass,
  thClass,
  theadClass,
} from '../components/ui'

const statusLabels: Record<string, string> = {
  pending: '待处理',
  contacted: '已联系',
  quoted: '已报价',
  closed: '已关闭',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  quoted: 'bg-purple-50 text-purple-700 border-purple-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
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
      <PageHeader
        title="询盘管理"
        description="查看和处理来自报价表单的客户询盘"
        actions={
          <Button variant="secondary" onClick={() => void load()}>
            <RefreshCw size={16} />
            刷新
          </Button>
        }
      />

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、公司、邮箱、电话..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} md:w-40`}>
            <option value="all">全部状态</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={`${inputClass} md:w-44`} />
          <div className="flex items-center text-sm text-gray-500 md:px-2">
            共 <span className="mx-1 font-semibold text-gray-900">{filteredInquiries.length}</span> 条
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <EmptyState>加载中...</EmptyState>
        ) : filteredInquiries.length === 0 ? (
          <EmptyState>{inquiries.length === 0 ? '暂无询盘。来自报价表单的询盘将显示在这里。' : '没有符合筛选条件的询盘。'}</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>客户</th>
                  <th className={thClass}>联系方式</th>
                  <th className={thClass}>产品类型</th>
                  <th className={thClass}>日期</th>
                  <th className={thClass}>状态</th>
                  <th className={`${thClass} text-right`}>操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50/60">
                    <td className={tdClass}>
                      <div className="font-medium text-gray-900">{inquiry.fullName}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Building2 size={12} />
                        {inquiry.companyName || '未填写公司'}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Mail size={12} className="text-gray-400" />
                        {inquiry.businessEmail}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone size={12} />
                        {inquiry.phone || '未填写电话'}
                      </div>
                    </td>
                    <td className={tdClass}>{inquiry.productType || '-'}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>{new Date(inquiry.createdAt).toLocaleDateString('zh-CN')}</td>
                    <td className={tdClass}>
                      <select
                        value={inquiry.status}
                        onChange={(e) => void updateStatus(inquiry, e.target.value)}
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[inquiry.status] || 'border-gray-200 bg-gray-100 text-gray-600'}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => openDetail(inquiry)}>查看详情</Button>
                        <Button variant="danger" size="sm" onClick={() => void remove(inquiry)} aria-label="删除询盘">
                          <Trash2 size={12} />
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

      {selected && (
        <Modal
          title={selected.fullName}
          subtitle={new Date(selected.createdAt).toLocaleString('zh-CN')}
          onClose={() => setSelected(null)}
          footer={
            <>
              <Button variant="danger" onClick={() => void remove(selected)}>
                <Trash2 size={14} /> 删除询盘
              </Button>
              <Button onClick={() => void saveNote()} disabled={savingNote}>
                {savingNote ? '保存中...' : '保存备注'}
              </Button>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} className="text-gray-400" /> {selected.businessEmail}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-gray-400" /> {selected.phone || '未填写'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} className="text-gray-400" /> {selected.companyName || '未填写公司'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe size={14} className="text-gray-400" /> {selected.country || '未填写国家'}
            </div>

            <div className="sm:col-span-2 grid gap-3 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-2">
              <div><span className="text-gray-500">产品类型：</span>{selected.productType || '-'}</div>
              <div><span className="text-gray-500">数量：</span>{selected.quantity || '-'}</div>
              <div><span className="text-gray-500">尺寸：</span>{selected.packagingSize || '-'}</div>
              <div><span className="text-gray-500">材质：</span>{selected.material || '-'}</div>
              <div className="sm:col-span-2"><span className="text-gray-500">印刷要求：</span>{selected.printingRequirements || '-'}</div>
              <div className="sm:col-span-2"><span className="text-gray-500">其他要求：</span>{selected.additionalRequirements || '-'}</div>
            </div>

            {selected.attachments.length > 0 && (
              <div className="sm:col-span-2">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">附件</h4>
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

            <Field label="内部备注" className="sm:col-span-2">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={inputClass} placeholder="记录跟进情况..." />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  )
}
