import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useState } from 'react'

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aibo-cloud via-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-aibo-mist shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aibo-blue to-aibo-signal flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-lg font-bold text-white">BP</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold font-display bg-gradient-to-r from-aibo-navy to-aibo-blue bg-clip-text text-transparent">
                  BizPulse
                </span>
                <span className="text-xs text-aibo-slate font-medium">Diagnóstico</span>
              </div>
            </button>

            {/* Center - Breadcrumb Navigation */}
            <div className="hidden md:flex items-center gap-2 text-sm text-aibo-slate">
              <button
                onClick={() => navigate('/')}
                className="hover:text-aibo-blue transition-colors font-medium"
              >
                Dashboard
              </button>
              <span className="text-aibo-line">·</span>
              <span className="text-aibo-slate">{user?.nombre}</span>
            </div>

            {/* Right - User Menu */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-aibo-navy">{user?.nombre}</span>
                <span className="text-xs text-aibo-slate capitalize">{user?.rol}</span>
              </div>

              {/* Avatar */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-aibo-blue to-aibo-signal text-white font-bold text-lg hover:shadow-lg transition-shadow flex items-center justify-center relative"
              >
                {user?.nombre?.charAt(0).toUpperCase()}

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-aibo-mist py-2 z-50 animate-slideInFromTop">
                    <div className="px-4 py-2 border-b border-aibo-mist">
                      <p className="text-sm font-semibold text-aibo-navy">{user?.nombre}</p>
                      <p className="text-xs text-aibo-slate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        navigate('/')
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-aibo-navy hover:bg-aibo-cloud transition-colors flex items-center gap-2"
                    >
                      <span>🏠</span> Dashboard
                    </button>

                    <div className="my-2 border-t border-aibo-mist" />

                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                    >
                      <span>🚪</span> Cerrar sesión
                    </button>
                  </div>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 hover:bg-aibo-cloud rounded-lg transition-colors"
              >
                <span className="text-xl">⋮</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-aibo-mist/50 backdrop-blur-md bg-white/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-aibo-slate">
          <p>
            BizPulse - Diagnóstico de Excelencia Empresarial <span className="text-aibo-blue">•</span> Potenciado por IA
          </p>
        </div>
      </footer>
    </div>
  )
}
