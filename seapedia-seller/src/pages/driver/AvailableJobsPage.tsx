import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import SellerLayout from '../../layout/SellerLayout'
import api from '../../lib/axios'

function AvailableJobsPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [takingId, setTakingId] = useState<number | null>(null)

  useEffect(() => {
    if (!user || user.active_role !== 'driver') { navigate('/login'); return }
    fetchJobs()
  }, [])

  const fetchJobs = () => {
    api.get('/driver/jobs/available').then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }

  const handleTake = async (id: number) => {
    setTakingId(id)
    try {
      await api.post(`/driver/jobs/${id}/take`)
      fetchJobs()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengambil job, mungkin sudah diambil driver lain')
      fetchJobs()
    } finally {
      setTakingId(null)
    }
  }

  if (loading) return (
    <SellerLayout>
      <div className="text-center text-gray-400 py-20">Memuat job tersedia...</div>
    </SellerLayout>
  )

  return (
    <SellerLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Job Tersedia</div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-20">Belum ada job yang tersedia saat ini</div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-800">#{order.id} · {order.store?.name}</div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{order.status}</div>
              </div>

              <div className="text-xs text-gray-500 mb-1">Ambil dari: {order.store?.address}</div>
              <div className="text-xs text-gray-500 mb-3">Antar ke: {order.address?.full_address}</div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400">{order.items?.length ?? 0} produk · Rp {Number(order.total).toLocaleString('id-ID')}</div>
                <div onClick={() => handleTake(order.id)} className={`bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 ${takingId === order.id ? 'opacity-50 pointer-events-none' : ''}`}>
                  {takingId === order.id ? 'Mengambil...' : 'Ambil Job'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  )
}

export default AvailableJobsPage