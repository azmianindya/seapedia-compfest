import { useNavigate } from 'react-router-dom'
import { getUser, setUser } from '../../lib/auth'
import api from '../../lib/axios'

function SelectRolePage() {
  const navigate = useNavigate()
  const user = getUser()

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSelectRole = async (role: string) => {
    try {
      await api.post('/switch-role', { role })
      setUser({ ...user, active_role: role })
      navigate('/dashboard')
    } catch {
      navigate('/login')
    }
  }

  const roleLabels: Record<string, string> = {
    buyer: '🛒 Buyer',
    seller: '🏪 Seller',
    driver: '🚗 Driver',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full">
        <div className="text-2xl font-bold text-gray-800 mb-1">Pilih Role</div>
        <div className="text-gray-500 text-sm mb-6">Kamu punya lebih dari satu role. Pilih role yang ingin digunakan sekarang.</div>
        <div className="flex flex-col gap-3">
          {user.roles.map(role => (
            <div key={role} onClick={() => handleSelectRole(role)} className="border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
              <div className="font-medium text-gray-800">{roleLabels[role] ?? role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectRolePage