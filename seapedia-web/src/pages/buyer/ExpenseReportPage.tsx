import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'

function ExpenseReportPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [expense, setExpense] = useState({ total_expense: 0, order_count: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    Promise.all([
      api.get('/orders-expense'),
      api.get('/orders'),
    ]).then(([expenseRes, ordersRes]) => {
      setExpense(expenseRes.data)
      setOrders(ordersRes.data.orders)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Memuat laporan...</div>
    </PublicLayout>
  )

  const statusColor: Record<string, string> = {
    'Sedang Dikemas': 'bg-yellow-100 text-yellow-600',
    'Menunggu Pengirim': 'bg-blue-100 text-blue-600',
    'Sedang Dikirim': 'bg-purple-100 text-purple-600',
    'Pesanan Selesai': 'bg-green-100 text-green-600',
    'Dikembalikan': 'bg-red-100 text-red-600',
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-2xl font-bold text-gray-800 mb-6">Laporan Pengeluaran</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-500 rounded-2xl p-5 text-white">
            <div className="text-sm opacity-80 mb-1">Total Pengeluaran</div>
            <div className="text-2xl font-bold">Rp {Number(expense.total_expense).toLocaleString('id-ID')}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="text-sm text-gray-500 mb-1">Total Transaksi</div>
            <div className="text-2xl font-bold text-gray-800">{expense.order_count}</div>
          </div>
        </div>

        <div className="text-lg font-semibold text-gray-700 mb-3">Riwayat Transaksi</div>
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-800">#{order.id} · {order.store?.name}</div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>{order.status}</div>
              </div>
              <div className="text-xs text-gray-400 mb-1">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="text-orange-500 font-bold text-sm">Rp {Number(order.total).toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export default ExpenseReportPage