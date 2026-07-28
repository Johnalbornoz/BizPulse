import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/empresas', icon: '🏢', label: 'Empresas' },
  { path: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  { path: '/admin/segmentos', icon: '🎯', label: 'Segmentos' }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-aibo-mist shadow-sm transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-aibo-mist">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-3 hover:opacity-80 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aibo-blue to-aibo-signal flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">BP</span>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-aibo-navy">Admin</span>
                <span className="text-xs text-aibo-slate">BizPulse</span>
              </div>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-aibo-blue text-white'
                  : 'text-aibo-navy hover:bg-aibo-cloud'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 rounded-lg border border-aibo-line hover:bg-aibo-cloud transition-colors text-aibo-navy"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-aibo-mist shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-aibo-navy to-aibo-blue bg-clip-text text-transparent">
                Administración
              </h1>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-aibo-line hover:bg-aibo-cloud transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aibo-blue to-aibo-signal text-white flex items-center justify-center font-bold">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-aibo-navy">{user?.nombre}</p>
                  <p className="text-xs text-aibo-slate capitalize">{user?.rol}</p>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-aibo-mist py-2 z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-aibo-navy hover:bg-aibo-cloud transition-colors flex items-center gap-2"
                  >
                    <span>🏠</span> Volver a Diagnóstico
                  </button>

                  <div className="my-2 border-t border-aibo-mist" />

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <span>🚪</span> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
