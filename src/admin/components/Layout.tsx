import { Outlet, Link, useNavigate } from 'react-router-dom'
  import { LayoutDashboard, Image, Home, Package, FolderTree, MessageSquare, LogOut, RefreshCw } from 'lucide-react'
  import { clearToken } from '../../lib/api'

export default function AdminLayout() {
  const navigate = useNavigate()

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

  const menuItems = [
    { icon: LayoutDashboard, label: '仪表盘', path: '/admin' },
    { icon: Image, label: '媒体库', path: '/admin/media' },
    { icon: Home, label: '首页管理', path: '/admin/homepage' },
    { icon: Package, label: '产品管理', path: '/admin/products' },
    { icon: FolderTree, label: '分类管理', path: '/admin/categories' },
    { icon: MessageSquare, label: '询盘管理', path: '/admin/inquiries' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#0a0a0a] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange flex items-center justify-center">
              <span className="text-white font-bold font-serif">JH</span>
            </div>
            <div>
              <div className="text-sm font-semibold">金泰宏 CMS</div>
              <div className="text-xs text-gray-400">管理后台</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <Link to={item.path} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <button onClick={clearCache} className="flex items-center gap-3 px-3 py-2 w-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
            <RefreshCw size={18} />
            <span className="text-sm">清除缓存</span>
          </button>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
            <LogOut size={18} />
            <span className="text-sm">退出登录</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
