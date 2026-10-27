import { Link } from 'react-router-dom'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { useState, useRef } from 'react'
import { company } from '../data/company'
import { productCategories } from '../data/products'
import FlagIcon, { type FlagCountry } from './FlagIcon'

type Language = {
  code: string
  label: string
  country: FlagCountry
}

const languages: Language[] = [
  { code: 'EN', label: 'English', country: 'us' },
  { code: 'ZH', label: '简体中文', country: 'cn' },
  { code: 'ES', label: 'Español', country: 'es' },
  { code: 'FR', label: 'Français', country: 'fr' },
  { code: 'DE', label: 'Deutsch', country: 'de' },
  { code: 'AR', label: 'العربية', country: 'sa' },
  { code: 'JA', label: '日本語', country: 'jp' },
  { code: 'KO', label: '한국어', country: 'kr' },
  { code: 'PT', label: 'Português', country: 'pt' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('EN')
  const productsTimeoutRef = useRef<number | null>(null)
  const langTimeoutRef = useRef<number | null>(null)

  const openProducts = () => {
    if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
    setProductsOpen(true)
  }
  const closeProducts = () => {
    productsTimeoutRef.current = window.setTimeout(() => setProductsOpen(false), 150)
  }
  const openLang = () => {
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current)
    setLangOpen(true)
  }
  const closeLang = () => {
    langTimeoutRef.current = window.setTimeout(() => setLangOpen(false), 150)
  }

  return (
    <header className="bg-[#0a0a0a] text-white sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[78px] lg:h-[86px]">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/JTHLOGO-nav.png"
              alt={company.nameEn}
              className="h-10 lg:h-12 w-auto object-contain"
            />
            <div className="hidden md:block">
              <div className="text-[12px] tracking-wide uppercase font-semibold leading-tight">{company.shortName || 'Jintaihong'}</div>
              <div className="text-[10px] text-gray-400 leading-tight">{company.nameCn}</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-[14px] tracking-wide">
            <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <div className="relative"
                 onMouseEnter={openProducts}
                 onMouseLeave={closeProducts}>
              <button className="flex items-center gap-1 hover:text-brand-orange transition-colors py-2">
                Products <ChevronDown size={16} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 pt-2 w-64"
                     onMouseEnter={openProducts}
                     onMouseLeave={closeProducts}>
                  <div className="bg-[#111111] border border-white/10 shadow-xl">
                    {productCategories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/products/${cat.slug}`}
                        className="block px-4 py-2.5 hover:bg-white/5 hover:text-brand-orange transition-colors border-b border-white/5 last:border-0"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link to="/products" className="block px-4 py-2.5 text-brand-orange hover:bg-white/5 transition-colors">
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/capabilities" className="hover:text-brand-orange transition-colors">Capabilities</Link>
            <Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link>
            <Link to="/case-studies" className="hover:text-brand-orange transition-colors">Case Studies</Link>
            <Link to="/contact" className="hover:text-brand-orange transition-colors">Contact</Link>
            <button className="p-2 hover:text-brand-orange transition-colors">
              <Search size={20} />
            </button>
            <Link to="/request-quote" className="bg-brand-orange hover:bg-[#e05f0c] px-6 py-2.5 rounded-lg transition-colors font-medium uppercase text-[12px] tracking-wider">
              Request a Quote
            </Link>
            <div className="relative"
                 onMouseEnter={openLang}
                 onMouseLeave={closeLang}>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-brand-orange rounded-full hover:bg-white/5 transition-colors">
                <FlagIcon country={languages.find(l => l.code === currentLang)?.country ?? 'us'} />
                <span className="text-[12px] font-medium">{currentLang}</span>
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 pt-2 w-48"
                     onMouseEnter={openLang}
                     onMouseLeave={closeLang}>
                  <div className="bg-[#111111] border border-white/10 shadow-xl rounded-md overflow-hidden">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setCurrentLang(lang.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors ${currentLang === lang.code ? 'text-brand-orange' : ''}`}
                      >
                        <FlagIcon country={lang.country} />
                        <span className="text-[12px] font-medium">{lang.code}</span>
                        <span className="text-[12px] text-gray-400">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-3">
              <Link to="/" className="hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/capabilities" className="hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Capabilities</Link>
              <Link to="/about" className="hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link to="/case-studies" className="hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Case Studies</Link>
              <Link to="/contact" className="hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link to="/request-quote" className="bg-brand-orange text-center py-2.5 mt-2" onClick={() => setMobileMenuOpen(false)}>
                Request a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
