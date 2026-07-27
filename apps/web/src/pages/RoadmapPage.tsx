import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'

interface Initiative {
  id: number
  titulo: string
  pilar: string
  impacto_estimado: number // USD
  esfuerzo_estimado: number // 1-5
  fase: 'quick_wins_30d' | 'medium_90d' | 'medium_180d' | 'strategic_12m' | 'strategic_24m'
}

const MOCK_INITIATIVES: Initiative[] = [
  {
    id: 1,
    titulo: 'Implementar CRM Estándar',
    pilar: 'Technology & Digital',
    impacto_estimado: 450000,
    esfuerzo_estimado: 3,
    fase: 'quick_wins_30d'
  },
  {
    id: 2,
    titulo: 'Definir OKRs Formales',
    pilar: 'Strategy Alignment',
    impacto_estimado: 250000,
    esfuerzo_estimado: 2,
    fase: 'quick_wins_30d'
  },
  {
    id: 3,
    titulo: 'Programa de Transformación Digital',
    pilar: 'Data & Intelligence',
    impacto_estimado: 1200000,
    esfuerzo_estimado: 4,
    fase: 'strategic_12m'
  }
]

export default function RoadmapPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [initiatives, setInitiatives] = useState<Initiative[]>(MOCK_INITIATIVES)
  const [loading, setLoading] = useState(false)

  const handleUpdateInitiative = (id: number, updates: Partial<Initiative>) => {
    setInitiatives(prev =>
      prev.map(i => (i.id === id ? { ...i, ...updates } : i))
    )
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      console.log('Saving roadmap:', initiatives)

      await fetch(`/api/diagnosticos/${diagnosticoId}/phase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fase: 8 })
      })
      navigate(`/proposal/${diagnosticoId}`)
    } catch (error) {
      alert('Error al guardar roadmap')
    } finally {
      setLoading(false)
    }
  }

  const totalImpact = initiatives.reduce((sum, i) => sum + i.impacto_estimado, 0)
  const phases = {
    quick_wins_30d: initiatives.filter(i => i.fase === 'quick_wins_30d'),
    medium_90d: initiatives.filter(i => i.fase === 'medium_90d'),
    medium_180d: initiatives.filter(i => i.fase === 'medium_180d'),
    strategic_12m: initiatives.filter(i => i.fase === 'strategic_12m'),
    strategic_24m: initiatives.filter(i => i.fase === 'strategic_24m')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold font-display">Fase 7: Transformation Roadmap</h1>
        <p className="text-lg opacity-90 mt-2">
          Prioriza iniciativas por impacto y esfuerzo. Estructura el plan de transformación.
        </p>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-signal rounded-lg shadow-md p-6 text-white">
        <div className="text-center">
          <p className="text-sm opacity-90">Impacto Total Estimado</p>
          <p className="text-4xl font-bold">${(totalImpact / 1000000).toFixed(1)}M USD</p>
          <p className="text-sm opacity-90 mt-2">{initiatives.length} iniciativas</p>
        </div>
      </div>

      {/* Roadmap by Phase */}
      <div className="space-y-6">
        {/* Quick Wins */}
        {phases.quick_wins_30d.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-aibo-signal">
            <h2 className="text-xl font-bold text-aibo-navy mb-4">🚀 Quick Wins (30 días)</h2>
            <div className="space-y-3">
              {phases.quick_wins_30d.map(init => (
                <div key={init.id} className="p-4 bg-aibo-cloud rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-aibo-navy">{init.titulo}</h3>
                    <span className="text-xs bg-aibo-signal text-white px-2 py-1 rounded">
                      ${(init.impacto_estimado / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <p className="text-xs text-aibo-slate">{init.pilar}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium Term (90-180d) */}
        {(phases.medium_90d.length > 0 || phases.medium_180d.length > 0) && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-aibo-blue">
            <h2 className="text-xl font-bold text-aibo-navy mb-4">⚡ Medium Term (90-180 días)</h2>
            <div className="space-y-3">
              {[...phases.medium_90d, ...phases.medium_180d].map(init => (
                <div key={init.id} className="p-4 bg-aibo-cloud rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-aibo-navy">{init.titulo}</h3>
                    <span className="text-xs bg-aibo-blue text-white px-2 py-1 rounded">
                      ${(init.impacto_estimado / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <p className="text-xs text-aibo-slate">{init.pilar}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic (12-24m) */}
        {(phases.strategic_12m.length > 0 || phases.strategic_24m.length > 0) && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-aibo-navy">
            <h2 className="text-xl font-bold text-aibo-navy mb-4">🎯 Strategic (12-24 meses)</h2>
            <div className="space-y-3">
              {[...phases.strategic_12m, ...phases.strategic_24m].map(init => (
                <div key={init.id} className="p-4 bg-aibo-cloud rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-aibo-navy">{init.titulo}</h3>
                    <span className="text-xs bg-aibo-navy text-white px-2 py-1 rounded">
                      ${(init.impacto_estimado / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <p className="text-xs text-aibo-slate">{init.pilar}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/diagnosis/${diagnosticoId}`)}
          className="flex-1 bg-aibo-mist text-aibo-navy font-semibold py-3 rounded-lg hover:bg-aibo-line transition-colors"
        >
          ← Atrás
        </button>

        <button
          onClick={handleComplete}
          disabled={loading}
          className="flex-1 bg-aibo-signal text-white font-semibold py-3 rounded-lg hover:bg-aibo-signal-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Siguiente: Propuesta →'}
        </button>
      </div>
    </div>
  )
}
