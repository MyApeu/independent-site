import { Link } from 'react-router-dom'
import { ArrowRight, Printer, Boxes, Factory } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useCms } from '../context/CmsContext'
import { heroConfig } from '../data/hero'

export default function Hero() {
  const { homepage } = useCms()

  const backgroundImage = homepage.heroBackgroundImage || heroConfig.backgroundImage
  const backgroundPosition = homepage.heroBackgroundPosition || heroConfig.backgroundPosition
  const mobileImage = homepage.mobileBackgroundImage || heroConfig.mobileBackgroundImage || backgroundImage

  const heroStyle = {
    '--hero-bg-desktop': `url('${backgroundImage}')`,
    '--hero-bg-mobile': `url('${mobileImage}')`,
    '--hero-bg-position': backgroundPosition,
  } as CSSProperties

  return (
    <section className="hero" style={heroStyle}>
      <div className="hero__background" aria-hidden="true" />
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="hero__eyebrow">
            <span className="inline-block w-8 h-px bg-brand-orange align-middle mr-3" />
            Paper Packaging &amp; Printing Manufacturer
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[62px] xl:text-[68px] font-bold leading-[1.06] tracking-tight text-white mb-6">
            {homepage.heroTitle || 'Custom Paper Packaging'}<br />
            for <span className="text-brand-orange">Global Brands</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-xl mb-8">
            {homepage.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              to="/products"
              className="bg-brand-orange hover:bg-[#e05f0c] text-white px-7 py-3.5 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Explore Our Products <ArrowRight size={18} />
            </Link>
            <Link
              to="/request-quote"
              className="border border-white/60 hover:border-brand-orange hover:text-brand-orange text-white px-7 py-3.5 rounded-lg text-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Request a Quote
            </Link>
          </div>

          <ul className="hero__highlights">
            <li><Printer size={18} className="text-brand-orange" /> Custom Printing</li>
            <li><Boxes size={18} className="text-brand-orange" /> Structural Design</li>
            <li><Factory size={18} className="text-brand-orange" /> Volume Production</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
