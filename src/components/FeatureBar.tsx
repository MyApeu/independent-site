import { CheckCircle, DollarSign, Truck, Leaf, Palette } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: "Custom Design",
    description: "Tailored to your brand"
  },
  {
    icon: CheckCircle,
    title: "Premium Quality",
    description: "Strict quality control"
  },
  {
    icon: DollarSign,
    title: "Competitive Price",
    description: "Factory direct, cost-effective"
  },
  {
    icon: Truck,
    title: "Global Shipping",
    description: "Safe & reliable logistics"
  },
  {
    icon: Leaf,
    title: "Sustainable Packaging",
    description: "Eco-friendly solutions"
  }
]

export default function FeatureBar() {
  return (
    <section className="bg-[#111111] text-white border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-white/10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-start gap-3 py-5 lg:py-6 px-0 sm:px-2 lg:px-4">
                <Icon className="text-brand-orange flex-shrink-0 mt-0.5" size={22} />
                <div>
                  <h3 className="font-semibold text-[14px] mb-0.5">{feature.title}</h3>
                  <p className="text-[12px] text-gray-400">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
