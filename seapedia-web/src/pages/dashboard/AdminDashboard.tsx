import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../lib/auth'
import type { User } from '../../types'

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const u = getUser()
    if (!u || u.active_role !== 'admin') { navigate('/login'); return }
    setUser(u)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-orange-500">SEAPEDIA</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{user?.name}</div>
          <div className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-full font-medium">Admin</div>
          <div onClick={() => { logout(); navigate('/login') }} className="text-sm text-red-500 cursor-pointer hover:underline">Logout</div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Total User</div>
            <div className="text-2xl font-bold text-gray-800">5</div>
            <div className="text-xs text-gray-400 mt-1">Monitoring lengkap di Level 6</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Total Produk</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-xs text-gray-400 mt-1">Monitoring lengkap di Level 6</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Total Order</div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-xs text-gray-400 mt-1">Monitoring lengkap di Level 6</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard