import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'
import { productImages } from '../../data/productImages'

function CartPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    fetchCart()
  }, [])

  const fetchCart = () => {
    api.get('/cart').then(res => setCart(res.data.cart)).finally(() => setLoading(false))
  }

  const handleUpdateQty = async (itemId: number, quantity: number) => {
    if (quantity < 1) return
    await api.put(`/cart/items/${itemId}`, { quantity })
    fetchCart()
  }

  const handleRemove = async (itemId: number) => {
    await api.delete(`/cart/items/${itemId}`)
    fetchCart()
  }

  const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0) ?? 0

  if (loading) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Memuat keranjang...</div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-2xl font-bold text-gray-800 mb-6">Keranjang Belanja</div>

        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div className="text-center text-gray-400 py-20">Keranjang kamu masih kosong</div>
        ) : (
          <>
            <div className="bg-orange-50 text-orange-600 text-sm px-4 py-2 rounded-lg mb-4">
              Belanja dari toko: <span className="font-medium">{cart.store?.name}</span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {cart.items.map((item: any) => {
                const image = productImages[item.product.name]
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-2xl flex-shrink-0">
                      {image ? <img src={image} alt={item.product.name} className="w-full h-full object-cover" /> : '🐟'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{item.product.name}</div>
                      <div className="text-orange-500 font-bold text-sm">Rp {Number(item.product.price).toLocaleString('id-ID')}</div>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <div onClick={() => handleUpdateQty(item.id, item.quantity - 1)} className="px-2 py-1 cursor-pointer text-gray-500 hover:bg-gray-50">-</div>
                      <div className="px-3 py-1 text-sm">{item.quantity}</div>
                      <div onClick={() => handleUpdateQty(item.id, item.quantity + 1)} className="px-2 py-1 cursor-pointer text-gray-500 hover:bg-gray-50">+</div>
                    </div>
                    <div onClick={() => handleRemove(item.id)} className="text-red-500 text-xs cursor-pointer hover:underline ml-2">Hapus</div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="font-bold text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</div>
              </div>
              <div onClick={() => navigate('/checkout')} className="bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600">
                Checkout
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  )
}

export default CartPage