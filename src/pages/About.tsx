export default function About() {
  return (
    <div>
      <div className="bg-[#0a0a0a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-gray-300">Professional paper packaging manufacturer</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 font-serif">Shenzhen Jintaihong Packaging Products Co., Ltd.</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We are a professional paper packaging manufacturer dedicated to providing high-quality custom packaging and printing services to global brands and importers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With a commitment to quality, innovation, and customer service, we deliver comprehensive packaging solutions from concept to completion.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80" alt="Factory" className="w-full h-96 object-cover" />
        </div>
      </div>
    </div>
  )
}
