import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'
import { productImages } from '../../data/productImages'

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data.product)
    }).finally(() => setLoading(false))
  }, [id])

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
        <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
          {image
            ? <img src={image} alt={product.name} className="w-full h-full object-cover" />
            : <div className="text-8xl">🐟</div>
          }
        </div>
        <div className="text-xs text-orange-400 mb-1">{product.category ?? '-'}</div>
        <div className="text-2xl font-bold text-gray-800 mb-2">{product.name}</div>
        <div className="text-2xl font-bold text-orange-500 mb-2">Rp {Number(product.price).toLocaleString('id-ID')}</div>
        <div className="text-sm text-gray-500 mb-2">{product.description}</div>
        <div className="text-sm text-gray-400 mb-4">Stok: {product.stock}</div>

        <Link to="/products" className="text-sm text-orange-500 hover:underline">← Kembali ke produk</Link>
      </div>
    </PublicLayout>
  )
}

export default ProductDetailPage