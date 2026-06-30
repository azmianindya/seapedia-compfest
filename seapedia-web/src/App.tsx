import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import SelectRolePage from './pages/public/SelectRolePage'
import ReviewsPage from './pages/public/ReviewsPage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import BuyerDashboard from './pages/dashboard/BuyerDashboard'
import SellerDashboard from './pages/dashboard/SellerDashboard'
import DriverDashboard from './pages/dashboard/DriverDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import WalletPage from './pages/buyer/WalletPage'
import AddressPage from './pages/buyer/AddressPage'
import CartPage from './pages/buyer/CartPage'
import CheckoutPage from './pages/buyer/CheckoutPage'
import OrderHistoryPage from './pages/buyer/OrderHistoryPage'
import OrderDetailPage from './pages/buyer/OrderDetailPage'
import ExpenseReportPage from './pages/buyer/ExpenseReportPage'
import { getUser } from './lib/auth'
import { Navigate } from 'react-router-dom'

function DashboardRouter() {
  const user = getUser()
  if (!user) return <Navigate to="/login" />
  if (!user.active_role) return <Navigate to="/select-role" />
  if (user.active_role === 'buyer') return <BuyerDashboard />
  if (user.active_role === 'seller') return <SellerDashboard />
  if (user.active_role === 'driver') return <DriverDashboard />
  if (user.active_role === 'admin') return <AdminDashboard />
  return <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/select-role" element={<SelectRolePage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Buyer routes */}
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/addresses" element={<AddressPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/expense" element={<ExpenseReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App