import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import SelectRolePage from './pages/auth/SelectRolePage'
import DashboardPage from './pages/seller/dashboardPage'
import StorePage from './pages/seller/StorePage'
import ProductsPage from './pages/seller/Products'
import { getUser } from './lib/auth'

function DashboardRouter() {
  const user = getUser()
  if (!user) return <Navigate to="/login" />
  if (!user.active_role) return <Navigate to="/select-role" />
  if (user.active_role === 'seller') return <DashboardPage />
  return <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select-role" element={<SelectRolePage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App