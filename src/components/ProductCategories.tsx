import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCms } from '../context/CmsContext'

export default function ProductCategories() {
  const { homepage, categories } = useCms()
  return (
    <section className="bg-[#f5f3ef] py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4">
            <div className="text-brand-orange text-xs font-semibold tracking-[0.18em] mb-2">PRODUCT CATEGORIES</div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold mb-3 leading-tight">Our Product Range</h2>
            <p className="text-gray-700 mb-6 leading-relaxed max-w-sm">
              From paper boxes to shopping bags, we offer a wide range of custom packaging solutions to meet your unique needs.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-[#e05f0c] text-white px-6 py-3 rounded-lg transition-colors">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products/${category.slug}`}
                  className="group relative overflow-hidden bg-white border border-gray-200"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={homepage.productCategoryImages[category.slug] || category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold">{category.name}</h3>
                    <ArrowRight size={16} className="text-brand-orange group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
