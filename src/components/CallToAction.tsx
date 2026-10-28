import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCms } from '../context/CmsContext'

export default function CallToAction() {
  const { homepage } = useCms()
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${homepage.ctaImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/78"></div>
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold mb-2 leading-tight">
          {homepage.ctaTitle || 'Turn Your Packaging Ideas into Reality'}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-6">
          {homepage.ctaDescription || 'Contact us today to discuss your custom packaging project.'}
        </p>
        <Link to="/request-quote" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-[#e05f0c] px-7 py-3 rounded-lg font-medium transition-colors">
          Request a Quote <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}
