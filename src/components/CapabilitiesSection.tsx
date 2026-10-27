import { Link } from 'react-router-dom'
import { useCms } from '../context/CmsContext'

const capabilities = [
  {
    title: "Printing",
    description: "High-precision offset & digital printing",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&q=80"
  },
  {
    title: "Die-Cutting",
    description: "Accurate and efficient die-cutting",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1000&q=80"
  },
  {
    title: "Post-Processing",
    description: "Folding, gluing, and finishing",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80"
  },
  {
    title: "Quality Control",
    description: "Strict inspection standards",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80"
  }
]

export default function CapabilitiesSection() {
  const { homepage } = useCms()
  return (
    <section className="bg-[#f5f3ef] py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-9">
          <div className="text-brand-orange text-xs font-semibold tracking-[0.18em] mb-2">OUR CAPABILITIES</div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold mb-2 leading-tight">Advanced Production & Craftsmanship</h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            From printing and die-cutting to finishing and assembly, we provide comprehensive packaging solutions with consistent quality.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {capabilities.map((cap, index) => (
            <Link
              key={index}
              to="/capabilities"
              className="group bg-white overflow-hidden border border-gray-200"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={homepage.capabilityImages[cap.title] || cap.image}
                  alt={cap.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1 font-serif">{cap.title}</h3>
                <p className="text-sm text-gray-600">{cap.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
