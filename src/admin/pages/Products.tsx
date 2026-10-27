export default function AdminProducts() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">产品管理</h1>
          <p className="text-gray-600">管理产品及其图片</p>
        </div>
        <button className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a]">添加产品</button>
      </div>
      <div className="bg-white border border-gray-200 p-6 text-center text-gray-500">
        产品管理界面（待扩展）
      </div>
    </div>
  )
}
