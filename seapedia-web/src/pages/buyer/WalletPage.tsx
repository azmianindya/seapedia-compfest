import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'

function WalletPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    fetchWallet()
  }, [])

  const fetchWallet = () => {
    api.get('/wallet').then(res => setBalance(Number(res.data.wallet.balance)))
  }

  const handleTopup = async () => {
    setError('')
    setSuccess('')
    if (!amount || Number(amount) < 10000) {
      setError('Minimal top up Rp 10.000')
      return
    }
    setLoading(true)
    try {
      await api.post('/wallet/topup', { amount: Number(amount) })
      setSuccess('Top up berhasil!')
      setAmount('')
      fetchWallet()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Top up gagal')
    } finally {
      setLoading(false)
    }
  }

  const quickAmounts = [50000, 100000, 500000, 1000000]

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto">
        <div className="text-2xl font-bold text-gray-800 mb-6">Wallet Saya</div>

        <div className="bg-orange-500 rounded-2xl p-6 text-white mb-6">
          <div className="text-sm opacity-80 mb-1">Saldo Tersedia</div>
          <div className="text-3xl font-bold">Rp {balance.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-lg font-semibold text-gray-700 mb-4">Top Up Saldo</div>

          {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">{success}</div>}
          {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickAmounts.map(amt => (
              <div
                key={amt}
                onClick={() => setAmount(String(amt))}
                className={`border rounded-lg py-2 text-center text-sm cursor-pointer ${amount === String(amt) ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
              >
                Rp {amt.toLocaleString('id-ID')}
              </div>
            ))}
          </div>

          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 mb-4"
            placeholder="Atau masukkan nominal lain"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <div
            onClick={handleTopup}
            className={`bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {loading ? 'Memproses...' : 'Top Up Sekarang'}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default WalletPage