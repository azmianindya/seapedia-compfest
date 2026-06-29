import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/axios'
import { setToken, setUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'

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
      setToken(res.data.token)
      setUser(res.data.user)

      const roles = res.data.user.roles
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
    <PublicLayout>
      <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow p-6">
        <div className="text-2xl font-bold text-center text-gray-800 mb-1">Masuk</div>
        <div className="text-gray-500 text-center text-sm mb-6">Masuk ke akun SEAPEDIA kamu</div>

        {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Email</div>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              placeholder="email@seapedia.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Password</div>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div
            onClick={handleSubmit}
            className={`w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </div>
        </div>

        <div className="text-sm text-center text-gray-500 mt-4">
          Belum punya akun? <Link to="/register" className="text-orange-500 hover:underline">Daftar sekarang</Link>
        </div>
      </div>
    </PublicLayout>
  )
}

export default LoginPage