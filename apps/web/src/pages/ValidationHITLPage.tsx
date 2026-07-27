import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'

const PILLARS = [
  'Business DNA',
  'Strategy Alignment',
  'Process Excellence',
  'Operational Performance',
  'Technology & Digital',
  'Data & Intelligence',
  'AI Augmentation',
  'Revenue Generation & Market Excellence',
  'Customer & Quality Excellence',
  'Culture & Change Readiness',
  'Continuous Improvement'
]

interface DiagnosticSuggestion {
  id: number
  pregunta: string
  sugerencia_eje1: number
  argumentacion_eje1: string
  sugerencia_eje2: number
  argumentacion_eje2: string
  calificacion_eje1?: number
  calificacion_eje2?: number
  notas_experto?: string
}

export default function ValidationHITLPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [currentPilar, setCurrentPilar] = useState(0)
  const [validaciones, setValidaciones] = useState<DiagnosticSuggestion[]>([
    {
      id: 1,
      pregunta: '¿Qué tan definida está tu estrategia empresarial?',
      sugerencia_eje1: 3,
      argumentacion_eje1: 'Basado en discovery, la estrategia existe pero no está completamente documentada.',
      sugerencia_eje2: 3,
      argumentacion_eje2: 'Comparable con empresas del segmento de similar tamaño.',
      calificacion_eje1: 3,
      calificacion_eje2: 3
    },
    {
      id: 2,
      pregunta: '¿Cuáles son tus OKRs principales?',
      sugerencia_eje1: 2,
      argumentacion_eje1: 'Los OKRs no están formalizados según mejores prácticas.',
      sugerencia_eje2: 2,
      argumentacion_eje2: 'Menor formalidad que competidores directos.',
      calificacion_eje1: 2,
      calificacion_eje2: 2
    }
  ])
  const [loading, setLoading] = useState(false)

  const handleValidate = (id: number, eje1: number, eje2: number, notas: string) => {
    setValidaciones(prev =>
      prev.map(v =>
        v.id === id
          ? { ...v, calificacion_eje1: eje1, calificacion_eje2: eje2, notas_experto: notas }
          : v
      )
    )
  }

  const handleNext = () => {
    if (currentPilar < PILLARS.length - 1) {
      setCurrentPilar(currentPilar + 1)
    }
  }

  const handlePrev = () => {
    if (currentPilar > 0) {
      setCurrentPilar(currentPilar - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      console.log('Saving validations:', validaciones)

      await fetch(`/api/diagnosticos/${diagnosticoId}/phase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fase: 6 })
      })
      navigate(`/diagnosis/${diagnosticoId}`)
    } catch (error) {
      alert('Error al guardar validaciones')
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round(((currentPilar + 1) / PILLARS.length) * 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold font-display">Fase 5: Business Excellence Diagnosis</h1>
        <p className="text-lg opacity-90 mt-2">
          Valida y ajusta las sugerencias de IA. Dos ejes independientes: Estado del Arte vs. Segmento
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-aibo-navy">
            Pilar {currentPilar + 1} de {PILLARS.length}: {PILLARS[currentPilar]}
          </p>
          <p className="text-sm font-medium text-aibo-slate">{progress}%</p>
        </div>
        <div className="w-full bg-aibo-mist rounded-full h-2">
          <div
            className="bg-gradient-to-r from-aibo-blue to-aibo-signal h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Validation Form */}
      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-aibo-navy font-display">Validación de Diagnóstico</h2>
        <p className="text-aibo-slate">
          Revisa las sugerencias de IA y confirma o ajusta los scores en ambos ejes.
        </p>

        <div className="space-y-8">
          {validaciones.map(val => (
            <div key={val.id} className="border-2 border-aibo-line rounded-lg p-6">
              <h3 className="font-semibold text-aibo-navy mb-6">{val.pregunta}</h3>

              {/* Two-Column Layout: Eje 1 vs Eje 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eje 1: Estado del Arte */}
                <div className="bg-aibo-blue/5 rounded-lg p-4 border border-aibo-blue/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-aibo-blue rounded-full"></div>
                    <h4 className="font-semibold text-aibo-navy">Eje 1: Estado del Arte</h4>
                  </div>

                  <p className="text-sm text-aibo-slate mb-3">
                    <strong>Sugerencia IA:</strong> {val.sugerencia_eje1}/5
                  </p>
                  <p className="text-xs text-aibo-slate mb-4 italic">
                    "{val.argumentacion_eje1}"
                  </p>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-aibo-navy mb-2">
                      Tu Calificación
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={`eje1-${score}`}
                          onClick={() => handleValidate(val.id, score, val.calificacion_eje2 || val.sugerencia_eje2, val.notas_experto || '')}
                          className={`
                            w-8 h-8 rounded font-bold text-xs transition-all
                            ${val.calificacion_eje1 === score
                              ? 'bg-aibo-blue text-white'
                              : 'bg-aibo-mist text-aibo-slate hover:bg-aibo-line'
                            }
                          `}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Eje 2: Segmento/Competencia */}
                <div className="bg-aibo-signal/5 rounded-lg p-4 border border-aibo-signal/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-aibo-signal rounded-full"></div>
                    <h4 className="font-semibold text-aibo-navy">Eje 2: Segmento/Competencia</h4>
                  </div>

                  <p className="text-sm text-aibo-slate mb-3">
                    <strong>Sugerencia IA:</strong> {val.sugerencia_eje2}/5
                  </p>
                  <p className="text-xs text-aibo-slate mb-4 italic">
                    "{val.argumentacion_eje2}"
                  </p>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-aibo-navy mb-2">
                      Tu Calificación
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={`eje2-${score}`}
                          onClick={() => handleValidate(val.id, val.calificacion_eje1 || val.sugerencia_eje1, score, val.notas_experto || '')}
                          className={`
                            w-8 h-8 rounded font-bold text-xs transition-all
                            ${val.calificacion_eje2 === score
                              ? 'bg-aibo-signal text-white'
                              : 'bg-aibo-mist text-aibo-slate hover:bg-aibo-line'
                            }
                          `}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Notes */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-aibo-navy mb-2">
                  Notas del Consultor (opcional)
                </label>
                <textarea
                  value={val.notas_experto || ''}
                  onChange={e => handleValidate(val.id, val.calificacion_eje1 || val.sugerencia_eje1, val.calificacion_eje2 || val.sugerencia_eje2, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-aibo-line rounded-lg focus:outline-none focus:border-aibo-blue text-sm"
                  placeholder="Justificación o contexto adicional..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPilar === 0}
          className="flex-1 bg-aibo-mist text-aibo-navy font-semibold py-3 rounded-lg hover:bg-aibo-line transition-colors disabled:opacity-50"
        >
          ← Pilar Anterior
        </button>

        {currentPilar < PILLARS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 bg-aibo-blue text-white font-semibold py-3 rounded-lg hover:bg-aibo-navy transition-colors"
          >
            Siguiente Pilar →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="flex-1 bg-aibo-signal text-white font-semibold py-3 rounded-lg hover:bg-aibo-signal-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Completar Diagnosis →'}
          </button>
        )}
      </div>
    </div>
  )
}
