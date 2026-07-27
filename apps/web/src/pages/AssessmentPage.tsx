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

interface Question {
  id: number
  pilar: string
  texto: string
  respuesta: number
}

export default function AssessmentPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [currentPilar, setCurrentPilar] = useState(0)
  const [responses, setResponses] = useState<Map<number, number>>(new Map())
  const [loading, setLoading] = useState(false)

  // Mock questions - 3 per pilar
  const questions: Question[] = PILLARS.flatMap((pilar, pilarIdx) => [
    {
      id: pilarIdx * 3 + 1,
      pilar,
      texto: `¿Qué tan alineado está tu empresa con el estado del arte en ${pilar}?`,
      respuesta: 0
    },
    {
      id: pilarIdx * 3 + 2,
      pilar,
      texto: `¿Cuál es tu nivel de madurez en ${pilar} comparado con tu segmento?`,
      respuesta: 0
    },
    {
      id: pilarIdx * 3 + 3,
      pilar,
      texto: `¿Cuáles son los principales desafíos en ${pilar}?`,
      respuesta: 0
    }
  ])

  const pilarQuestions = questions.filter(q => q.pilar === PILLARS[currentPilar])

  const handleResponse = (questionId: number, score: number) => {
    setResponses(prev => new Map(prev).set(questionId, score))
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
      console.log('Saving responses:', responses)

      await fetch(`/api/diagnosticos/${diagnosticoId}/phase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fase: 5 })
      })
      navigate(`/validation/${diagnosticoId}`)
    } catch (error) {
      alert('Error al guardar respuestas')
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round(((currentPilar + 1) / PILLARS.length) * 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold font-display">Fase 4: Adaptive Assessment</h1>
        <p className="text-lg opacity-90 mt-2">
          Responde las preguntas sobre cada pilar de excelencia
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-aibo-navy">
            Pilar {currentPilar + 1} de {PILLARS.length}
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

      {/* Assessment Form */}
      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-aibo-navy font-display">{PILLARS[currentPilar]}</h2>

        <div className="space-y-6">
          {pilarQuestions.map(question => (
            <div key={question.id} className="border border-aibo-line rounded-lg p-4">
              <p className="font-medium text-aibo-navy mb-4">{question.texto}</p>
              <div className="flex gap-2 justify-between">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleResponse(question.id, score)}
                    className={`
                      w-10 h-10 rounded-lg font-semibold transition-all
                      ${responses.get(question.id) === score
                        ? 'bg-aibo-blue text-white'
                        : 'bg-aibo-mist text-aibo-slate hover:bg-aibo-line'
                      }
                    `}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <p className="text-xs text-aibo-slate mt-2">Escala: 1 (Bajo) - 5 (Excelente)</p>
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
            {loading ? 'Guardando...' : 'Completar Assessment →'}
          </button>
        )}
      </div>
    </div>
  )
}
