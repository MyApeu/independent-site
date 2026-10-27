import { Image, Package, FolderTree, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const stats = [
    { label: 'Products', value: 7, icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: 7, icon: FolderTree, color: 'bg-green-500' },
    { label: 'Media Assets', value: 0, icon: Image, color: 'bg-purple-500' },
    { label: 'Inquiries', value: 0, icon: MessageSquare, color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome to Jintaihong CMS</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
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
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/media" className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a]">Upload Images</Link>
          <Link to="/admin/homepage" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">Edit Homepage</Link>
          <Link to="/admin/products" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">Manage Products</Link>
          <Link to="/admin/inquiries" className="px-4 py-2 bg-gray-100 hover:bg-gray-200">View Inquiries</Link>
        </div>
      </div>
    </div>
  )
}
