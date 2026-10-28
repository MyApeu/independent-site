import { useCallback, useEffect, useState } from 'react'
import { Image, Package, FolderTree, MessageSquare, Users, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'
import { api, type Stats } from '../../lib/api'

export default function AdminDashboard() {
  const { media, categories } = useCms()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setStats(await api.stats.get())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '统计数据加载失败')
    }
  }, [])

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(), 60000)
    return () => window.clearInterval(timer)
  }, [load])

  const statItems = [
    { label: '产品', value: stats?.counts.products ?? '-', icon: Package, color: 'bg-blue-500' },
    { label: '分类', value: categories.length, icon: FolderTree, color: 'bg-green-500' },
    { label: '媒体素材', value: stats?.counts.media ?? media.length, icon: Image, color: 'bg-purple-500' },
    { label: '询盘', value: stats?.counts.inquiries ?? '-', icon: MessageSquare, color: 'bg-orange-500' },
  ]

  const visitStats = [
    { label: '在线用户', value: stats?.online ?? '-', icon: Users, color: 'bg-emerald-500' },
    { label: '历史在线', value: stats?.historyOnline ?? '-', icon: Users, color: 'bg-cyan-500' },
    { label: '本月在线', value: stats?.monthOnline ?? '-', icon: Users, color: 'bg-indigo-500' },
    { label: '页面访问统计', value: stats?.pageViews ?? '-', icon: Eye, color: 'bg-pink-500' },
  ]

  const dailyMax = stats ? Math.max(1, ...stats.daily.map((item) => item.count)) : 1

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">仪表盘</h1>
          <p className="text-gray-600">欢迎使用金泰宏 CMS</p>
        </div>
        <button onClick={() => void load()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm">刷新</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

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
          {stats && stats.ipSources.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-2 text-sm">IP地址</th>
                  <th className="text-right p-2 text-sm">访问次数</th>
                </tr>
              </thead>
              <tbody>
                {stats.ipSources.map((source) => (
                  <tr key={source.ip} className="border-b last:border-0">
                    <td className="p-2 text-sm font-mono break-all">{source.ip}</td>
                    <td className="p-2 text-sm text-right">{source.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">暂无访问数据。访问前台页面后即可看到统计。</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">近 14 天访问量</h2>
          {stats ? (
            <div className="flex items-end gap-1 h-40">
              {stats.daily.map((item) => (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-1" title={`${item.date}: ${item.count}`}>
                  <div
                    className="w-full bg-brand-orange/80 hover:bg-brand-orange transition-colors"
                    style={{ height: `${Math.max(2, (item.count / dailyMax) * 100)}%` }}
                  />
                  <span className="text-[9px] text-gray-400">{item.date.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">加载中...</p>
          )}
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
