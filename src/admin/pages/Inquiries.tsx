import { useState } from 'react'

export default function AdminInquiries() {
  const [inquiries] = useState<any[]>([])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Inquiries</h1>
        <p className="text-gray-600">Manage quote requests</p>
      </div>
      <div className="bg-white border border-gray-200">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No inquiries yet. Inquiries from the quote form will appear here.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm">Name</th>
                <th className="text-left p-3 text-sm">Company</th>
                <th className="text-left p-3 text-sm">Email</th>
                <th className="text-left p-3 text-sm">Date</th>
                <th className="text-left p-3 text-sm">Status</th>
                <th className="text-left p-3 text-sm">Action</th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </div>
  )
}
