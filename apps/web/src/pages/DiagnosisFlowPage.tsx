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
      icon: '→',
      status: 'in_progress',
      route: `/discovery/${diagnosticoId}`,
      gradient: 'from-blue-400 to-aibo-blue'
    },
    {
      number: 2,
      title: 'Business Classification',
      description: 'IA clasifica industria, modelo de negocio y modelo operativo',
      icon: '▬',
      status: 'pending',
      route: `/classification/${diagnosticoId}`,
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      number: 3,
      title: 'Framework Selection',
      description: 'Seleccionar marco de evaluación (11 pilares de excelencia)',
      icon: '▲',
      status: 'pending',
      route: `/framework/${diagnosticoId}`,
      gradient: 'from-purple-400 to-indigo-500'
    },
    {
      number: 4,
      title: 'Adaptive Assessment',
      description: 'Cuestionario adaptativo: responder preguntas por pilar',
      icon: '◆',
      status: 'pending',
      route: `/assessment/${diagnosticoId}`,
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      number: 5,
      title: 'Business Excellence Diagnosis',
      description: 'IA sugiere scores en dos ejes; Consultor valida',
      icon: '💎',
      status: 'pending',
      route: `/validation/${diagnosticoId}`,
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      number: 6,
      title: 'Gap Analysis + Financial Impact',
      description: 'Cada brecha cuantificada en ROI y impacto financiero',
      icon: '💰',
      status: 'pending',
      route: `/financial/${diagnosticoId}`,
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      number: 7,
      title: 'Transformation Roadmap',
      description: 'Priorizar iniciativas por impacto/esfuerzo',
      icon: '🗺️',
      status: 'pending',
      route: `/roadmap/${diagnosticoId}`,
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      number: 8,
      title: 'Sales & Consulting Proposal',
      description: 'Generar SOW estructurado en fases (30d, 90d, 180d, 12-24m)',
      icon: '🚀',
      status: 'pending',
      route: `/proposal/${diagnosticoId}`,
      gradient: 'from-aibo-signal to-emerald-600'
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
                <span className="text-4xl">▲</span>
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
                  h-full bg-gradient-to-br ${phase.gradient}
                  rounded-2xl p-6 text-white
                  shadow-lg group-hover:shadow-xl
                  transition-all duration-300
                  ${phase.number === currentPhase ? 'ring-2 ring-white ring-offset-4 ring-offset-aibo-cloud' : ''}
                  ${(isConsultor || phase.number === 1) && phase.number !== currentPhase ? 'group-hover:scale-105 group-hover:-translate-y-1' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Phase Number */}
                  <div className="flex-shrink-0">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                      bg-white/20 backdrop-blur-sm
                      border-2 border-white/40
                    `}>
                      {phase.icon}
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
                      <div className="mt-3 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Completado
                      </div>
                    )}
                    {phase.status === 'in_progress' && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-white/30 px-3 py-1 rounded-full text-sm font-semibold">
                        ⚡ En progreso
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  {(isConsultor || phase.number === 1) && (
                    <div className="flex-shrink-0 text-2xl opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      →
                    </div>
                  )}
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
                  <span className="text-2xl">👤</span>
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
                  <span className="text-2xl">🎓</span>
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
