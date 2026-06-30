import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'
import { productImages } from '../../data/productImages'
import { isLoggedIn } from '../../lib/auth'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data.product)
    }).finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    setAdding(true)
    setError('')
    setMessage('')
    try {
      await api.post('/cart/items', { product_id: product.id, quantity })
      setMessage('Berhasil ditambahkan ke keranjang!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan ke keranjang')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <PublicLayout>
      <div className="text-center text-gray-400 py-20">Memuat produk...</div>
    </PublicLayout>
  )

  if (!product) return (
    <PublicLayout>
      <div className="text-center py-20 text-gray-500">Produk tidak ditemukan</div>
    </PublicLayout>
  )

  const image = productImages[product.name]

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Gambar - Kiri */}
          <div className="w-full md:w-1/2 h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
            {image
              ? <img src={image} alt={product.name} className="w-full h-full object-cover" />
              : <div className="text-8xl">🐟</div>
            }
          </div>

          {/* Info + Aksi - Kanan */}
          <div className="flex-1 flex flex-col">
            <div className="text-xs text-orange-400 mb-1">{product.category ?? '-'}</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{product.name}</div>
            <div className="text-2xl font-bold text-orange-500 mb-2">Rp {Number(product.price).toLocaleString('id-ID')}</div>
            <div className="text-sm text-gray-500 mb-2">{product.description}</div>
            <div className="text-sm text-gray-400 mb-4">Stok: {product.stock}</div>

            {message && <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">{message}</div>}
            {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

            <div className="flex items-center gap-3 mb-4">
              <div className="text-sm text-gray-600">Jumlah</div>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <div onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1.5 cursor-pointer text-gray-500 hover:bg-gray-50">-</div>
                <div className="px-4 py-1.5 text-sm">{quantity}</div>
                <div onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-1.5 cursor-pointer text-gray-500 hover:bg-gray-50">+</div>
              </div>
            </div>

            <div
              onClick={handleAddToCart}
              className={`bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 mt-auto ${adding ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </div>
          </div>
        </div>
        <Link to="/products" className="block border border-orange-500 text-orange-500 text-sm font-medium py-2.5 rounded-lg text-center hover:bg-orange-50">← Kembali ke produk</Link>
      </div>
    </PublicLayout>
  )
}

export default ProductDetailPage