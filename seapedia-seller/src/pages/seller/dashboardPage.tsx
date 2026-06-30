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

  useEffect(() => {
    if (!user || user.active_role !== 'seller') { navigate('/login'); return }
    api.get('/seller/store').then(res => {
      setStore(res.data.store)
      setProductCount(res.data.store?.products?.length ?? 0)
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
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">Pesanan Masuk</div>
          <div className="text-2xl font-bold text-gray-800">0</div>
        </div>
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