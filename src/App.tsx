import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import CaseStudies from './pages/CaseStudies'
import Contact from './pages/Contact'
import RequestQuote from './pages/RequestQuote'
import AdminLogin from './admin/pages/Login'
import AdminLayout from './admin/components/Layout'
import AdminDashboard from './admin/pages/Dashboard'
import AdminMedia from './admin/pages/Media'
import AdminHomepage from './admin/pages/Homepage'
import AdminProducts from './admin/pages/Products'
import AdminCategories from './admin/pages/Categories'
import AdminInquiries from './admin/pages/Inquiries'
import { CmsProvider } from './context/CmsContext'
import VisitTracker from './components/VisitTracker'

function isAdmin() {
  return localStorage.getItem('jth_admin_auth') === '1'
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <VisitTracker />
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          <Route path="/products/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/case-studies" element={<PublicLayout><CaseStudies /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/request-quote" element={<PublicLayout><RequestQuote /></PublicLayout>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CmsProvider>
  )
}
