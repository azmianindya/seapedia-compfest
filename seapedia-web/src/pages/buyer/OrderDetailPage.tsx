import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'

function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    api.get(`/orders/${id}`).then(res => setOrder(res.data.order)).finally(() => setLoading(false))
  }, [id])

  const statusColor: Record<string, string> = {
    'Sedang Dikemas': 'bg-yellow-100 text-yellow-600',
    'Menunggu Pengirim': 'bg-blue-100 text-blue-600',
    'Sedang Dikirim': 'bg-purple-100 text-purple-600',
    'Pesanan Selesai': 'bg-green-100 text-green-600',
    'Dikembalikan': 'bg-red-100 text-red-600',
  }

  if (loading) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Memuat pesanan...</div>
    </PublicLayout>
  )

  if (!order) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Pesanan tidak ditemukan</div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold text-gray-800">Detail Pesanan #{order.id}</div>
          <div className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>{order.status}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Toko</div>
          <div className="text-sm text-gray-600">{order.store?.name}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Alamat Pengiriman</div>
          <div className="text-sm text-gray-600">{order.address?.recipient_name} · {order.address?.phone}</div>
          <div className="text-sm text-gray-500">{order.address?.full_address}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Produk</div>
          <div className="flex flex-col gap-2">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="text-gray-600">{item.product_name} x{item.quantity}</div>
                <div className="text-gray-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-sm font-medium text-gray-700 mb-3">Ringkasan Pembayaran</div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-600"><div>Subtotal</div><div>Rp {Number(order.subtotal).toLocaleString('id-ID')}</div></div>
            <div className="flex justify-between text-gray-600"><div>Ongkir</div><div>Rp {Number(order.shipping_cost).toLocaleString('id-ID')}</div></div>
            <div className="flex justify-between text-gray-600"><div>PPN 12%</div><div>Rp {Number(order.tax).toLocaleString('id-ID')}</div></div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-gray-600"><div>Diskon</div><div>- Rp {Number(order.discount).toLocaleString('id-ID')}</div></div>
            )}
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100"><div>Total</div><div>Rp {Number(order.total).toLocaleString('id-ID')}</div></div>
          </div>
        </div>

        <Link to="/orders" className="block border border-orange-500 text-orange-500 text-sm font-medium py-2.5 rounded-lg text-center hover:bg-orange-50">← Kembali ke riwayat pesanan</Link>
      </div>
    </PublicLayout>
  )
}

export default OrderDetailPage