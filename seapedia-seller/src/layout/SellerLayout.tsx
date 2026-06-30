import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../lib/auth'
import { HiOutlineLogout } from 'react-icons/hi'
import { MdMenu, MdClose } from 'react-icons/md'

function SellerLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const user = getUser()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Toko Saya', path: '/store' },
    { label: 'Produk', path: '/products' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="text-2xl font-bold text-orange-500 p-6">SEAPEDIA</div>
        <div className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map(item => (
            <div key={item.path} onClick={() => navigate(item.path)} className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-500 cursor-pointer">{item.label}</div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">{user?.name}</div>
              <div className="text-xs text-orange-500">{user?.active_role}</div>
            </div>
            <div onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 cursor-pointer hover:underline"><HiOutlineLogout />Logout</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-orange-500">SEAPEDIA</div>
          <div onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 cursor-pointer text-2xl">
            {menuOpen ? <MdClose /> : <MdMenu />}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex flex-col gap-1">
            {navItems.map(item => (
              <div key={item.path} onClick={() => { navigate(item.path); setMenuOpen(false) }} className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-500 cursor-pointer">{item.label}</div>
            ))}
            <div onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 cursor-pointer">
              <HiOutlineLogout />Logout
            </div>
          </div>
        )}
        
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}

export default SellerLayout