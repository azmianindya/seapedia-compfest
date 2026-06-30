import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import SellerLayout from '../../layout/SellerLayout'
import api from '../../lib/axios'

function ProductsPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [products, setProducts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Seafood Segar', 'Seafood Beku', 'Olahan Laut', 'Rumput Laut', 'Bumbu Seafood']

  useEffect(() => {
    if (!user || user.active_role !== 'seller') { navigate('/login'); return }
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    api.get('/seller/products').then(res => setProducts(res.data.products))
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category: '' })
    setEditId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (editId) {
        await api.put(`/seller/products/${editId}`, form)
      } else {
        await api.post('/seller/products', form)
      }
      fetchProducts()
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: any) => {
    setForm({ name: product.name, description: product.description ?? '', price: product.price, stock: product.stock, category: product.category ?? '' })
    setEditId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return
    await api.delete(`/seller/products/${id}`)
    fetchProducts()
  }

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-gray-800">Produk</div>
        <div onClick={() => { resetForm(); setShowForm(true) }} className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600">+ Tambah Produk</div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 max-w-lg">
          <div className="text-lg font-semibold text-gray-700 mb-4">{editId ? 'Edit Produk' : 'Tambah Produk'}</div>
          {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Nama Produk</div>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Kategori</div>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Pilih kategori</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
              <textarea className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Harga</div>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Stok</div>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3">
              <div onClick={handleSubmit} className={`flex-1 bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </div>
              <div onClick={resetForm} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                Batal
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Nama</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Kategori</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Harga</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Stok</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-gray-500">{product.category ?? '-'}</td>
                <td className="px-4 py-3 text-orange-500 font-medium">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <div onClick={() => handleEdit(product)} className="text-blue-500 cursor-pointer hover:underline">Edit</div>
                    <div onClick={() => handleDelete(product.id)} className="text-red-500 cursor-pointer hover:underline">Hapus</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card List - Mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start justify-between mb-1">
              <div className="font-medium text-gray-800 text-sm">{product.name}</div>
              <div className="flex gap-3 ml-2">
                <div onClick={() => handleEdit(product)} className="text-blue-500 text-xs cursor-pointer">Edit</div>
                <div onClick={() => handleDelete(product.id)} className="text-red-500 text-xs cursor-pointer">Hapus</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-1">{product.category ?? '-'}</div>
            <div className="flex items-center justify-between">
              <div className="text-orange-500 font-bold text-sm">Rp {Number(product.price).toLocaleString('id-ID')}</div>
              <div className="text-xs text-gray-500">Stok: {product.stock}</div>
            </div>
          </div>
        ))}
      </div>
    </SellerLayout>
  )
}

export default ProductsPage