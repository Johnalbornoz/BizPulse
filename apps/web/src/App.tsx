import { useEffect, useState } from 'react'
import { useAuthStore } from './store/auth'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <DashboardLayout /> : <LoginPage />
}

export default App
