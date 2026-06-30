import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'
import { productImages } from '../../data/productImages'

function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data.products)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <PublicLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Semua Produk</div>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Memuat produk...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => {
            const image = productImages[product.name]
            return (
              <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
                  {image ? <img src={image} alt={product.name} className="w-full h-full object-cover" /> : '🐟'}
                </div>
                <div className="p-3">
                  <div className="text-xs text-orange-400 mb-1">{product.category ?? '-'}</div>
                  <div className="text-sm font-medium text-gray-800 mb-1">{product.name}</div>
                  <div className="text-orange-500 font-bold text-sm mb-1">Rp {Number(product.price).toLocaleString('id-ID')}</div>
                  <div className="text-xs text-gray-400">{product.store?.name}</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </PublicLayout>
  )
}

export default ProductsPage