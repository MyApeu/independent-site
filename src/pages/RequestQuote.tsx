import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { api } from '../lib/api'
import { useCms } from '../context/CmsContext'

const emptyForm = {
  fullName: '',
  companyName: '',
  businessEmail: '',
  phone: '',
  country: '',
  productType: '',
  quantity: '',
  packagingSize: '',
  material: '',
  printingRequirements: '',
  additionalRequirements: ''
}

export default function RequestQuote() {
  const { categories } = useCms()
  const [formData, setFormData] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value))
      files.forEach((file) => payload.append('attachments', file))
      await api.inquiries.create(payload)
      setStatus('success')
      setFormData(emptyForm)
      setFiles([])
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
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
          <div className="grid sm:grid-cols-3 gap-6">
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
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
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
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>{category.name}</option>
              ))}
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

          <div>
            <label className="block text-sm font-medium mb-2">Attachments</label>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-brand-orange transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.ai,.eps"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm text-gray-600">点击上传附件或拖拽文件到此处</span>
                <span className="text-xs text-gray-500">支持图片、PDF、Word、AI、EPS格式</span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {status === 'error' && (
            <div className="text-red-700 bg-red-50 border border-red-200 p-4">
              {error}
            </div>
          )}

          {status === 'success' && (
            <div className="text-green-700 bg-green-50 border border-green-200 p-4">
              Thank you for your inquiry! We will contact you soon.
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
