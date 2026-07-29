import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import HeroSection from '../components/HeroSection'
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
    <div className="relative min-h-screen bg-white overflow-hidden">
      <HeroSection />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-24">
      {/* Welcome Step */}
      {step === 'welcome' && (
        <div className="w-full h-full flex items-center justify-start px-12 md:px-20">
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-bold font-display text-black tracking-tighter leading-none">
                BizPulse
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-transparent" />
            </div>

            <div className="space-y-6">
              <p className="text-3xl md:text-4xl font-light text-gray-800 leading-snug">
                Diagnóstico de Excelencia Empresarial
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-light max-w-xl">
                Análisis profundo del estado actual del negocio y su comparación vs. segmento/competencia
              </p>
            </div>

            <div className="pt-12">
              <TypeformButton
                size="lg"
                onClick={() => setStep('email')}
              >
                Comenzar →
              </TypeformButton>
            </div>
          </div>
        </div>
      )}

      {/* Email Step */}
      {step === 'email' && (
        <div className="space-y-8 px-4 max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold font-display text-black">
              ¿Cuál es tu email?
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Usaremos esto para acceder a tu cuenta
            </p>
          </div>

          <div
            onKeyPress={(e) => e.key === 'Enter' && handleEmailNext()}
            className="space-y-6"
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

          <div className="flex gap-4 pt-4">
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
      )}

      {/* Password Step */}
      {step === 'password' && (
        <div className="space-y-8 px-4 max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold font-display text-black">
              ¿Cuál es tu contraseña?
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Verifica tu identidad para continuar
            </p>
          </div>

          <div
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
            className="space-y-6"
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

          <div className="flex gap-4 pt-4">
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
      )}

      {/* Loading Step */}
      {step === 'loading' && (
        <div className="text-center space-y-8 py-8 px-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 border-r-cyan-400 animate-spin"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-black">
              Validando tu cuenta
            </p>
            <p className="text-gray-600">
              Un momento mientras verificamos tus credenciales...
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
