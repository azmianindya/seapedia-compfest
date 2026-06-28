import { Link, useNavigate } from 'react-router-dom'
import { getUser, isLoggedIn, logout } from '../lib/auth'

function Navbar() {
    const navigate = useNavigate()
    const loggedIn = isLoggedIn()
    const user = getUser()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-orange-500">SEAPEDIA</Link>

                <div className="flex items-center gap-4">
                    <Link to="/products" className="text-sm text-gray-600 hover:text-orange-500">Produk</Link>
                    <Link to="/reviews" className="text-sm text-gray-600 hover:text-orange-500">Review</Link>

                    {loggedIn ? (
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500">
                                {user?.name} · <span className="text-orange-500 font-medium">{user?.active_role ?? 'Pilih Role'}</span>
                            </div>
                            <Link to="/dashboard" className="text-sm bg-orange-50 text-orange-500 px-3 py-1 rounded-full">Dashboard</Link>
                            <div onClick={handleLogout} className="text-sm text-red-500 cursor-pointer hover:underline">Logout</div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm text-gray-600 hover:text-orange-500">Masuk</Link>
                            <Link to="/register" className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600">Daftar</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Navbar