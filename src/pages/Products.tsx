import { Link } from 'react-router-dom'
import { productCategories } from '../data/products'
import { ArrowRight, Boxes, Printer, ShieldCheck } from 'lucide-react'

const advantages = [
  {
    icon: Boxes,
    title: 'Custom Structural Design',
    desc: 'Packaging engineered around your product, dimensions, and brand.',
  },
  {
    icon: Printer,
    title: 'Premium Printing Quality',
    desc: 'Consistent color and finish across every production run.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Manufacturing',
    desc: 'Dependable lead times supported by strict quality checks.',
  },
]

export default function Products() {
  const heroImage = productCategories[0]?.image

  return (
    <div className="bg-warm-cream min-h-screen">
      <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(245,130,32,0.12),transparent_46%)]"
          aria-hidden="true"
        />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-brand-orange mb-4">
                <span className="h-px w-8 bg-brand-orange" />
                CUSTOM PACKAGING SOLUTIONS
              </div>

              <h1 className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.02em] mb-5 max-w-[12ch]">
                Our Products
              </h1>

              <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-[52ch] mb-8">
                Custom paper packaging solutions for global brands. From structural design
                to premium printing, we produce packaging that protects your product and
                represents your brand.
              </p>

              <ul className="space-y-4 mb-9">
                {advantages.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange ring-1 ring-brand-orange/25">
                        <Icon size={18} />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <p className="text-[13px] leading-snug text-white/55">{item.desc}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/request-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#e05f0c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Request a Quote <ArrowRight size={18} />
                </Link>
                <a
                  href="#product-categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-7 py-3.5 text-sm font-semibold text-white hover:border-brand-orange hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Explore Products
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10">
                <img
                  src={heroImage}
                  alt="Custom paper packaging by Jintaihong"
                  className="w-full h-[240px] sm:h-[340px] lg:h-[480px] object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        id="product-categories"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 scroll-mt-24"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products/${category.slug}`}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
                  {category.name}
                  <ArrowRight size={20} className="text-brand-orange group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
