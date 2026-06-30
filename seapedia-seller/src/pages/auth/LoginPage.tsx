import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'
import { setToken, setUser } from '../../lib/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/login', form)
      const user = res.data.user
      const roles = user.roles

      if (!roles.includes('seller') && !roles.includes('driver')) {
        setError('Akun ini tidak memiliki role Seller atau Driver')
        return
      }

      setToken(res.data.token)
      setUser(user)

      if (roles.length === 1) {
        navigate('/dashboard')
      } else {
        navigate('/select-role')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-xl font-bold text-orange-500 mb-1">SEAPEDIA</div>
          <div className="text-2xl font-bold text-gray-800 mb-1">Masuk</div>
          <div className="text-gray-500 text-sm">Masuk sebagai Seller atau Driver</div>
        </div>

        {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Email</div>
            <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="email@seapedia.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Password</div>
            <input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div onClick={handleSubmit} className={`w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {loading ? 'Memproses...' : 'Masuk'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage