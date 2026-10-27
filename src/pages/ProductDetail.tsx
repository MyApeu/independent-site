import { useParams, Link } from 'react-router-dom'
import { productCategories } from '../data/products'
import { ArrowLeft } from 'lucide-react'

export default function ProductDetail() {
  const { slug } = useParams()
  const category = productCategories.find(c => c.slug === slug)

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
      </div>
    </div>
  )
}
