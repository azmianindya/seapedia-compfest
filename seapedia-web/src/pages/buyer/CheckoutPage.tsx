import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'

function CheckoutPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [cart, setCart] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [wallet, setWallet] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    Promise.all([
      api.get('/cart'),
      api.get('/addresses'),
      api.get('/wallet'),
    ]).then(([cartRes, addrRes, walletRes]) => {
      setCart(cartRes.data.cart)
      setAddresses(addrRes.data.addresses)
      setWallet(Number(walletRes.data.wallet.balance))
      const def = addrRes.data.addresses.find((a: any) => a.is_default)
      setSelectedAddress(def?.id ?? addrRes.data.addresses[0]?.id ?? null)
    }).finally(() => setLoading(false))
  }, [])

  const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0) ?? 0
  const shippingCost = 15000
  const tax = Math.round(subtotal * 0.12)
  const total = subtotal + shippingCost + tax

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError('Pilih alamat pengiriman terlebih dahulu')
      return
    }
    if (wallet < total) {
      setError('Saldo wallet tidak cukup. Silakan top up terlebih dahulu.')
      return
    }
    setProcessing(true)
    setError('')
    try {
      const res = await api.post('/orders/checkout', { address_id: selectedAddress })
      navigate(`/orders/${res.data.order.id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout gagal')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Memuat checkout...</div>
    </PublicLayout>
  )

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <PublicLayout>
        <div className="text-center text-gray-400 py-20">Keranjang kosong, tidak ada yang bisa di-checkout</div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-2xl font-bold text-gray-800 mb-6">Checkout</div>

        {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        {/* Alamat */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Alamat Pengiriman</div>
          {addresses.length === 0 ? (
            <div className="text-sm text-gray-400">
              Belum ada alamat. <span onClick={() => navigate('/addresses')} className="text-orange-500 underline cursor-pointer">Tambah alamat</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`border rounded-lg p-3 cursor-pointer ${selectedAddress === addr.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                >
                  <div className="text-sm font-medium text-gray-800">{addr.label} · {addr.recipient_name}</div>
                  <div className="text-xs text-gray-500">{addr.phone}</div>
                  <div className="text-xs text-gray-500">{addr.full_address}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Produk */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Produk dari {cart.store?.name}</div>
          <div className="flex flex-col gap-2">
            {cart.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="text-gray-600">{item.product.name} x{item.quantity}</div>
                <div className="text-gray-800">Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">Saldo Wallet</div>
            <div className={`text-sm font-bold ${wallet < total ? 'text-red-500' : 'text-orange-500'}`}>Rp {wallet.toLocaleString('id-ID')}</div>
          </div>
          {wallet < total && (
            <div className="text-xs text-red-500 mt-1">Saldo tidak cukup. <span onClick={() => navigate('/wallet')} className="underline cursor-pointer">Top up sekarang</span></div>
          )}
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-sm font-medium text-gray-700 mb-3">Ringkasan Pembayaran</div>
          <div className="flex flex-col gap-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600"><div>Subtotal</div><div>Rp {subtotal.toLocaleString('id-ID')}</div></div>
            <div className="flex justify-between text-gray-600"><div>Ongkir</div><div>Rp {shippingCost.toLocaleString('id-ID')}</div></div>
            <div className="flex justify-between text-gray-600"><div>PPN 12%</div><div>Rp {tax.toLocaleString('id-ID')}</div></div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100"><div>Total</div><div>Rp {total.toLocaleString('id-ID')}</div></div>
          </div>
          <div
            onClick={handleCheckout}
            className={`bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${processing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {processing ? 'Memproses...' : 'Bayar Sekarang'}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default CheckoutPage