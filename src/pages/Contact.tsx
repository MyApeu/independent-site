import { Mail, Phone, MapPin } from 'lucide-react'
import { company } from '../data/company'

export default function Contact() {
  return (
    <div>
      <div className="bg-[#0a0a0a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-gray-300">Get in touch with us</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6 font-serif">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-brand-orange mt-1" size={20} />
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-gray-600">{company.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-brand-orange mt-1" size={20} />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-600">{company.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-brand-orange mt-1" size={20} />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-gray-600">{company.phone}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-warm-cream p-6">
            <h2 className="text-2xl font-bold mb-4 font-serif">Send Message</h2>
            <p className="text-sm text-gray-600 mb-4">Form submission is for demonstration only - not connected to backend.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
