import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import SellerLayout from '../../layout/SellerLayout'
import api from '../../lib/axios'

function JobHistoryPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.active_role !== 'driver') { navigate('/login'); return }
    api.get('/driver/jobs/history').then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <SellerLayout>
      <div className="text-center text-gray-400 py-20">Memuat riwayat pengiriman...</div>
    </SellerLayout>
  )

  return (
    <SellerLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Riwayat Pengiriman</div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-20">Belum ada riwayat pengiriman</div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-800">#{order.id} · {order.store?.name}</div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-600">{order.status}</div>
              </div>
              <div className="text-xs text-gray-500 mb-1">Antar ke: {order.address?.full_address}</div>
              <div className="text-xs text-gray-400">
                Selesai: {order.delivered_at ? new Date(order.delivered_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
                <div className="text-xs text-gray-400">{order.items?.length ?? 0} produk</div>
                <div className="text-green-600 font-bold text-sm">+ Rp 8.000</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  )
}

export default JobHistoryPage