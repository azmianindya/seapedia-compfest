import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/axios'
import { setToken, setUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'buyer',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/register', form)
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-8">
        <div className="text-2xl font-bold text-center text-gray-800 mb-1">Daftar</div>
        <div className="text-gray-500 text-center text-sm mb-6">Buat akun SEAPEDIA kamu</div>

        {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Nama</div>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Nama lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Email</div>
            <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">No. HP</div>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Daftar sebagai</div>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Password</div>
            <input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Konfirmasi Password</div>
            <input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="••••••••" value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} />
          </div>
          <div onClick={handleSubmit} className={`w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {loading ? 'Memproses...' : 'Daftar'}
          </div>
        </div>

        <div className="text-sm text-center text-gray-500 mt-4">
          Sudah punya akun? <Link to="/login" className="text-orange-500 hover:underline">Masuk</Link>
        </div>
      </div>
    </PublicLayout>
  )
}

export default RegisterPage