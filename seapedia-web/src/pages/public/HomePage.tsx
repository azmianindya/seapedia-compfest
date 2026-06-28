import { Link } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import home from '../../assets/Home.png'
import { dummyProducts } from '../../data/products'

function HomePage() {
  return (
    <PublicLayout>
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <img src={home} alt="hero" className="w-full h-[400px] object-cover" />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl font-bold text-white mb-2">Selamat Datang di <span className="text-orange-400">SEAPEDIA</span></div>
          <div className="text-white text-lg mb-6">Marketplace terpercaya untuk Seller, Buyer, dan Driver</div>
          <div className="flex gap-4">
            <Link to="/products" className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600">Mulai Belanja</Link>
            <Link to="/products" className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10">Lihat Kategori</Link>
          </div>
        </div>
      </div>

      <div className="mb-4 text-xl font-bold text-gray-800">Produk Unggulan</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dummyProducts.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <img src={product.image} alt={product.name} className="w-full h-36 object-cover" />
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

export default HomePage