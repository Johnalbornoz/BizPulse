import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

interface FinancialSummary {
  total_impacto_usd: number
  roi_porcentaje: number
  cantidad_brechas: number
  impacto_promedio_brecha: number
  pilares: Array<{
    pilar_id: number
    pilar_nombre: string
    impacto_total_usd: number
  }>
}

export default function FinancialImpactPage() {
  const { diagnosticoId } = useParams()
  const { token } = useAuthStore()
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedPilar, setExpandedPilar] = useState<number | null>(null)

  useEffect(() => {
    loadFinancialSummary()
  }, [diagnosticoId])

  const loadFinancialSummary = async () => {
    try {
      const response = await fetch(
        `/api/financial/${diagnosticoId}/summary`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.ok) {
        setSummary(await response.json())
      }
    } catch (error) {
      console.error('Error loading financial summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando análisis financiero...</div>
  }

  if (!summary) {
    return <div className="text-center py-8">No hay datos financieros disponibles</div>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-8">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Impacto Total Estimado</h3>
          <div className="text-4xl font-bold mb-2">
            {formatCurrency(summary.total_impacto_usd)}
          </div>
          <p className="text-sm opacity-75">Anual</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8">
          <h3 className="text-sm font-semibold opacity-90 mb-2">ROI Estimado</h3>
          <div className="text-4xl font-bold mb-2">{summary.roi_porcentaje}%</div>
          <p className="text-sm opacity-75">Del ingresos anual</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-8">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Brechas Identificadas</h3>
          <div className="text-4xl font-bold mb-2">{summary.cantidad_brechas}</div>
          <p className="text-sm opacity-75">Con impacto cuantificable</p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-blue-900 mb-2">◇ Insight Comercial Clave</h3>
        <p className="text-blue-800">
          El diagnóstico identifica {summary.cantidad_brechas} oportunidades de mejora con un impacto combinado de{' '}
          <strong>{formatCurrency(summary.total_impacto_usd)}</strong> anuales. Esto representa un{' '}
          <strong>{summary.roi_porcentaje}% de los ingresos</strong> que pueden recuperarse o capturarse a través de
          la transformación.
        </p>
      </div>

      {/* Pilar-Level Breakdown */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Impacto por Pilar</h2>

        {summary.pilares.map((pilar, index) => (
          <div
            key={pilar.pilar_id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            <button
              onClick={() => setExpandedPilar(expandedPilar === pilar.pilar_id ? null : pilar.pilar_id)}
              className="w-full p-6 text-left hover:bg-neutral-50 transition-colors flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-neutral-900 mb-1">{pilar.pilar_nombre}</h3>
                <p className="text-sm text-neutral-600">Impacto potencial: {formatCurrency(pilar.impacto_total_usd)}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(pilar.impacto_total_usd)}
                </div>
                <span className="text-neutral-500">
                  {expandedPilar === pilar.pilar_id ? '▼' : '▶'}
                </span>
              </div>
            </button>

            {expandedPilar === pilar.pilar_id && (
              <PilarDetails pilarId={pilar.pilar_id} diagnosticoId={diagnosticoId!} />
            )}
          </div>
        ))}
      </div>

      {/* Methodology Note */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
        <h3 className="font-bold text-neutral-900 mb-3">◆ Metodología de Cálculo</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>
            <strong>Brechas:</strong> Diferencia entre score actual y objetivo (5/5 = excelencia)
          </li>
          <li>
            <strong>Impacto:</strong> Estimado basado en industria, contexto financiero y prácticas de referencia
          </li>
          <li>
            <strong>Supuestos:</strong> Documentados y auditables en cada cálculo
          </li>
          <li>
            <strong>Confianza:</strong> Clasificada como Baja/Media/Alta según disponibilidad de datos
          </li>
        </ul>
      </div>
    </div>
  )
}

function PilarDetails({ pilarId, diagnosticoId }: { pilarId: number; diagnosticoId: string }) {
  const { token } = useAuthStore()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDetails()
  }, [])

  const loadDetails = async () => {
    try {
      const response = await fetch(
        `/api/financial/${diagnosticoId}/pilar/${pilarId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.ok) {
        setDetails(await response.json())
      }
    } catch (error) {
      console.error('Error loading pilar details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4 text-center text-neutral-500">Cargando detalles...</div>

  if (!details) return <div className="p-4 text-center text-neutral-500">Sin detalles disponibles</div>

  return (
    <div className="bg-neutral-50 p-6 border-t border-neutral-200">
      <h4 className="font-semibold text-neutral-900 mb-4">Preguntas con Impacto Cuantificable</h4>
      <div className="space-y-3">
        {/* Details would be shown here */}
        <p className="text-sm text-neutral-600">
          {details.detalles?.length || 0} preguntas con impacto estimado
        </p>
      </div>
    </div>
  )
}
