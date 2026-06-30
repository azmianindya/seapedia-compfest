import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../layout/PublicLayout'
import home from '../../assets/Home.png'
import api from '../../lib/axios'
import { productImages } from '../../data/productImages'

function HomePage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    api.get('/products').then(res => {
      const all = res.data.products
      const seenCategories = new Set<string>()
      const featured = all.filter((p: any) => {
        if (seenCategories.has(p.category)) return false
        seenCategories.add(p.category)
        return true
      })
      setProducts(featured)
    })
  }, [])

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => {
          const image = productImages[product.name]
          return (
            <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
                {image ? <img src={image} alt={product.name} className="w-full h-full object-cover" /> : '🐟'}
              </div>
              <div className="p-3">
                <div className="text-xs text-orange-400 mb-1">{product.category}</div>
                <div className="text-sm font-medium text-gray-800 mb-1">{product.name}</div>
                <div className="text-orange-500 font-bold text-sm">Rp {Number(product.price).toLocaleString('id-ID')}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </PublicLayout>
  )
}

export default HomePage