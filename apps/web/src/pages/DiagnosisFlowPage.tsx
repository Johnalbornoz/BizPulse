import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/auth'

interface DiagnosisPhase {
  number: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  route: string
}

export default function DiagnosisFlowPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentPhase, setCurrentPhase] = useState(1)

  const phases: DiagnosisPhase[] = [
    {
      number: 1,
      title: 'Business Discovery',
      description: 'Recopilar contexto empresarial: datos básicos, documentos, entrevistas',
      status: 'in_progress',
      route: `/discovery/${diagnosticoId}`
    },
    {
      number: 2,
      title: 'Business Classification',
      description: 'IA clasifica industria, modelo de negocio y modelo operativo',
      status: 'pending',
      route: `/classification/${diagnosticoId}`
    },
    {
      number: 3,
      title: 'Framework Selection',
      description: 'Seleccionar marco de evaluación (11 pilares de excelencia)',
      status: 'pending',
      route: `/framework/${diagnosticoId}`
    },
    {
      number: 4,
      title: 'Adaptive Assessment',
      description: 'Cuestionario adaptativo: responder preguntas por pilar',
      status: 'pending',
      route: `/assessment/${diagnosticoId}`
    },
    {
      number: 5,
      title: 'Business Excellence Diagnosis',
      description: 'IA sugiere scores en dos ejes; Consultor valida',
      status: 'pending',
      route: `/validation/${diagnosticoId}`
    },
    {
      number: 6,
      title: 'Gap Analysis + Financial Impact',
      description: 'Cada brecha cuantificada en ROI y impacto financiero',
      status: 'pending',
      route: `/financial/${diagnosticoId}`
    },
    {
      number: 7,
      title: 'Transformation Roadmap',
      description: 'Priorizar iniciativas por impacto/esfuerzo',
      status: 'pending',
      route: `/roadmap/${diagnosticoId}`
    },
    {
      number: 8,
      title: 'Sales & Consulting Proposal',
      description: 'Generar SOW estructurado en fases (30d, 90d, 180d, 12-24m)',
      status: 'pending',
      route: `/proposal/${diagnosticoId}`
    }
  ]

  const isConsultor = user?.rol === 'Consultor' || user?.rol === 'SuperAdmin'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-aibo-blue to-aibo-navy rounded-lg shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-display">Diagnóstico de Excelencia Empresarial</h1>
            <p className="text-lg opacity-90 mt-2">Flujo de 8 fases hacia la transformación</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">Fase {currentPhase} de 8</p>
            <p className="text-sm opacity-75 mt-1">{Math.round((currentPhase / 8) * 100)}% completado</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="w-full bg-aibo-mist rounded-full h-2">
          <div
            className="bg-gradient-to-r from-aibo-blue to-aibo-signal h-2 rounded-full transition-all"
            style={{ width: `${(currentPhase / 8) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-aibo-slate mt-2">
          <span>Inicio</span>
          <span>Propuesta de Consultoría</span>
        </div>
      </div>

      {/* Phases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phases.map((phase) => (
          <button
            key={phase.number}
            onClick={() => navigate(phase.route)}
            disabled={!isConsultor && phase.number > 1}
            className={`
              p-6 rounded-lg border-2 transition-all text-left
              ${phase.number === currentPhase
                ? 'bg-aibo-blue/10 border-aibo-blue shadow-lg'
                : phase.status === 'completed'
                  ? 'bg-aibo-signal/10 border-aibo-signal'
                  : 'bg-white border-aibo-line hover:shadow-md'
              }
              ${(!isConsultor && phase.number > 1) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold
                ${phase.number === currentPhase
                  ? 'bg-aibo-blue text-white'
                  : phase.status === 'completed'
                    ? 'bg-aibo-signal text-white'
                    : 'bg-aibo-mist text-aibo-slate'
                }
              `}>
                {phase.number}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-aibo-navy font-display">
                  {phase.title}
                </h3>
                <p className="text-sm text-aibo-slate mt-1">{phase.description}</p>
                {phase.status === 'completed' && (
                  <span className="inline-block mt-2 text-xs bg-aibo-signal text-white px-2 py-1 rounded">
                    ✓ Completado
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Box for Users */}
      {!isConsultor && (
        <div className="bg-aibo-cloud rounded-lg p-6 border border-aibo-line">
          <h3 className="font-semibold text-aibo-navy mb-2">Vista de CEO/Ejecutivo</h3>
          <p className="text-sm text-aibo-slate">
            Completa la Fase 1 (Business Discovery) respondiendo al cuestionario. El consultor se encargará del resto del diagnóstico.
          </p>
        </div>
      )}

      {isConsultor && (
        <div className="bg-aibo-blue/5 rounded-lg p-6 border border-aibo-blue/20">
          <h3 className="font-semibold text-aibo-navy mb-2">Vista de Consultor</h3>
          <p className="text-sm text-aibo-slate">
            Tienes acceso a todas las fases. Guía al cliente a través de Business Discovery, luego valida y enriquece cada fase.
          </p>
        </div>
      )}
    </div>
  )
}
