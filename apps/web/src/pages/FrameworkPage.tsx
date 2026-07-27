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

export default function FrameworkPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [selectedPillars, setSelectedPillars] = useState(PILLARS)
  const [loading, setLoading] = useState(false)

  const togglePillar = (pillar: string) => {
    setSelectedPillars(prev =>
      prev.includes(pillar)
        ? prev.filter(p => p !== pillar)
        : [...prev, pillar]
    )
  }

  const handleContinue = async () => {
    if (selectedPillars.length === 0) {
      alert('Debes seleccionar al menos un pilar')
      return
    }

    setLoading(true)
    try {
      // Guardar framework selection
      console.log('Selected pillars:', selectedPillars)

      // Avanzar a Fase 4
      await fetch(`/api/diagnosticos/${diagnosticoId}/phase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fase: 4 })
      })
      navigate(`/diagnosis/${diagnosticoId}`)
    } catch (error) {
      alert('Error al guardar framework')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold font-display">Fase 3: Framework Selection</h1>
        <p className="text-lg opacity-90 mt-2">
          Selecciona los 11 pilares de excelencia empresarial para tu diagnóstico
        </p>
      </div>

      {/* Framework Selection */}
      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-aibo-navy font-display">Los 11 Pilares de Excelencia</h2>
        <p className="text-aibo-slate">
          Todos los 11 pilares están seleccionados por defecto. Puedes deseleccionar cualquiera si no aplica a tu diagnóstico.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PILLARS.map(pillar => (
            <label key={pillar} className="flex items-center gap-3 p-4 border border-aibo-line rounded-lg hover:bg-aibo-cloud cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedPillars.includes(pillar)}
                onChange={() => togglePillar(pillar)}
                className="w-5 h-5 accent-aibo-blue cursor-pointer"
              />
              <div>
                <p className="font-medium text-aibo-navy">{pillar}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="bg-aibo-blue/10 rounded-lg p-4 border border-aibo-blue/20">
          <p className="text-sm text-aibo-navy">
            <strong>Pilares seleccionados:</strong> {selectedPillars.length} de 11
          </p>
        </div>
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
          onClick={handleContinue}
          disabled={loading}
          className="flex-1 bg-aibo-blue text-white font-semibold py-3 rounded-lg hover:bg-aibo-navy transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Siguiente: Cuestionario →'}
        </button>
      </div>
    </div>
  )
}
