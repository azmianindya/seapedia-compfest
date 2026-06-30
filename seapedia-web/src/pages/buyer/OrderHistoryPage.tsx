import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'

function OrderHistoryPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    api.get('/orders').then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    'Sedang Dikemas': 'bg-yellow-100 text-yellow-600',
    'Menunggu Pengirim': 'bg-blue-100 text-blue-600',
    'Sedang Dikirim': 'bg-purple-100 text-purple-600',
    'Pesanan Selesai': 'bg-green-100 text-green-600',
    'Dikembalikan': 'bg-red-100 text-red-600',
  }

  if (loading) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Memuat riwayat pesanan...</div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-2xl font-bold text-gray-800 mb-6">Riwayat Pesanan</div>

        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-20">Belum ada pesanan</div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map(order => (
              <Link to={`/orders/${order.id}`} key={order.id} className="bg-white rounded-xl shadow-sm p-4 block hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-800">#{order.id} · {order.store?.name}</div>
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>{order.status}</div>
                </div>
                <div className="text-xs text-gray-400 mb-1">{order.items?.length ?? 0} produk</div>
                <div className="text-orange-500 font-bold text-sm">Rp {Number(order.total).toLocaleString('id-ID')}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

export default OrderHistoryPage