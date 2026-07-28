import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import {
  TypeformContainer,
  TypeformCard,
  TypeformHeading,
  TypeformInput,
  TypeformButton,
} from '../components/Typeform'

type FormStep = 'welcome' | 'email' | 'password' | 'loading'

export default function LoginPage() {
  const [step, setStep] = useState<FormStep>('welcome')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()

  const handleEmailNext = () => {
    if (email.trim()) {
      setError('')
      setStep('password')
    } else {
      setError('Ingresa un email válido')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setStep('loading')

    try {
      await login(email, password)
    } catch (err) {
      setError('Email o contraseña incorrectos')
      setStep('password')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setError('')
    if (step === 'password') {
      setStep('email')
    } else if (step === 'email') {
      setStep('welcome')
    }
  }

  return (
    <TypeformContainer gradient="primary">
      {/* Welcome Step */}
      {step === 'welcome' && (
        <TypeformCard>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-aibo-blue to-aibo-signal shadow-lg">
                <span className="text-3xl">◆</span>
              </div>
              <TypeformHeading>Bienvenido a BizPulse</TypeformHeading>
              <p className="text-xl text-aibo-slate leading-relaxed">
                Diagnóstico de Excelencia Empresarial en dos ejes
              </p>
            </div>

            <TypeformButton
              size="lg"
              onClick={() => setStep('email')}
            >
              Comenzar →
            </TypeformButton>
          </div>
        </TypeformCard>
      )}

      {/* Email Step */}
      {step === 'email' && (
        <TypeformCard>
          <div className="space-y-8">
            <TypeformHeading subtitle="Usaremos esto para acceder a tu cuenta">
              ¿Cuál es tu email?
            </TypeformHeading>

            <div
              onKeyPress={(e) => e.key === 'Enter' && handleEmailNext()}
            >
              <TypeformInput
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="tu@email.com"
                error={error}
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <TypeformButton
                variant="outline"
                size="lg"
                onClick={handleBack}
                fullWidth
              >
                Atrás
              </TypeformButton>
              <TypeformButton
                size="lg"
                onClick={handleEmailNext}
                fullWidth
              >
                Continuar →
              </TypeformButton>
            </div>
          </div>
        </TypeformCard>
      )}

      {/* Password Step */}
      {step === 'password' && (
        <TypeformCard>
          <div className="space-y-8">
            <TypeformHeading subtitle="Verifica tu identidad para continuar">
              ¿Cuál es tu contraseña?
            </TypeformHeading>

            <div
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
            >
              <TypeformInput
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••••"
                error={error}
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <TypeformButton
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={loading}
                fullWidth
              >
                Atrás
              </TypeformButton>
              <TypeformButton
                size="lg"
                onClick={handleSubmit}
                loading={loading}
                fullWidth
              >
                Iniciar sesión
              </TypeformButton>
            </div>
          </div>
        </TypeformCard>
      )}

      {/* Loading Step */}
      {step === 'loading' && (
        <TypeformCard>
          <div className="text-center space-y-8 py-8">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-aibo-mist"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-aibo-blue border-r-aibo-signal animate-spin"></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-aibo-navy">
                Validando tu cuenta
              </p>
              <p className="text-aibo-slate">
                Un momento mientras verificamos tus credenciales...
              </p>
            </div>
          </div>
        </TypeformCard>
      )}
    </TypeformContainer>
  )
}
