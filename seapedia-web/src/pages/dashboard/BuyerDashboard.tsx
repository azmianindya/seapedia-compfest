import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../lib/auth'
import api from '../../lib/axios'
import type { User } from '../../types'

function BuyerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [addressCount, setAddressCount] = useState(0)

  useEffect(() => {
    const u = getUser()
    if (!u || u.active_role !== 'buyer') {
      navigate('/login')
      return
    }
    setUser(u)

    api.get('/wallet').then(res => setBalance(Number(res.data.wallet.balance)))
    api.get('/orders').then(res => setOrderCount(res.data.orders.length))
    api.get('/addresses').then(res => setAddressCount(res.data.addresses.length))
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
          <div className="text-xs bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-medium">Buyer</div>
          <div onClick={handleLogout} className="text-sm text-red-500 cursor-pointer hover:underline">Logout</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-2xl font-bold text-gray-800 mb-6">Dashboard Buyer</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div onClick={() => navigate('/wallet')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
            <div className="text-sm text-gray-500 mb-1">Saldo Wallet</div>
            <div className="text-2xl font-bold text-orange-500">Rp {balance.toLocaleString('id-ID')}</div>
            <div className="text-xs text-gray-400 mt-1">Klik untuk top up</div>
          </div>
          <div onClick={() => navigate('/orders')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
            <div className="text-sm text-gray-500 mb-1">Total Pesanan</div>
            <div className="text-2xl font-bold text-gray-800">{orderCount}</div>
            <div className="text-xs text-gray-400 mt-1">Lihat riwayat pesanan</div>
          </div>
          <div onClick={() => navigate('/addresses')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
            <div className="text-sm text-gray-500 mb-1">Alamat Pengiriman</div>
            <div className="text-2xl font-bold text-gray-800">{addressCount}</div>
            <div className="text-xs text-gray-400 mt-1">Kelola alamat</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div onClick={() => navigate('/products')} className="bg-orange-500 text-white rounded-xl p-5 cursor-pointer hover:bg-orange-600 transition">
            <div className="text-sm font-medium">Mulai Belanja</div>
            <div className="text-xs opacity-80 mt-1">Jelajahi produk dari berbagai toko</div>
          </div>
          <div onClick={() => navigate('/cart')} className="bg-white border border-orange-200 text-orange-500 rounded-xl p-5 cursor-pointer hover:bg-orange-50 transition">
            <div className="text-sm font-medium">Lihat Keranjang</div>
            <div className="text-xs opacity-70 mt-1">Lanjutkan checkout belanja kamu</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm font-medium text-gray-700 mb-1">Profil Saya</div>
          <div className="text-sm text-gray-500">Nama: {user?.name}</div>
          <div className="text-sm text-gray-500">Email: {user?.email}</div>
          <div className="text-sm text-gray-500">Role Aktif: <span className="text-orange-500 font-medium">{user?.active_role}</span></div>
          <div className="text-sm text-gray-500">Semua Role: {user?.roles.join(', ')}</div>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard