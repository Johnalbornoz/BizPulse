import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import TypeformContainer from './TypeformContainer'
import TypeformCard from './TypeformCard'
import TypeformHeading from './TypeformHeading'
import TypeformProgressBar from './TypeformProgressBar'
import TypeformButton from './TypeformButton'

interface TypeformPhaseContainerProps {
  phaseNumber: number
  totalPhases: number
  title: string
  subtitle?: string
  children: ReactNode
  onNext?: () => void | Promise<void>
  onBack?: () => void
  nextLabel?: string
  backLabel?: string
  isLoading?: boolean
  canProceed?: boolean
}

export default function TypeformPhaseContainer({
  phaseNumber,
  totalPhases,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continuar →',
  backLabel = '← Atrás',
  isLoading = false,
  canProceed = true,
}: TypeformPhaseContainerProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    }
  }

  return (
    <TypeformContainer gradient="primary">
      <div className="space-y-8">
        {/* Header */}
        <TypeformCard>
          <div className="space-y-6">
            <TypeformProgressBar current={phaseNumber} total={totalPhases} />
            <TypeformHeading subtitle={subtitle}>
              {title}
            </TypeformHeading>
          </div>
        </TypeformCard>

        {/* Content */}
        <TypeformCard>
          <div className="space-y-8">
            {children}
          </div>
        </TypeformCard>

        {/* Navigation */}
        <TypeformCard>
          <div className="flex gap-4 justify-between">
            <TypeformButton
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={isLoading}
            >
              {backLabel}
            </TypeformButton>

            <TypeformButton
              size="lg"
              onClick={handleNext}
              loading={isLoading}
              disabled={!canProceed || isLoading}
            >
              {nextLabel}
            </TypeformButton>
          </div>
        </TypeformCard>
      </div>
    </TypeformContainer>
  )
}
