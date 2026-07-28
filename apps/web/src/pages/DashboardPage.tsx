import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/auth'
import {
  TypeformContainer,
  TypeformCard,
  TypeformHeading,
  TypeformButton,
} from '../components/Typeform'

interface Diagnostico {
  id: string
  nombre: string
  estado: string
  created_at: string
}

const stateConfig = {
  discovery: {
    label: 'Descubrimiento',
    icon: '🔍',
    color: 'from-aibo-blue to-aibo-blue-light',
  },
  clasificacion: {
    label: 'Clasificación',
    icon: '📋',
    color: 'from-yellow-400 to-yellow-600',
  },
  assessment: {
    label: 'Evaluación',
    icon: '📊',
    color: 'from-aibo-signal to-emerald-500',
  },
  validacion: {
    label: 'Validación',
    icon: '✓',
    color: 'from-orange-400 to-orange-600',
  },
  finalizando: {
    label: 'Finalizando',
    icon: '⏳',
    color: 'from-purple-400 to-purple-600',
  },
  finalizado: {
    label: 'Finalizado',
    icon: '🎉',
    color: 'from-aibo-signal to-emerald-600',
  },
}

export default function DashboardPage() {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [loading, setLoading] = useState(false)
  const [showList, setShowList] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    loadDiagnosticos()
  }, [])

  const loadDiagnosticos = async () => {
    try {
      const currentToken = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${apiUrl}/diagnosticos`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
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
    } finally {
      setLoading(false)
    }
  }

  const getDiagnosticoState = (estado: string) => {
    return stateConfig[estado as keyof typeof stateConfig] || {
      label: estado,
      icon: '•',
      color: 'from-aibo-slate to-aibo-slate',
    }
  }

  if (showList && diagnosticos.length > 0) {
    return (
      <TypeformContainer gradient="secondary">
        <TypeformCard>
          <div className="space-y-8">
            <div>
              <button
                onClick={() => setShowList(false)}
                className="text-aibo-blue hover:text-aibo-navy transition-colors mb-4 font-medium"
              >
                ← Volver
              </button>
              <TypeformHeading>Tus Diagnósticos</TypeformHeading>
              <p className="text-lg text-aibo-slate">
                {diagnosticos.length} diagnóstico{diagnosticos.length !== 1 ? 's' : ''} en progreso
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {diagnosticos.map((diag, index) => {
                const state = getDiagnosticoState(diag.estado)
                return (
                  <a
                    key={diag.id}
                    href={`/diagnosis/${diag.id}`}
                    className={`
                      group block p-6 rounded-2xl
                      bg-gradient-to-br ${state.color}
                      text-white
                      shadow-lg hover:shadow-xl
                      transition-all duration-300
                      hover:scale-105 hover:-translate-y-1
                      animate-slideIn
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{state.icon}</span>
                          <span className="font-semibold text-sm opacity-90">
                            {state.label}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold font-display mb-2">
                          {diag.nombre}
                        </h4>
                        <p className="text-sm opacity-90">
                          {new Date(diag.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-2xl group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            <TypeformButton
              variant="outline"
              size="lg"
              onClick={() => setShowList(false)}
              fullWidth
            >
              Crear nuevo diagnóstico
            </TypeformButton>
          </div>
        </TypeformCard>
      </TypeformContainer>
    )
  }

  return (
    <TypeformContainer gradient="primary">
      <TypeformCard>
        <div className="text-center space-y-12">
          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-aibo-blue to-aibo-signal shadow-2xl flex items-center justify-center">
                <span className="text-5xl animate-pulse-soft">📊</span>
              </div>
            </div>
            <div className="space-y-4">
              <TypeformHeading>
                Bienvenido a BizPulse
              </TypeformHeading>
              <p className="text-xl text-aibo-slate leading-relaxed max-w-lg mx-auto">
                Diagnóstico de excelencia empresarial en dos ejes: estado del arte vs. segmento/competencia
              </p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <TypeformButton
              size="lg"
              onClick={createNewDiagnostico}
              loading={loading}
              className="animate-fadeIn"
            >
              Crear Diagnóstico ✨
            </TypeformButton>

            {diagnosticos.length > 0 && (
              <TypeformButton
                variant="secondary"
                size="lg"
                onClick={() => setShowList(true)}
                className="animate-fadeIn"
                style={{ animationDelay: '100ms' }}
              >
                Ver Diagnósticos ({diagnosticos.length})
              </TypeformButton>
            )}
          </div>

          {/* Info Cards */}
          {diagnosticos.length === 0 && (
            <div className="pt-8 space-y-6 animate-slideIn">
              <p className="text-aibo-slate text-lg">
                Comienza creando tu primer diagnóstico
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="font-medium text-aibo-navy mb-1">Descubre</p>
                  <p className="text-aibo-slate text-xs">Identifica áreas clave</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="text-2xl mb-2">📈</div>
                  <p className="font-medium text-aibo-navy mb-1">Analiza</p>
                  <p className="text-aibo-slate text-xs">Evalúa desempeño</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                  <div className="text-2xl mb-2">💡</div>
                  <p className="font-medium text-aibo-navy mb-1">Actúa</p>
                  <p className="text-aibo-slate text-xs">Implementa mejoras</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </TypeformCard>
    </TypeformContainer>
  )
}
