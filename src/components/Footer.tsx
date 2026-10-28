import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { company } from '../data/company'
import { productCategories } from '../data/products'
import { useCms } from '../context/CmsContext'

export default function Footer() {
  const { footer } = useCms()
  const footerData = footer || {
    companyNameEn: company.nameEn,
    companyNameCn: company.nameCn,
    description: 'Professional custom paper packaging and printing manufacturer serving global brands and importers.',
    address: company.address,
    email: company.email,
    phone: company.phone,
  }

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-3">
              <img src="/images/JTHLOGO-nav.png" alt={footerData.companyNameEn} className="h-10 w-auto object-contain" />
              <div>
                <div className="text-sm font-semibold leading-tight">{footerData.companyNameEn}</div>
                <div className="text-xs text-gray-400 leading-tight">{footerData.companyNameCn}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {footerData.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-brand-orange" />
                <span>{footerData.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} className="flex-shrink-0 text-brand-orange" />
                <span>{footerData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={16} className="flex-shrink-0 text-brand-orange" />
                <span>{footerData.phone}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-brand-orange transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="text-gray-400 hover:text-brand-orange transition-colors">Case Studies</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-brand-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">Products</h3>
            <ul className="space-y-2 text-sm">
              {productCategories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/products/${cat.slug}`} className="text-gray-400 hover:text-brand-orange transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/products" className="text-gray-400 hover:text-brand-orange transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-3">Subscribe to get updates on new products and industry news.</p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2 bg-[#151515] border border-white/10 text-white text-sm focus:outline-none focus:border-brand-orange"
              />
              <button className="bg-brand-orange hover:bg-[#e05f0c] px-4 py-2 text-sm transition-colors">
                Subscribe
              </button>
            </form>
            <div>
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-gray-300">Follow Us</h4>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 bg-[#151515] border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors text-[10px]">IN</a>
                <a href="#" className="w-8 h-8 bg-[#151515] border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors text-[10px]">FB</a>
                <a href="#" className="w-8 h-8 bg-[#151515] border border-white/10 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors text-[10px]">IG</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {footerData.companyNameEn}. All rights reserved.</p>
          <p className="mt-1">{footerData.phone} | {footerData.email} | {footerData.address}</p>
        </div>
      </div>
    </footer>
  )
}
