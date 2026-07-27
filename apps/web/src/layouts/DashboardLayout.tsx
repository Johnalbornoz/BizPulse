import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-aibo-cloud">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-aibo-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-2xl font-bold text-aibo-navy font-display hover:opacity-80 transition-opacity">
            BizPulse
          </button>
          <div className="flex items-center gap-4">
            <span className="text-aibo-slate">{user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-aibo-navy text-white rounded-lg hover:bg-aibo-ink transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
