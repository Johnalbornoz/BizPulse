import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

interface Validacion {
  id: string
  pregunta_id: number
  pregunta_texto: string
  sugerencia_eje1: number
  sugerencia_eje2: number
  argumentacion_eje1: string
  argumentacion_eje2: string
  calificacion_eje1?: number
  calificacion_eje2?: number
  argumentacion_experto_eje1?: string
  argumentacion_experto_eje2?: string
  validado_en?: string
}

export default function ValidationHITLPage() {
  const { diagnosticoId, pilarId } = useParams()
  const { token } = useAuthStore()
  const [validaciones, setValidaciones] = useState<Validacion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ validadas: 0, total: 0 })

  useEffect(() => {
    loadValidaciones()
  }, [diagnosticoId, pilarId])

  const loadValidaciones = async () => {
    try {
      const response = await fetch(
        `/api/scoring/${diagnosticoId}/pilar/${pilarId}/progress`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setValidaciones(data.validaciones)
        setProgress({ validadas: data.validadas, total: data.total })
      }
    } catch (error) {
      console.error('Error loading validaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (eje1: number, eje2: number, argEje1: string, argEje2: string) => {
    try {
      const response = await fetch(`/api/scoring/${validaciones[currentIndex].id}/confirmar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          calificacion_eje1: eje1,
          calificacion_eje2: eje2,
          argumentacion_eje1: argEje1,
          argumentacion_eje2: argEje2
        })
      })

      if (response.ok) {
        // Move to next validación or show completion
        if (currentIndex < validaciones.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          alert('¡Pilar validado completamente!')
          // Redirect to dashboard
          window.location.href = '/dashboard'
        }
        loadValidaciones()
      }
    } catch (error) {
      console.error('Error confirming:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando validaciones...</div>
  }

  if (validaciones.length === 0) {
    return <div className="text-center py-8">No hay validaciones pendientes</div>
  }

  const actual = validaciones[currentIndex]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-neutral-900">
            Validadas: {progress.validadas} / {progress.total}
          </h3>
          <span className="text-2xl font-bold text-primary">
            {Math.round((progress.validadas / progress.total) * 100)}%
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(progress.validadas / progress.total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Validation Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Validación HITL</h2>
          <p className="text-lg opacity-90">
            Pregunta {currentIndex + 1} de {validaciones.length}
          </p>
        </div>

        {/* Question */}
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-xl font-bold text-neutral-900 mb-4">
            {actual.pregunta_texto}
          </h3>
        </div>

        {/* Dual-axis comparison */}
        <div className="grid grid-cols-2 gap-6 p-6">
          {/* EJE 1 */}
          <ValidationColumn
            title="Eje 1: Estado del Arte"
            color="from-blue-500 to-blue-600"
            suggerencia={actual.sugerencia_eje1}
            argumentacion={actual.argumentacion_eje1}
            calificacionActual={actual.calificacion_eje1}
            argumentoActual={actual.argumentacion_experto_eje1}
            onConfirm={(score, arg) => handleConfirm(score, actual.calificacion_eje2 || actual.sugerencia_eje2, arg, actual.argumentacion_experto_eje2 || '')}
          />

          {/* EJE 2 */}
          <ValidationColumn
            title="Eje 2: Segmento/Competencia"
            color="from-purple-500 to-purple-600"
            suggerencia={actual.sugerencia_eje2}
            argumentacion={actual.argumentacion_eje2}
            calificacionActual={actual.calificacion_eje2}
            argumentoActual={actual.argumentacion_experto_eje2}
            onConfirm={(score, arg) => handleConfirm(actual.calificacion_eje1 || actual.sugerencia_eje1, score, actual.argumentacion_experto_eje1 || '', arg)}
          />
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            ← Anterior
          </button>

          <span className="text-neutral-600 font-medium">
            {currentIndex + 1} / {validaciones.length}
          </span>

          <button
            onClick={() => setCurrentIndex(Math.min(validaciones.length - 1, currentIndex + 1))}
            disabled={currentIndex === validaciones.length - 1}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}

interface ColumnProps {
  title: string
  color: string
  suggerencia: number
  argumentacion: string
  calificacionActual?: number
  argumentoActual?: string
  onConfirm: (score: number, arg: string) => void
}

function ValidationColumn({
  title,
  color,
  suggerencia,
  argumentacion,
  calificacionActual,
  argumentoActual,
  onConfirm
}: ColumnProps) {
  const [score, setScore] = useState(calificacionActual || suggerencia)
  const [argumento, setArgumento] = useState(argumentoActual || '')
  const [showForm, setShowForm] = useState(!calificacionActual)

  const handleConfirm = () => {
    onConfirm(score, argumento)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className={`bg-gradient-to-r ${color} text-white p-4 rounded-lg`}>
        <h4 className="font-bold text-lg">{title}</h4>
      </div>

      {/* Sugerencia IA */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h5 className="font-semibold text-neutral-900 mb-2">Sugerencia IA</h5>
        <div className="text-3xl font-bold text-neutral-900 mb-3">{suggerencia} / 5</div>
        <p className="text-sm text-neutral-700">{argumentacion}</p>
      </div>

      {/* Validación */}
      {showForm ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Calificación Final
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setScore(n)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                    score === n
                      ? 'bg-primary text-white'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Justificación del Consultor
            </label>
            <textarea
              value={argumento}
              onChange={(e) => setArgumento(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
              placeholder="¿Por qué este score?"
            />
          </div>

          <button
            onClick={handleConfirm}
            className="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 font-semibold transition-colors"
          >
            Confirmar
          </button>
        </div>
      ) : (
        <div className="bg-success/10 p-4 rounded-lg border border-success">
          <div className="text-2xl font-bold text-success mb-2">{score} / 5</div>
          <p className="text-sm text-neutral-700">{argumento}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-sm text-primary hover:underline font-medium"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  )
}
