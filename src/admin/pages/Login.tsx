import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Development only - password should be configured via env
    if (password === 'admin123') {
      localStorage.setItem('jth_admin_auth', '1')
      navigate('/admin')
    } else {
      setError('密码错误')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-orange flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl font-serif">JH</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">管理员登录</h1>
          <p className="text-gray-400">深圳金泰宏 CMS</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#111111] p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-brand-orange"
              placeholder="请输入管理员密码"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-brand-orange hover:bg-[#e6741a] text-white py-2.5 flex items-center justify-center gap-2">
            <Lock size={18} /> 登录
          </button>
          <p className="text-xs text-gray-500 text-center">开发密码：admin123</p>
        </form>
      </div>
    </div>
  )
}
