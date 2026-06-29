import { useParams } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import { dummyProducts } from '../../data/products'

function ProductDetailPage() {
  const { id } = useParams()
  const product = dummyProducts.find(p => p.id === Number(id))

  if (!product) return (
    <PublicLayout>
      <div className="text-center py-20 text-gray-500">Produk tidak ditemukan</div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-xl mb-6" />
        <div className="text-xs text-orange-400 mb-1">{product.category}</div>
        <div className="text-2xl font-bold text-gray-800 mb-2">{product.name}</div>
        <div className="text-yellow-400 mb-2">{'★'.repeat(product.rating)}</div>
        <div className="text-2xl font-bold text-orange-500 mb-4">{product.price}</div>
        <div className="text-sm text-gray-500 mb-6">Produk segar pilihan dari seller terpercaya SEAPEDIA.</div>
      </div>
    </PublicLayout> 
  )
}

export default ProductDetailPage