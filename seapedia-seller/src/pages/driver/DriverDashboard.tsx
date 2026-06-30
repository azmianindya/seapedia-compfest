import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../lib/auth'
import api from '../../lib/axios'
import type { User } from '../../types'

function DriverDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [earnings, setEarnings] = useState({ total_earnings: 0, completed_count: 0, active_count: 0, fee_per_delivery: 0 })
  const [availableCount, setAvailableCount] = useState(0)

  useEffect(() => {
    const u = getUser()
    if (!u || u.active_role !== 'driver') { navigate('/login'); return }
    setUser(u)

    api.get('/driver/earnings').then(res => setEarnings(res.data))
    api.get('/driver/jobs/available').then(res => setAvailableCount(res.data.orders.length))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-orange-500">SEAPEDIA</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{user?.name}</div>
          <div className="text-xs bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-medium">Driver</div>
          <div onClick={handleLogout} className="text-sm text-red-500 cursor-pointer hover:underline">Logout</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-2xl font-bold text-gray-800 mb-6">Dashboard Driver</div>

        <div className="bg-orange-500 rounded-2xl p-6 text-white mb-6">
          <div className="text-sm opacity-80 mb-1">Total Penghasilan</div>
          <div className="text-3xl font-bold mb-1">Rp {Number(earnings.total_earnings).toLocaleString('id-ID')}</div>
          <div className="text-xs opacity-70">Dari {earnings.completed_count} pengiriman selesai · Rp {earnings.fee_per_delivery.toLocaleString('id-ID')}/pengiriman</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div onClick={() => navigate('/driver/available')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
            <div className="text-sm text-gray-500 mb-1">Job Tersedia</div>
            <div className="text-2xl font-bold text-orange-500">{availableCount}</div>
            <div className="text-xs text-gray-400 mt-1">Klik untuk ambil job</div>
          </div>
          <div onClick={() => navigate('/driver/jobs')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
            <div className="text-sm text-gray-500 mb-1">Job Aktif</div>
            <div className="text-2xl font-bold text-gray-800">{earnings.active_count}</div>
            <div className="text-xs text-gray-400 mt-1">Sedang dalam pengantaran</div>
          </div>
          <div onClick={() => navigate('/driver/history')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
            <div className="text-sm text-gray-500 mb-1">Job Selesai</div>
            <div className="text-2xl font-bold text-gray-800">{earnings.completed_count}</div>
            <div className="text-xs text-gray-400 mt-1">Lihat riwayat pengiriman</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm font-medium text-gray-700 mb-1">Profil Saya</div>
          <div className="text-sm text-gray-500">Nama: {user?.name}</div>
          <div className="text-sm text-gray-500">Email: {user?.email}</div>
          <div className="text-sm text-gray-500">Role Aktif: <span className="text-orange-500 font-medium">{user?.active_role}</span></div>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard