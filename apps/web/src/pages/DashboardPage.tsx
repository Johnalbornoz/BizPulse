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
      const currentToken = localStorage.getItem('token')
      console.log('Token:', currentToken ? 'present' : 'missing')
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${apiUrl}/diagnosticos`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      })
      if (response.ok) {
        setDiagnosticos(await response.json())
      } else {
        console.error('Error:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Error loading diagnosticos:', error)
    }
  }

  const createNewDiagnostico = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${apiUrl}/diagnosticos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: `Diagnóstico ${new Date().toLocaleDateString()}` })
      })

      if (response.ok) {
        const diagnostico = await response.json()
        window.location.href = `/diagnosis/${diagnostico.id}`
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
      discovery: 'bg-aibo-blue/10 text-aibo-blue',
      clasificacion: 'bg-yellow-100 text-yellow-800',
      assessment: 'bg-aibo-signal/10 text-aibo-signal-dark',
      validacion: 'bg-orange-100 text-orange-800',
      finalizando: 'bg-aibo-signal/15 text-aibo-signal-dark',
      finalizado: 'bg-aibo-signal/20 text-aibo-signal-dark'
    }
    return colors[estado] || 'bg-aibo-mist text-aibo-slate'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 font-display">Bienvenido a BizPulse</h2>
        <p className="text-lg opacity-90">
          Diagnóstico de excelencia empresarial en dos ejes: estado del arte vs. segmento/competencia
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={createNewDiagnostico}
          disabled={loading}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer text-left hover:bg-aibo-cloud disabled:opacity-50 border border-aibo-line"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-aibo-blue/10 p-3 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-aibo-navy font-display">
              {loading ? 'Creando...' : 'Crear Diagnóstico'}
            </h3>
          </div>
          <p className="text-aibo-slate text-sm">
            Iniciar un nuevo diagnóstico de excelencia empresarial
          </p>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer text-left hover:bg-aibo-cloud border border-aibo-line">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-aibo-signal/10 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-aibo-navy font-display">Ver Diagnósticos</h3>
          </div>
          <p className="text-aibo-slate text-sm">
            {diagnosticos.length} diagnóstico{diagnosticos.length !== 1 ? 's' : ''} en proceso
          </p>
        </div>
      </div>

      {/* Diagnósticos List */}
      <div className="bg-white rounded-lg shadow-md border border-aibo-line">
        <div className="px-6 py-4 border-b border-aibo-line">
          <h3 className="text-lg font-semibold text-aibo-navy font-display">Diagnósticos Recientes</h3>
        </div>
        <div className="p-6">
          {diagnosticos.length === 0 ? (
            <p className="text-aibo-slate text-center py-8">
              No hay diagnósticos aún. Crea uno nuevo para comenzar.
            </p>
          ) : (
            <div className="space-y-4">
              {diagnosticos.map(diag => (
                <div
                  key={diag.id}
                  className="flex items-center justify-between p-4 border border-aibo-line rounded-lg hover:bg-aibo-cloud cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-aibo-navy font-display">{diag.nombre}</h4>
                    <p className="text-sm text-aibo-slate">
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
