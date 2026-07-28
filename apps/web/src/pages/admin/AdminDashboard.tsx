import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/Admin'
import { useAuthStore } from '../../store/auth'

interface Stats {
  empresas: {
    total: number
    paises: number
    industrias: number
    empleados_promedio: number
    facturacion_total_usd: number
  }
  usuarios: {
    total: number
    superadmins: number
    admins: number
    consultores: number
  }
  segmentos: {
    total: number
    industrias: number
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.rol !== 'SuperAdmin') {
      navigate('/')
      return
    }

    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const apiUrl = import.meta.env.VITE_API_URL || '/api'

        const [empRes, usuRes, segRes] = await Promise.all([
          fetch(`${apiUrl}/admin/empresas/stats`, { headers }),
          fetch(`${apiUrl}/admin/usuarios/stats`, { headers }),
          fetch(`${apiUrl}/admin/segmentos/stats`, { headers })
        ])

        const empresas = await empRes.json()
        const usuarios = await usuRes.json()
        const segmentos = await segRes.json()

        setStats({ empresas, usuarios, segmentos })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, token, navigate])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-aibo-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-aibo-slate mt-4">Cargando...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold text-aibo-navy mb-2">Bienvenido, {user?.nombre}</h2>
          <p className="text-aibo-slate">Panel de administración de BizPulse</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empresas Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-aibo-mist p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-aibo-slate text-sm font-medium">Total Empresas</p>
                <p className="text-3xl font-bold text-aibo-navy mt-2">{stats?.empresas.total || 0}</p>
                <p className="text-xs text-aibo-slate mt-2">
                  {stats?.empresas.paises || 0} países • {stats?.empresas.industrias || 0} industrias
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                ■
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/empresas')}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-aibo-blue to-aibo-signal text-white font-medium hover:shadow-lg transition-all"
            >
              Gestionar Empresas →
            </button>
          </div>

          {/* Usuarios Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-aibo-mist p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-aibo-slate text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-aibo-navy mt-2">{stats?.usuarios.total || 0}</p>
                <p className="text-xs text-aibo-slate mt-2">
                  {stats?.usuarios.admins || 0} admins • {stats?.usuarios.consultores || 0} consultores
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                ●
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/usuarios')}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg transition-all"
            >
              Gestionar Usuarios →
            </button>
          </div>

          {/* Segmentos Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-aibo-mist p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-aibo-slate text-sm font-medium">Total Segmentos</p>
                <p className="text-3xl font-bold text-aibo-navy mt-2">{stats?.segmentos.total || 0}</p>
                <p className="text-xs text-aibo-slate mt-2">
                  {stats?.segmentos.industrias || 0} industrias
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                ▲
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/segmentos')}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium hover:shadow-lg transition-all"
            >
              Gestionar Segmentos →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-aibo-mist p-6">
          <h3 className="text-lg font-bold text-aibo-navy mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/empresas')}
              className="p-4 rounded-lg border border-aibo-line hover:bg-aibo-cloud transition-colors text-left"
            >
              <p className="font-semibold text-aibo-navy">+ Nueva Empresa</p>
              <p className="text-sm text-aibo-slate">Registrar una nueva empresa</p>
            </button>
            <button
              onClick={() => navigate('/admin/usuarios')}
              className="p-4 rounded-lg border border-aibo-line hover:bg-aibo-cloud transition-colors text-left"
            >
              <p className="font-semibold text-aibo-navy">+ Nuevo Usuario</p>
              <p className="text-sm text-aibo-slate">Crear cuenta de usuario</p>
            </button>
            <button
              onClick={() => navigate('/admin/segmentos')}
              className="p-4 rounded-lg border border-aibo-line hover:bg-aibo-cloud transition-colors text-left"
            >
              <p className="font-semibold text-aibo-navy">+ Nuevo Segmento</p>
              <p className="text-sm text-aibo-slate">Definir segmento de negocio</p>
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-4 rounded-lg border border-aibo-line hover:bg-aibo-cloud transition-colors text-left"
            >
              <p className="font-semibold text-aibo-navy">← Volver a Diagnóstico</p>
              <p className="text-sm text-aibo-slate">Ir al módulo de diagnóstico</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
