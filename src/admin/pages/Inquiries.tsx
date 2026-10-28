import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

export default function AdminInquiries() {
  const [inquiries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const filteredInquiries = inquiries.filter((inq: any) => {
    const matchesSearch = searchTerm === '' || 
      inq.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter
    const matchesDate = dateFilter === '' || inq.createdAt?.startsWith(dateFilter)
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">询盘管理</h1>
        <p className="text-gray-600">管理报价请求</p>
      </div>

      <div className="bg-white border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、公司、邮箱..."
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

      <div className="bg-white border border-gray-200">
        {filteredInquiries.length === 0 ? (
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
              {filteredInquiries.map((inq: any, idx: number) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-3 text-sm">{inq.fullName}</td>
                  <td className="p-3 text-sm">{inq.companyName}</td>
                  <td className="p-3 text-sm">{inq.businessEmail}</td>
                  <td className="p-3 text-sm">{inq.phone}</td>
                  <td className="p-3 text-sm">{inq.productType}</td>
                  <td className="p-3 text-sm">{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('zh-CN') : '-'}</td>
                  <td className="p-3 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs">{inq.status || 'pending'}</span>
                  </td>
                  <td className="p-3 text-sm">
                    <button className="text-brand-orange hover:underline">查看详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
