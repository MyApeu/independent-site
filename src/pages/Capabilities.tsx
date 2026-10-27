export default function Capabilities() {
  const caps = [
    { title: "Printing", desc: "High-precision offset & digital printing" },
    { title: "Die-Cutting", desc: "Accurate and efficient die-cutting" },
    { title: "Post-Processing", desc: "Folding, gluing, and finishing" },
    { title: "Quality Control", desc: "Strict inspection standards" },
  ]

  return (
    <div>
      <div className="bg-[#0a0a0a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Capabilities</h1>
          <p className="text-gray-300">Advanced production & craftsmanship</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-6">
          {caps.map((cap, i) => (
            <div key={i} className="bg-warm-cream p-6">
              <h2 className="text-xl font-semibold mb-2 font-serif">{cap.title}</h2>
              <p className="text-gray-700">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
