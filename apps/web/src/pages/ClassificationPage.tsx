import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'

interface Classification {
  industria: string
  subindustria: string
  modelo_negocio: string
  modelo_operativo: string
  confianza: number
  reasoning: string
}

export default function ClassificationPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()

  const [classification, setClassification] = useState<Classification>({
    industria: 'BPO',
    subindustria: 'Customer Service',
    modelo_negocio: 'B2B Service Provider',
    modelo_operativo: 'Distributed',
    confianza: 0.92,
    reasoning: 'Based on company data, classified as enterprise BPO service provider with distributed operations model.'
  })

  const [edited, setEdited] = useState(false)
  const [loading, setLoading] = useState(false)

  const isConsultor = user?.rol === 'Consultor' || user?.rol === 'SuperAdmin'

  const handleChange = (field: keyof Classification, value: any) => {
    setClassification(prev => ({ ...prev, [field]: value }))
    setEdited(true)
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      // Guardar clasificación (implementar backend después)
      console.log('Saving classification:', classification)

      // Avanzar a Fase 3
      await fetch(`/api/diagnosticos/${diagnosticoId}/phase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fase: 3 })
      })
      navigate(`/framework/${diagnosticoId}`)
    } catch (error) {
      alert('Error al guardar clasificación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold font-display">Fase 2: Business Classification</h1>
        <p className="text-lg opacity-90 mt-2">
          IA clasifica tu empresa automáticamente. {isConsultor && 'Valida o corrige los resultados.'}
        </p>
      </div>

      {/* Classification Results */}
      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-aibo-navy font-display">Clasificación Automática</h2>

        {/* Confidence Score */}
        <div className="bg-aibo-blue/10 rounded-lg p-4 border border-aibo-blue/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-aibo-slate">Confianza de la Clasificación</p>
              <p className="text-3xl font-bold text-aibo-blue">{(classification.confianza * 100).toFixed(0)}%</p>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-aibo-blue to-aibo-signal flex items-center justify-center text-white font-bold text-2xl">
              {(classification.confianza * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Classification Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-aibo-navy mb-2">Industria</label>
            <input
              type="text"
              value={classification.industria}
              onChange={e => handleChange('industria', e.target.value)}
              disabled={!isConsultor}
              className="w-full px-4 py-2 border border-aibo-line rounded-lg focus:outline-none focus:border-aibo-blue disabled:bg-aibo-mist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-aibo-navy mb-2">Sub-industria</label>
            <input
              type="text"
              value={classification.subindustria}
              onChange={e => handleChange('subindustria', e.target.value)}
              disabled={!isConsultor}
              className="w-full px-4 py-2 border border-aibo-line rounded-lg focus:outline-none focus:border-aibo-blue disabled:bg-aibo-mist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-aibo-navy mb-2">Modelo de Negocio</label>
            <input
              type="text"
              value={classification.modelo_negocio}
              onChange={e => handleChange('modelo_negocio', e.target.value)}
              disabled={!isConsultor}
              className="w-full px-4 py-2 border border-aibo-line rounded-lg focus:outline-none focus:border-aibo-blue disabled:bg-aibo-mist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-aibo-navy mb-2">Modelo Operativo</label>
            <input
              type="text"
              value={classification.modelo_operativo}
              onChange={e => handleChange('modelo_operativo', e.target.value)}
              disabled={!isConsultor}
              className="w-full px-4 py-2 border border-aibo-line rounded-lg focus:outline-none focus:border-aibo-blue disabled:bg-aibo-mist"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-aibo-navy mb-2">Justificación de la IA</label>
            <textarea
              value={classification.reasoning}
              onChange={e => handleChange('reasoning', e.target.value)}
              disabled={!isConsultor}
              rows={4}
              className="w-full px-4 py-2 border border-aibo-line rounded-lg focus:outline-none focus:border-aibo-blue disabled:bg-aibo-mist"
            />
          </div>
        </div>

        {/* Edit Badge */}
        {edited && isConsultor && (
          <div className="bg-aibo-signal/10 border border-aibo-signal rounded-lg p-3 text-sm text-aibo-signal-dark">
            ✏️ Has realizado cambios en la clasificación
          </div>
        )}

        {!isConsultor && (
          <div className="bg-aibo-cloud rounded-lg p-4 border border-aibo-line">
            <p className="text-sm text-aibo-slate">
              El consultor revisará esta clasificación antes de continuar.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/framework/${diagnosticoId}`)}
          className="flex-1 bg-aibo-mist text-aibo-navy font-semibold py-3 rounded-lg hover:bg-aibo-line transition-colors"
        >
          ← Atrás
        </button>

        <button
          onClick={handleContinue}
          disabled={loading || !isConsultor}
          className="flex-1 bg-aibo-blue text-white font-semibold py-3 rounded-lg hover:bg-aibo-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Siguiente: Framework →'}
        </button>
      </div>
    </div>
  )
}
