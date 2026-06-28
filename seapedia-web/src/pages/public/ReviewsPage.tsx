import { useEffect, useState } from 'react'
import PublicLayout from '../../layout/PublicLayout'
import api from '../../lib/axios'
import type { Review } from '../../types'

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [form, setForm] = useState({ reviewer_name: '', rating: 5, comment: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const fetchReviews = async () => {
    const res = await api.get('/reviews')
    setReviews(res.data.reviews)
  }

  useEffect(() => { fetchReviews() }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/reviews', form)
      setSuccess('Review berhasil dikirim!')
      setForm({ reviewer_name: '', rating: 5, comment: '' })
      fetchReviews()
    } catch {
      //
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-2xl font-bold text-gray-800 mb-6">Review SEAPEDIA</div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="text-lg font-semibold text-gray-700 mb-4">Tulis Review</div>
          {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">{success}</div>}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Nama</div>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Nama kamu" value={form.reviewer_name} onChange={e => setForm({ ...form, reviewer_name: e.target.value })} />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Rating</div>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Komentar</div>
              <textarea className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" rows={3} placeholder="Tulis pengalaman kamu menggunakan SEAPEDIA..." value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
            </div>
            <div onClick={handleSubmit} className={`bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg text-center cursor-pointer hover:bg-orange-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {loading ? 'Mengirim...' : 'Kirim Review'}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-800">{review.reviewer_name}</div>
                <div className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</div>
              </div>
              <div className="text-sm text-gray-600">{review.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

export default ReviewsPage