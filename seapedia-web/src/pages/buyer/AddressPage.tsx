import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../lib/auth'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'

function AddressPage() {
  const navigate = useNavigate()
  const user = getUser()
  const [addresses, setAddresses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', recipient_name: '', phone: '', full_address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.active_role !== 'buyer') { navigate('/login'); return }
    fetchAddresses()
  }, [])

  const fetchAddresses = () => {
    api.get('/addresses').then(res => setAddresses(res.data.addresses))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/addresses', form)
      setForm({ label: '', recipient_name: '', phone: '', full_address: '' })
      setShowForm(false)
      fetchAddresses()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambah alamat')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus alamat ini?')) return
    await api.delete(`/addresses/${id}`)
    fetchAddresses()
  }

  const handleSetDefault = async (id: number) => {
    await api.post(`/addresses/${id}/default`)
    fetchAddresses()
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold text-gray-800">Alamat Pengiriman</div>
          <div onClick={() => setShowForm(!showForm)} className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600">
            {showForm ? 'Batal' : '+ Tambah Alamat'}
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Label Alamat</div>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Rumah, Kantor, dll" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Nama Penerima</div>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.recipient_name} onChange={e => setForm({ ...form, recipient_name: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">No. HP</div>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Alamat Lengkap</div>
                <textarea className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" rows={3} value={form.full_address} onChange={e => setForm({ ...form, full_address: e.target.value })} />
              </div>
              <div onClick={handleSubmit} className={`bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? 'Menyimpan...' : 'Simpan Alamat'}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-gray-800">{addr.label}</div>
                  {addr.is_default ? (
                    <div className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">Utama</div>
                  ) : null}
                </div>
                <div className="flex gap-3 text-xs">
                  {!addr.is_default && (
                    <div onClick={() => handleSetDefault(addr.id)} className="text-blue-500 cursor-pointer hover:underline">Jadikan Utama</div>
                  )}
                  <div onClick={() => handleDelete(addr.id)} className="text-red-500 cursor-pointer hover:underline">Hapus</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{addr.recipient_name} · {addr.phone}</div>
              <div className="text-sm text-gray-500">{addr.full_address}</div>
            </div>
          ))}
          {addresses.length === 0 && !showForm && (
            <div className="text-center text-gray-400 py-10">Belum ada alamat tersimpan</div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}

export default AddressPage