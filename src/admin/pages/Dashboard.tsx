import { Image, Package, FolderTree, MessageSquare, Users, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCms } from '../../context/CmsContext'

export default function AdminDashboard() {
  const { media } = useCms()
  const [stats, setStats] = useState({
    online: 1,
    historyOnline: 156,
    monthOnline: 2847,
    pageViews: 12456,
  })
  const [ipSources] = useState([
    { ip: '192.168.1.100', location: '北京', count: 45 },
    { ip: '10.0.0.50', location: '上海', count: 38 },
    { ip: '172.16.0.10', location: '广州', count: 32 },
    { ip: '203.119.45.67', location: '深圳', count: 28 },
  ])

  useEffect(() => {
    setStats({
      online: Math.floor(Math.random() * 5) + 1,
      historyOnline: 156 + Math.floor(Math.random() * 20),
      monthOnline: 2847 + Math.floor(Math.random() * 100),
      pageViews: 12456 + Math.floor(Math.random() * 500),
    })
  }, [])

  const statItems = [
    { label: '产品', value: 7, icon: Package, color: 'bg-blue-500' },
    { label: '分类', value: 7, icon: FolderTree, color: 'bg-green-500' },
    { label: '媒体素材', value: media.length, icon: Image, color: 'bg-purple-500' },
    { label: '询盘', value: 0, icon: MessageSquare, color: 'bg-orange-500' },
  ]

  const visitStats = [
    { label: '在线用户', value: stats.online, icon: Users, color: 'bg-emerald-500' },
    { label: '历史在线', value: stats.historyOnline, icon: Users, color: 'bg-cyan-500' },
    { label: '本月在线', value: stats.monthOnline, icon: Users, color: 'bg-indigo-500' },
    { label: '页面访问统计', value: stats.pageViews, icon: Eye, color: 'bg-pink-500' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">仪表盘</h1>
        <p className="text-gray-600">欢迎使用金泰宏 CMS</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statItems.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">用户访问统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visitStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">IP来源统计</h2>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-2 text-sm">IP地址</th>
                <th className="text-left p-2 text-sm">地区</th>
                <th className="text-right p-2 text-sm">访问次数</th>
              </tr>
            </thead>
            <tbody>
              {ipSources.map((ip, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-2 text-sm font-mono">{ip.ip}</td>
                  <td className="p-2 text-sm">{ip.location}</td>
                  <td className="p-2 text-sm text-right">{ip.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/media" className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a]">上传图片</Link>
          <Link to="/admin/homepage" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">编辑首页</Link>
          <Link to="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">管理产品</Link>
          <Link to="/admin/inquiries" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">查看询盘</Link>
        </div>
      </div>
    </div>
  )
}
