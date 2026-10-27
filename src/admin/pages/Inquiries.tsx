import { useState } from 'react'

export default function AdminInquiries() {
  const [inquiries] = useState<any[]>([])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">询盘管理</h1>
        <p className="text-gray-600">管理报价请求</p>
      </div>
      <div className="bg-white border border-gray-200">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            暂无询盘。来自报价表单的询盘将显示在这里。
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm">姓名</th>
                <th className="text-left p-3 text-sm">公司</th>
                <th className="text-left p-3 text-sm">邮箱</th>
                <th className="text-left p-3 text-sm">日期</th>
                <th className="text-left p-3 text-sm">状态</th>
                <th className="text-left p-3 text-sm">操作</th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </div>
  )
}
