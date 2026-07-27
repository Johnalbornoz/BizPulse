import { useState } from 'react'
import { useAuthStore } from '../store/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-neutral-900 mb-2">BizPulse</h1>
          <p className="text-center text-neutral-600 mb-8">Diagnóstico de Excelencia Empresarial</p>

          {error && (
            <div className="mb-4 p-4 bg-error/10 border border-error text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
