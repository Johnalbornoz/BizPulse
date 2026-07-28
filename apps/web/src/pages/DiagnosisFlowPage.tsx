import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import {
  TypeformContainer,
  TypeformCard,
  TypeformHeading,
  TypeformButton,
  TypeformProgressBar,
} from '../components/Typeform'

interface DiagnosisPhase {
  number: number
  title: string
  description: string
  icon: string
  status: 'pending' | 'in_progress' | 'completed'
  route: string
  gradient: string
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
      description: 'Comprensión profunda de la empresa: contexto, documentos, perspectiva de liderazgo',
      status: 'in_progress',
      route: `/discovery/${diagnosticoId}`,
      color: 'border-gray-900'
    },
    {
      number: 2,
      title: 'Business Classification',
      description: 'Análisis de industria, modelo operativo y posicionamiento competitivo',
      status: 'pending',
      route: `/classification/${diagnosticoId}`,
      color: 'border-gray-700'
    },
    {
      number: 3,
      title: 'Framework Selection',
      description: 'Construcción dinámica del diagnóstico con 11 pilares de excelencia',
      status: 'pending',
      route: `/framework/${diagnosticoId}`,
      color: 'border-gray-600'
    },
    {
      number: 4,
      title: 'Adaptive Assessment',
      description: 'Evaluación inteligente: cuestionario adaptado a tu realidad empresarial',
      status: 'pending',
      route: `/assessment/${diagnosticoId}`,
      color: 'border-gray-600'
    },
    {
      number: 5,
      title: 'Excellence Scoring',
      description: 'Calificación en dos dimensiones: estado actual vs. estado del arte',
      status: 'pending',
      route: `/validation/${diagnosticoId}`,
      color: 'border-gray-700'
    },
    {
      number: 6,
      title: 'Financial Impact Analysis',
      description: 'Cuantificación de brechas en ROI, flujo de caja e impacto en rentabilidad',
      status: 'pending',
      route: `/financial/${diagnosticoId}`,
      color: 'border-gray-800'
    },
    {
      number: 7,
      title: 'Transformation Roadmap',
      description: 'Plan de acción priorizado: iniciativas de impacto máximo con mínimo esfuerzo',
      status: 'pending',
      route: `/roadmap/${diagnosticoId}`,
      color: 'border-gray-900'
    },
    {
      number: 8,
      title: 'Proposal & Commitment',
      description: 'Propuesta estructurada de consultoría con fases, plazos y compromisos claros',
      status: 'pending',
      route: `/proposal/${diagnosticoId}`,
      color: 'border-black'
    }
  ]

  const isConsultor = user?.rol === 'Consultor' || user?.rol === 'SuperAdmin'

  return (
    <TypeformContainer gradient="secondary">
      <div className="space-y-8">
        {/* Header */}
        <TypeformCard>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-aibo-blue to-aibo-signal shadow-2xl flex items-center justify-center">
                
              </div>
            </div>
            <div>
              <TypeformHeading>Diagnóstico de Excelencia</TypeformHeading>
              <p className="text-xl text-aibo-slate">
                Flujo de 8 fases hacia la transformación empresarial
              </p>
            </div>
            <TypeformProgressBar current={currentPhase} total={8} />
          </div>
        </TypeformCard>

        {/* Phases Grid */}
        <div className="space-y-3">
          {phases.map((phase, index) => (
            <button
              key={phase.number}
              onClick={() => {
                if (isConsultor || phase.number === 1) {
                  setCurrentPhase(phase.number)
                  navigate(phase.route)
                }
              }}
              disabled={!isConsultor && phase.number > 1}
              className={`
                w-full group transition-all duration-300
                animate-slideIn
                ${isConsultor || phase.number === 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`
                  h-full bg-white border-l-4 ${phase.color}
                  rounded-lg px-6 py-5 text-black
                  shadow-sm hover:shadow-sm
                  transition-all duration-200
                  ${phase.number === currentPhase ? 'ring-1 ring-gray-300' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Phase Number */}
                  <div className="flex-shrink-0 pt-0.5">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      text-gray-500
                    `}>
                      {phase.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="text-lg font-semibold font-display tracking-tight text-black">
                        {phase.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {phase.description}
                    </p>
                    {phase.status === 'completed' && (
                      <div className="inline-flex items-center text-xs font-medium text-gray-500">
                        ✓ Completado
                      </div>
                    )}
                    {phase.status === 'in_progress' && (
                      <div className="inline-flex items-center text-xs font-medium text-gray-600">
                        → En progreso
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Role Information */}
        <TypeformCard>
          <div className="space-y-4">
            {!isConsultor && (
              <div>
                <div className="flex items-start gap-3 mb-3">
                  
                  <div>
                    <h4 className="font-bold text-lg text-aibo-navy mb-1">Vista de CEO/Ejecutivo</h4>
                    <p className="text-aibo-slate">
                      Completa la Fase 1 (Business Discovery) respondiendo al cuestionario. El consultor se encargará del resto del diagnóstico.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isConsultor && (
              <div>
                <div className="flex items-start gap-3">
                  
                  <div>
                    <h4 className="font-bold text-lg text-aibo-navy mb-1">Vista de Consultor</h4>
                    <p className="text-aibo-slate">
                      Tienes acceso a todas las fases. Guía al cliente a través de Business Discovery, luego valida y enriquece cada fase.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TypeformCard>

        {/* Back Button */}
        <div className="flex justify-center">
          <TypeformButton
            variant="outline"
            onClick={() => navigate('/')}
          >
            ← Volver al Dashboard
          </TypeformButton>
        </div>
      </div>
    </TypeformContainer>
  )
}
