import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import RadarChart from '../components/RadarChart'

interface RoadmapItem {
  id: string
  titulo: string
  pilar_id: number
  fase_propuesta: string
  impacto_estimado_usd: number
  esfuerzo_horas: number
  prioridad: number
}

interface DiagnosisResults {
  business_excellence_index: number
  pilares: Array<{
    nombre: string
    eje1: number
    eje2: number
    impacto: number
  }>
  roadmap: RoadmapItem[]
}

export default function ResultsDashboardPage() {
  const { diagnosticoId } = useParams()

  // Mock data for Fase 8
  const results: DiagnosisResults = {
    business_excellence_index: 3.2,
    pilares: [
      { nombre: 'Business DNA', eje1: 3, eje2: 2, impacto: 500000 },
      { nombre: 'Strategy Alignment', eje1: 4, eje2: 3, impacto: 600000 },
      { nombre: 'Process Excellence', eje1: 2, eje2: 2, impacto: 750000 },
      { nombre: 'Operational Performance', eje1: 3, eje2: 3, impacto: 400000 }
    ],
    roadmap: [
      {
        id: '1',
        titulo: 'Implementar CRM Estándar',
        pilar_id: 5,
        fase_propuesta: 'quick_wins_30d',
        impacto_estimado_usd: 450000,
        esfuerzo_horas: 240,
        prioridad: 1
      },
      {
        id: '2',
        titulo: 'Definir OKRs Formales',
        pilar_id: 2,
        fase_propuesta: 'quick_wins_30d',
        impacto_estimado_usd: 250000,
        esfuerzo_horas: 80,
        prioridad: 2
      }
    ]
  }

  const radarData = results.pilares.map(p => ({
    pilar: p.nombre,
    eje1: p.eje1,
    eje2: p.eje2
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  const faseColors: Record<string, string> = {
    quick_wins_30d: 'bg-green-100 text-green-800',
    medium_90d: 'bg-blue-100 text-blue-800',
    medium_180d: 'bg-indigo-100 text-indigo-800',
    strategic_12m: 'bg-purple-100 text-purple-800',
    strategic_24m: 'bg-gray-100 text-gray-800'
  }

  const faseLabels: Record<string, string> = {
    quick_wins_30d: '🚀 Quick Wins (30 días)',
    medium_90d: '↗ Medium (90 días)',
    medium_180d: '◆ Medium (180 días)',
    strategic_12m: '▲ Strategic (12 meses)',
    strategic_24m: '🏆 Strategic (24 meses)'
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Business Excellence Index */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-signal rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2 font-display">Business Excellence Index</h1>
        <div className="text-6xl font-bold font-mono">{Math.round(results.business_excellence_index)}/5</div>
        <p className="text-lg opacity-90 mt-2">
          Promedio de madurez en los 11 pilares de excelencia empresarial
        </p>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-aibo-line">
        <h2 className="text-2xl font-bold text-aibo-navy mb-6 font-display">Madurez por Pilar (Dos Ejes)</h2>
        <div className="flex justify-center">
          <RadarChart data={radarData} width={600} height={600} />
        </div>
      </div>

      {/* Pilares Detalle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.pilares && results.pilares.map((pilar) => (
          <div key={pilar.nombre} className="bg-white rounded-lg shadow-md p-6 border border-aibo-line">
            <h3 className="text-lg font-bold text-aibo-navy mb-4 font-display">{pilar.nombre}</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-aibo-slate uppercase font-mono mb-1">Eje 1: Estado del Arte</div>
                <div className="text-3xl font-bold text-aibo-blue">{pilar.eje1}/5</div>
              </div>
              <div>
                <div className="text-xs text-aibo-slate uppercase font-mono mb-1">Eje 2: Segmento</div>
                <div className="text-3xl font-bold text-aibo-signal">{pilar.eje2}/5</div>
              </div>
            </div>

            {pilar.impacto > 0 && (
              <div className="pt-4 border-t border-aibo-line">
                <div className="text-xs text-aibo-slate uppercase font-mono mb-1">Impacto Estimado</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(pilar.impacto)}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Roadmap Priorizado */}
      <div className="bg-white rounded-lg shadow-md border border-aibo-line overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-aibo-navy to-aibo-blue text-white">
          <h2 className="text-2xl font-bold font-display">Roadmap de Transformación</h2>
          <p className="text-aibo-cloud text-sm mt-1">Iniciativas priorizadas por impacto y esfuerzo</p>
        </div>

        <div className="p-8 space-y-6">
          {Object.entries(
            results.roadmap.reduce(
              (acc, item) => {
                if (!acc[item.fase_propuesta]) {
                  acc[item.fase_propuesta] = []
                }
                acc[item.fase_propuesta].push(item)
                return acc
              },
              {} as Record<string, RoadmapItem[]>
            )
          ).map(([fase, items]) => (
            <div key={fase}>
              <h3 className="text-lg font-bold text-aibo-navy mb-4 font-display">
                {faseLabels[fase] || fase}
              </h3>

              <div className="space-y-3">
                {items.sort((a, b) => a.prioridad - b.prioridad).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-4 bg-aibo-cloud rounded-lg border border-aibo-line hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-aibo-navy">{item.titulo}</h4>
                      <p className="text-sm text-aibo-slate mt-1">
                        Esfuerzo estimado: {Math.round(item.esfuerzo_horas / 8)} días
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(item.impacto_estimado_usd)}
                      </div>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${faseColors[fase] || 'bg-gray-100'}`}>
                        P{item.prioridad}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pb-8">
        <button className="px-6 py-3 bg-aibo-blue text-white font-semibold rounded-lg hover:bg-aibo-blue-light transition-colors shadow-lg">
          ◆ Descargar Reporte
        </button>
        <button className="px-6 py-3 bg-aibo-navy text-white font-semibold rounded-lg hover:bg-aibo-ink transition-colors shadow-lg">
          ▬ Ver Propuesta de Consultoría
        </button>
      </div>
    </div>
  )
}
