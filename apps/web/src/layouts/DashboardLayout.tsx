import { useAuthStore } from '../store/auth'
import DashboardPage from '../pages/DashboardPage'

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">BizPulse</h1>
          <div className="flex items-center gap-4">
            <span className="text-neutral-700">{user?.nombre}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardPage />
      </main>
    </div>
  )
}
