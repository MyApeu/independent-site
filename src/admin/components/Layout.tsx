import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, Home, Package, FolderTree, FileText, MessageSquare, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('jth_admin_auth')
    navigate('/admin/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: '仪表盘', path: '/admin' },
    { icon: Image, label: '媒体库', path: '/admin/media' },
    { icon: Home, label: '首页管理', path: '/admin/homepage' },
    { icon: Package, label: '产品管理', path: '/admin/products' },
    { icon: FolderTree, label: '分类管理', path: '/admin/categories' },
    { icon: FileText, label: '工厂与能力', path: '/admin/factory' },
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
        <div className="p-4 border-t border-white/10">
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
