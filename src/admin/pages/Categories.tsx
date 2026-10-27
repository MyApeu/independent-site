export default function AdminCategories() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button className="px-4 py-2 bg-brand-orange text-white hover:bg-[#e6741a]">Add Category</button>
      </div>
      <div className="bg-white border border-gray-200 p-6 text-center text-gray-500">
        Category management interface (ready for extension)
      </div>
    </div>
  )
}
