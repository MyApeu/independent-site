import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCms } from '../context/CmsContext'
import { api, type Product } from '../lib/api'

export default function ProductDetail() {
  const { slug } = useParams()
  const { categories } = useCms()
  const category = categories.find((item) => item.slug === slug)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let alive = true
    setLoading(true)
    api.products
      .list({ category: slug })
      .then((list) => {
        if (alive) setProducts(list)
      })
      .catch(() => {
        if (alive) setProducts([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [slug])

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="text-brand-orange hover:underline">Back to Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-[#0a0a0a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4">
            <ArrowLeft size={18} /> Back to Products
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-300">{category.description}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <img src={category.image} alt={category.name} className="w-full h-96 object-cover" />
          <div>
            <h2 className="text-2xl font-bold mb-4 font-serif">Custom Solutions</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We provide fully customized {category.name.toLowerCase()} solutions tailored to your specific requirements. 
              Our experienced team works closely with you from design to delivery.
            </p>
            <Link to="/request-quote" className="inline-block bg-brand-orange hover:bg-[#e6741a] text-white px-6 py-3 transition-colors">
              Request a Quote
            </Link>
          </div>
        </div>

        {!loading && products.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold mb-6">Available Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 overflow-hidden group">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={product.image || category.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    {product.summary && <p className="text-sm text-gray-600 mb-3">{product.summary}</p>}
                    {product.specs.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {product.specs.slice(0, 4).map((spec) => (
                          <li key={spec} className="text-[11px] px-2 py-1 bg-[#f5f3ef] text-gray-700">
                            {spec}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      to="/request-quote"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange"
                    >
                      Get a quote <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
