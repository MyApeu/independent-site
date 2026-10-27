import { Link } from 'react-router-dom'
import { ArrowRight, Users, Cog, ShieldCheck, Globe } from 'lucide-react'
import { useCms } from '../context/CmsContext'

const advantages = [
  {
    icon: Users,
    title: "Professional Team",
    description: "Experienced and skilled"
  },
  {
    icon: Cog,
    title: "Advanced Equipment",
    description: "Modern production lines"
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Strict quality control"
  },
  {
    icon: Globe,
    title: "Global Service",
    description: "For worldwide clients"
  }
]

export default function AboutSection() {
  const { homepage } = useCms()
  return (
    <section className="bg-[#0a0a0a] text-white py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-4">
            <div className="text-brand-orange text-xs font-semibold tracking-[0.18em] mb-2">ABOUT US</div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold mb-3 leading-tight">
              Shenzhen Jintaihong Packaging Products Co., Ltd.
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We are a professional paper packaging manufacturer dedicated to providing high-quality custom packaging and printing services to global brands and importers.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-[#e05f0c] px-6 py-3 rounded-lg transition-colors">
              Learn More <ArrowRight size={18} />
            </Link>
          </div>
          <div className="lg:col-span-4">
            <img
              src={homepage.aboutImage}
              alt="Factory building and production facility"
              className="w-full h-[300px] lg:h-[360px] object-cover"
            />
          </div>
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {advantages.map((adv, index) => {
                const Icon = adv.icon
                return (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-transparent border border-brand-orange/60 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-brand-orange" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] mb-0.5">{adv.title}</h3>
                      <p className="text-sm text-gray-400">{adv.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
