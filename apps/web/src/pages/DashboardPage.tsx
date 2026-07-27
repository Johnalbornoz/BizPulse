import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/auth'

interface Diagnostico {
  id: string
  nombre: string
  estado: string
  created_at: string
}

export default function DashboardPage() {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    loadDiagnosticos()
  }, [])

  const loadDiagnosticos = async () => {
    try {
      const response = await fetch('/api/diagnosticos', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setDiagnosticos(await response.json())
      }
    } catch (error) {
      console.error('Error loading diagnosticos:', error)
    }
  }

  const createNewDiagnostico = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/diagnosticos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: `Diagnóstico ${new Date().toLocaleDateString()}` })
      })

      if (response.ok) {
        const diagnostico = await response.json()
        window.location.href = `/discovery/${diagnostico.id}`
      }
    } catch (error) {
      console.error('Error creating diagnostico:', error)
      alert('Error al crear diagnóstico')
    } finally {
      setLoading(false)
    }
  }

  const stateColor = (estado: string) => {
    const colors: Record<string, string> = {
      discovery: 'bg-blue-100 text-blue-800',
      clasificacion: 'bg-yellow-100 text-yellow-800',
      assessment: 'bg-purple-100 text-purple-800',
      validacion: 'bg-orange-100 text-orange-800',
      finalizando: 'bg-green-100 text-green-800',
      finalizado: 'bg-success/20 text-success'
    }
    return colors[estado] || 'bg-neutral-100 text-neutral-800'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Bienvenido a BizPulse</h2>
        <p className="text-lg opacity-90">
          Diagnóstico de excelencia empresarial en dos ejes: estado del arte vs. segmento/competencia
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={createNewDiagnostico}
          disabled={loading}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left hover:bg-neutral-50 disabled:opacity-50"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {loading ? 'Creando...' : 'Crear Diagnóstico'}
            </h3>
          </div>
          <p className="text-neutral-600 text-sm">
            Iniciar un nuevo diagnóstico de excelencia empresarial
          </p>
        </button>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left hover:bg-neutral-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Ver Diagnósticos</h3>
          </div>
          <p className="text-neutral-600 text-sm">
            {diagnosticos.length} diagnóstico{diagnosticos.length !== 1 ? 's' : ''} en proceso
          </p>
        </div>
      </div>

      {/* Diagnósticos List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Diagnósticos Recientes</h3>
        </div>
        <div className="p-6">
          {diagnosticos.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">
              No hay diagnósticos aún. Crea uno nuevo para comenzar.
            </p>
          ) : (
            <div className="space-y-4">
              {diagnosticos.map(diag => (
                <div
                  key={diag.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-neutral-900">{diag.nombre}</h4>
                    <p className="text-sm text-neutral-500">
                      {new Date(diag.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stateColor(diag.estado)}`}>
                    {diag.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
