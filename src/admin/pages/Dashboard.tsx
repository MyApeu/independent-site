import { useCallback, useEffect, useState } from 'react'
import { Image, Package, FolderTree, MessageSquare, Users, Eye, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCms } from '../../context/CmsContext'
import { api, type Stats } from '../../lib/api'
import { Button, Card, EmptyState, PageHeader, tableClass, tdClass, thClass, theadClass } from '../components/ui'

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
    { label: '在线用户', value: stats?.online ?? '-', icon: Users, color: 'bg-emerald-500', hint: '最近 5 分钟' },
    { label: '历史在线', value: stats?.historyOnline ?? '-', icon: Users, color: 'bg-cyan-500', hint: '累计独立访客' },
    { label: '本月在线', value: stats?.monthOnline ?? '-', icon: Users, color: 'bg-indigo-500', hint: '本月独立访客' },
    { label: '页面访问统计', value: stats?.pageViews ?? '-', icon: Eye, color: 'bg-pink-500', hint: `今日 ${stats?.todayPageViews ?? '-'}` },
  ]

  const dailyMax = stats ? Math.max(1, ...stats.daily.map((item) => item.count)) : 1

  return (
    <div className="p-6">
      <PageHeader
        title="仪表盘"
        description="欢迎使用金泰宏 CMS，实时掌握网站数据"
        actions={
          <Button variant="secondary" onClick={() => void load()}>
            <RefreshCw size={16} />
            刷新
          </Button>
        }
      />

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">用户访问统计</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visitStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-400">{stat.hint}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="text-white" size={20} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">IP 来源统计</h2>
          </div>
          {stats && stats.ipSources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className={theadClass}>
                  <tr>
                    <th className={thClass}>IP 地址</th>
                    <th className={`${thClass} text-right`}>访问次数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.ipSources.map((source) => (
                    <tr key={source.ip}>
                      <td className={`${tdClass} font-mono break-all`}>{source.ip}</td>
                      <td className={`${tdClass} text-right`}>{source.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState>暂无访问数据。访问前台页面后即可看到统计。</EmptyState>
          )}
        </Card>

        <Card>
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">近 14 天访问量</h2>
          </div>
          <div className="p-5">
            {stats ? (
              <div className="flex h-40 items-end gap-1">
                {stats.daily.map((item) => (
                  <div key={item.date} className="flex flex-1 flex-col items-center gap-1" title={`${item.date}: ${item.count}`}>
                    <div
                      className="w-full rounded-t bg-brand-orange/80 transition-colors hover:bg-brand-orange"
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
        </Card>
      </div>

      <Card>
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">快捷操作</h2>
        </div>
        <div className="flex flex-wrap gap-3 p-5">
          <Link to="/admin/media" className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#e6741a]">
            上传图片
          </Link>
          <Link to="/admin/homepage" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            编辑首页
          </Link>
          <Link to="/admin/products" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            管理产品
          </Link>
          <Link to="/admin/inquiries" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            查看询盘
          </Link>
        </div>
      </Card>
    </div>
  )
}
