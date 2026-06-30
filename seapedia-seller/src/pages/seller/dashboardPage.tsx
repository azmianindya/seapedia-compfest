import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import SellerLayout from '../../layout/SellerLayout'
import api from '../../lib/axios'

function DashboardPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [store, setStore] = useState<any>(null)
  const [productCount, setProductCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [revenueOrderCount, setRevenueOrderCount] = useState(0)

  useEffect(() => {
    if (!user || user.active_role !== 'seller') { navigate('/login'); return }

    api.get('/seller/store').then(res => {
      setStore(res.data.store)
      setProductCount(res.data.store?.products?.length ?? 0)
    })

    api.get('/seller/orders').then(res => {
      const pending = res.data.orders.filter((o: any) => o.status === 'Sedang Dikemas')
      setPendingCount(pending.length)
    })

    api.get('/seller/revenue').then(res => {
      setRevenue(res.data.revenue)
      setRevenueOrderCount(res.data.order_count)
    })
  }, [])

  return (
    <SellerLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Dashboard</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">Nama Toko</div>
          <div className="text-xl font-bold text-gray-800">{store?.name ?? '-'}</div>
          <div className="text-xs text-gray-400 mt-1">{store ? 'Toko aktif' : 'Belum ada toko'}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">Total Produk</div>
          <div className="text-2xl font-bold text-orange-500">{productCount}</div>
        </div>
        <div onClick={() => navigate('/orders')} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition">
          <div className="text-sm text-gray-500 mb-1">Pesanan Perlu Diproses</div>
          <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
          <div className="text-xs text-gray-400 mt-1">Klik untuk kelola pesanan</div>
        </div>
      </div>

      <div className="bg-orange-500 rounded-2xl p-6 text-white mb-6">
        <div className="text-sm opacity-80 mb-1">Total Pendapatan</div>
        <div className="text-3xl font-bold mb-1">Rp {Number(revenue).toLocaleString('id-ID')}</div>
        <div className="text-xs opacity-70">Dari {revenueOrderCount} pesanan yang sudah diproses</div>
      </div>

      {!store && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-600">
          Kamu belum punya toko. <span onClick={() => navigate('/store')} className="font-medium underline cursor-pointer">Buat toko sekarang</span>
        </div>
      )}
    </SellerLayout>
  )
}

export default DashboardPage