import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import SellerLayout from '../../layout/SellerLayout'
import api from '../../lib/axios'
import { BiSolidStore } from 'react-icons/bi'
import { MdOutlineDescription } from 'react-icons/md'
import { IoLocationOutline, IoStorefrontOutline } from 'react-icons/io5'
import { BsTelephone } from 'react-icons/bs'

function StorePage() {
  const navigate = useNavigate()
  const user = getUser()
  const [store, setStore] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (!user || user.active_role !== 'seller') { navigate('/login'); return }
    api.get('/seller/store').then(res => {
      if (res.data.store) {
        setStore(res.data.store)
        setForm({
          name: res.data.store.name,
          description: res.data.store.description ?? '',
          address: res.data.store.address ?? '',
          phone: res.data.store.phone ?? '',
        })
      }
    })
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (store && !isEdit) { setIsEdit(true); setLoading(false); return }
      if (store) {
        await api.put('/seller/store', form)
        setSuccess('Toko berhasil diupdate!')
        setIsEdit(false)
      } else {
        const res = await api.post('/seller/store', form)
        setStore(res.data.store)
        setSuccess('Toko berhasil dibuat!')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan toko')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SellerLayout>
      <div className="text-2xl font-bold text-gray-800 mb-6">Toko Saya</div>

      <div className="flex flex-col md:flex-row gap-4">
        {store && (
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <BiSolidStore className="text-orange-500 text-4xl" />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">{store.name}</div>
              <div className="flex items-center gap-1 text-xs text-blue-500 mb-3">
                <div>✓</div>
                <div>Verified Store</div>
              </div>
              <div className="w-full text-left text-xs text-gray-500 flex flex-col gap-2">
                <div className="flex items-center gap-2"><IoLocationOutline className="text-gray-400" />{store.address ?? '-'}</div>
                <div className="flex items-center gap-2"><BsTelephone className="text-gray-400" />{store.phone ?? '-'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">{success}</div>}
            {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

            <div className="flex flex-col gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Nama Toko</div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-orange-400">
                  <IoStorefrontOutline className="text-gray-400 text-lg flex-shrink-0" />
                  <input type="text" className="flex-1 text-sm focus:outline-none disabled:bg-white" placeholder="Nama toko kamu" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} disabled={!!store && !isEdit} />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
                <div className="flex gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-orange-400">
                  <MdOutlineDescription className="text-gray-400 text-lg flex-shrink-0 mt-0.5" />
                  <textarea className="flex-1 text-sm focus:outline-none disabled:bg-white resize-none" rows={3} placeholder="Deskripsi toko" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} disabled={!!store && !isEdit} />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Alamat</div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-orange-400">
                  <IoLocationOutline className="text-gray-400 text-lg flex-shrink-0" />
                  <input type="text" className="flex-1 text-sm focus:outline-none disabled:bg-white" placeholder="Alamat toko" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} disabled={!!store && !isEdit} />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">No. HP</div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-orange-400">
                  <BsTelephone className="text-gray-400 text-lg flex-shrink-0" />
                  <input type="text" className="flex-1 text-sm focus:outline-none disabled:bg-white" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!!store && !isEdit} />
                </div>
              </div>

              <div onClick={handleSubmit} className={`bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? 'Menyimpan...' : store && !isEdit ? 'Edit Toko' : store ? 'Simpan Perubahan' : 'Buat Toko'}
              </div>
              {isEdit && (
                <div onClick={() => setIsEdit(false)} className="text-sm text-center text-gray-500 cursor-pointer hover:underline">Batal</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

export default StorePage