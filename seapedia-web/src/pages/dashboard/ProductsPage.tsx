import { Link } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import { dummyProducts } from '../../data/products'


function ProductsPage() {
  return (
    <PublicLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Semua Produk</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dummyProducts.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-3">
              <div className="text-xs text-orange-400 mb-1">{product.category}</div>
              <div className="text-sm font-medium text-gray-800 mb-1">{product.name}</div>
              <div className="text-orange-500 font-bold text-sm mb-1">{product.price}</div>
              <div className="text-yellow-400 text-xs">{'★'.repeat(product.rating)}</div>
            </div>
          </Link>
        ))}
      </div>
    </PublicLayout>
  )
}

export default ProductsPage