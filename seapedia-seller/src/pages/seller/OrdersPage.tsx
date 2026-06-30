import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import SellerLayout from '../../layout/SellerLayout'
import api from '../../lib/axios'

function OrdersPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (!user || user.active_role !== 'seller') { navigate('/login'); return }
    fetchOrders()
  }, [])

  const fetchOrders = () => {
    api.get('/seller/orders').then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }

  const handleProcess = async (id: number) => {
    setProcessingId(id)
    try {
      await api.put(`/seller/orders/${id}/status`)
      fetchOrders()
    } catch (err) {
        
    } finally {
      setProcessingId(null)
    }
  }

  const statusColor: Record<string, string> = {
    'Sedang Dikemas': 'bg-yellow-100 text-yellow-600',
    'Menunggu Pengirim': 'bg-blue-100 text-blue-600',
    'Sedang Dikirim': 'bg-purple-100 text-purple-600',
    'Pesanan Selesai': 'bg-green-100 text-green-600',
    'Dikembalikan': 'bg-red-100 text-red-600',
  }

  if (loading) return (
    <SellerLayout>
      <div className="text-center text-gray-400 py-20">Memuat pesanan...</div>
    </SellerLayout>
  )

  return (
    <SellerLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Pesanan Masuk</div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-20">Belum ada pesanan masuk</div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-800">#{order.id} · {order.user?.name}</div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>{order.status}</div>
              </div>

              <div className="flex flex-col gap-1 mb-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-500">
                    <div>{item.product_name} x{item.quantity}</div>
                    <div>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-orange-500 font-bold text-sm">Rp {Number(order.total).toLocaleString('id-ID')}</div>
                {order.status === 'Sedang Dikemas' && (
                  <div onClick={() => handleProcess(order.id)} className={`bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 ${processingId === order.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    {processingId === order.id ? 'Memproses...' : 'Proses Order'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  )
}

export default OrdersPage