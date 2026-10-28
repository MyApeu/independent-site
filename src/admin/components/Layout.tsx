import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {
  LayoutDashboard,
  Image,
  Home,
  Package,
  FolderTree,
  MessageSquare,
  LogOut,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { clearToken } from '../../lib/api'

const menuItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin', end: true },
  { icon: Image, label: '媒体库', path: '/admin/media' },
  { icon: Home, label: '首页管理', path: '/admin/homepage' },
  { icon: Package, label: '产品管理', path: '/admin/products' },
  { icon: FolderTree, label: '分类管理', path: '/admin/categories' },
  { icon: MessageSquare, label: '询盘管理', path: '/admin/inquiries' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => navigate('/admin/login')
    window.addEventListener('jth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('jth:unauthorized', handleUnauthorized)
  }, [navigate])

  const logout = () => {
    clearToken()
    navigate('/admin/login')
  }

  const clearCache = async () => {
    if (!window.confirm('确定要清除缓存吗？页面将自动重新加载。')) return
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((key) => caches.delete(key)))
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))
      }
      sessionStorage.clear()
    } catch {
      // ignore cache API errors
    }
    const url = new URL(window.location.href)
    url.searchParams.set('_t', Date.now().toString())
    window.location.replace(url.toString())
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="flex shrink-0 flex-col bg-[#0a0a0a] text-white lg:min-h-screen lg:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 lg:py-6">
          <div className="flex h-10 w-10 items-center justify-center bg-brand-orange">
            <span className="font-serif font-bold text-white">JH</span>
          </div>
          <div>
            <div className="text-sm font-semibold">金泰宏 CMS</div>
            <div className="text-xs text-gray-400">管理后台</div>
          </div>
        </div>

        <nav className="flex flex-1 gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-orange/15 text-brand-orange'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="flex gap-1 overflow-x-auto border-t border-white/10 p-3 lg:flex-col">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={18} />
            <span className="whitespace-nowrap">查看网站</span>
          </a>
          <button
            onClick={clearCache}
            className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RefreshCw size={18} />
            <span className="whitespace-nowrap">清除缓存</span>
          </button>
          <button
            onClick={logout}
            className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-300"
          >
            <LogOut size={18} />
            <span className="whitespace-nowrap">退出登录</span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
