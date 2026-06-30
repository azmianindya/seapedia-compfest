import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, isLoggedIn, logout } from '../lib/auth'
import { MdMenu, MdClose } from 'react-icons/md'

function Navbar() {
    const navigate = useNavigate()
    const loggedIn = isLoggedIn()
    const user = getUser()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setMenuOpen(false)
    }

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-orange-500">SEAPEDIA</Link>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/products" className="text-sm text-gray-600 hover:text-orange-500">Produk</Link>
                    <Link to="/reviews" className="text-sm text-gray-600 hover:text-orange-500">Review</Link>

                    {loggedIn ? (
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500">
                                {user?.name} · <span className="text-orange-500 font-medium">{user?.active_role ?? 'Pilih Role'}</span>
                            </div>
                            {user?.active_role === 'buyer' && (
                                <>
                                    <Link to="/cart" className="text-sm text-gray-600 hover:text-orange-500">Keranjang</Link>
                                    <Link to="/wallet" className="text-sm text-gray-600 hover:text-orange-500">Wallet</Link>
                                </>
                            )}
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

                {/* Mobile hamburger button */}
                <div onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600 cursor-pointer text-2xl">
                    {menuOpen ? <MdClose /> : <MdMenu />}
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
                    <Link to="/products" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-orange-500">Produk</Link>
                    <Link to="/reviews" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-orange-500">Review</Link>

                    {loggedIn ? (
                        <>
                            <div className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                                {user?.name} · <span className="text-orange-500 font-medium">{user?.active_role ?? 'Pilih Role'}</span>
                            </div>
                            {user?.active_role === 'buyer' && (
                                <>
                                    <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-orange-500">Keranjang</Link>
                                    <Link to="/wallet" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-orange-500">Wallet</Link>
                                </>
                            )}
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-orange-500 font-medium">Dashboard</Link>
                            <div onClick={handleLogout} className="text-sm text-red-500 cursor-pointer">Logout</div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-orange-500">Masuk</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm bg-orange-500 text-white px-4 py-2 rounded-full text-center hover:bg-orange-600">Daftar</Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
export default Navbar