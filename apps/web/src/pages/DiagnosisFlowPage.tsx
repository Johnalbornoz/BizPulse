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
      description: 'Recopilar contexto empresarial: datos básicos, documentos, entrevistas',
      status: 'in_progress',
      route: `/discovery/${diagnosticoId}`,
      color: 'border-aibo-blue'
    },
    {
      number: 2,
      title: 'Business Classification',
      description: 'IA clasifica industria, modelo de negocio y modelo operativo',
      status: 'pending',
      route: `/classification/${diagnosticoId}`,
      color: 'border-blue-500'
    },
    {
      number: 3,
      title: 'Framework Selection',
      description: 'Seleccionar marco de evaluación (11 pilares de excelencia)',
      status: 'pending',
      route: `/framework/${diagnosticoId}`,
      color: 'border-purple-500'
    },
    {
      number: 4,
      title: 'Adaptive Assessment',
      description: 'Cuestionario adaptativo: responder preguntas por pilar',
      status: 'pending',
      route: `/assessment/${diagnosticoId}`,
      color: 'border-indigo-500'
    },
    {
      number: 5,
      title: 'Business Excellence Diagnosis',
      description: 'IA sugiere scores en dos ejes; Consultor valida',
      status: 'pending',
      route: `/validation/${diagnosticoId}`,
      color: 'border-rose-500'
    },
    {
      number: 6,
      title: 'Gap Analysis + Financial Impact',
      description: 'Cada brecha cuantificada en ROI y impacto financiero',
      status: 'pending',
      route: `/financial/${diagnosticoId}`,
      color: 'border-orange-500'
    },
    {
      number: 7,
      title: 'Transformation Roadmap',
      description: 'Priorizar iniciativas por impacto/esfuerzo',
      status: 'pending',
      route: `/roadmap/${diagnosticoId}`,
      color: 'border-teal-500'
    },
    {
      number: 8,
      title: 'Sales & Consulting Proposal',
      description: 'Generar SOW estructurado en fases (30d, 90d, 180d, 12-24m)',
      status: 'pending',
      route: `/proposal/${diagnosticoId}`,
      color: 'border-emerald-600'
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
        <div className="space-y-4">
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
                w-full group p-6 rounded-2xl transition-all duration-300
                animate-slideIn
                ${isConsultor || phase.number === 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`
                  h-full bg-white border-l-4 ${phase.color}
                  rounded-lg p-6 text-black
                  shadow-sm hover:shadow-md
                  transition-all duration-300
                  ${phase.number === currentPhase ? 'ring-1 ring-gray-medium' : ''}
                  ${(isConsultor || phase.number === 1) && phase.number !== currentPhase ? 'group-hover:translate-x-1' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Phase Number */}
                  <div className="flex-shrink-0">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      bg-gray-light border border-gray-medium
                      text-gray-dark
                    `}>
                      {phase.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold font-display">
                        {phase.title}
                      </h3>
                      <span className="text-sm font-semibold opacity-90">
                        Paso {phase.number}/8
                      </span>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {phase.description}
                    </p>
                    {phase.status === 'completed' && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-gray-light px-3 py-1 rounded-full text-xs font-semibold text-gray-dark border border-gray-medium">
                        Completado
                      </div>
                    )}
                    {phase.status === 'in_progress' && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-gray-light px-3 py-1 rounded-full text-xs font-semibold text-gray-dark border border-gray-medium">
                        En progreso
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
