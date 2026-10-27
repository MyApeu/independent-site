import { useState } from 'react'

export default function RequestQuote() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    businessEmail: '',
    country: '',
    productType: '',
    quantity: '',
    packagingSize: '',
    material: '',
    printingRequirements: '',
    additionalRequirements: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <div className="bg-[#0a0a0a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Request a Quote</h1>
          <p className="text-gray-300">Tell us about your packaging requirements</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name *</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Email *</label>
              <input
                type="email"
                name="businessEmail"
                required
                value={formData.businessEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country / Region *</label>
              <input
                type="text"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Product Type *</label>
            <select
              name="productType"
              required
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
            >
              <option value="">Select product type</option>
              <option value="paper-boxes">Paper Boxes</option>
              <option value="gift-boxes">Gift Boxes</option>
              <option value="paper-bags">Paper Bags</option>
              <option value="folding-cartons">Folding Cartons</option>
              <option value="food-packaging">Food Packaging</option>
              <option value="labels-sleeves">Labels & Sleeves</option>
              <option value="other">Other Custom Packaging</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Quantity *</label>
              <input
                type="text"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
                placeholder="e.g., 1000 pcs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Packaging Size</label>
              <input
                type="text"
                name="packagingSize"
                value={formData.packagingSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
                placeholder="L x W x H (mm)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              placeholder="e.g., Kraft, Art Paper, Corrugated"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Printing Requirements</label>
            <input
              type="text"
              name="printingRequirements"
              value={formData.printingRequirements}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              placeholder="e.g., 4-color CMYK, Pantone, Hot Stamping"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Additional Requirements</label>
            <textarea
              name="additionalRequirements"
              rows={4}
              value={formData.additionalRequirements}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-brand-orange"
              placeholder="Any other details about your project..."
            />
          </div>

          <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 p-4">
            <strong>Note:</strong> This form is for demonstration only. No data is sent to a backend server. To receive real inquiries, you need to configure a backend API or email service.
          </div>

          {status === 'success' && (
            <div className="text-green-700 bg-green-50 border border-green-200 p-4">
              Thank you for your inquiry! We will contact you soon. (Demo only - not actually sent)
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand-orange hover:bg-[#e6741a] text-white px-8 py-3 font-medium transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}
