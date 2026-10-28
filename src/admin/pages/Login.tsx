import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { api, setToken } from '../../lib/api'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await api.auth.login(password)
      setToken(token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
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
          <button type="submit" disabled={loading} className="w-full bg-brand-orange hover:bg-[#e6741a] text-white py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
            <Lock size={18} /> {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
