import { useState } from 'react'
import { useAuthStore } from '../store/auth'

export default function BusinessDiscoveryPage() {
  const [step, setStep] = useState(1)
  const [empresaData, setEmpresaData] = useState({
    nombre: '',
    pais: '',
    industria: '',
    tamaño: '',
    empleados: '',
    facturacion_usd: ''
  })
  const [documentos, setDocumentos] = useState([])
  const [entrevista, setEntrevista] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmpresaData(prev => ({ ...prev, [name]: value }))
  }

  const handleDocumentoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        setDocumentos(prev => [...prev, { nombre: file.name, archivo: file }])
      })
    }
  }

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Submit empresa data
      const empresaResponse = await fetch('/api/empresas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(empresaData)
      })

      if (!empresaResponse.ok) throw new Error('Error creating empresa')

      const empresa = await empresaResponse.json()
      alert(`Empresa creada: ${empresa.nombre}`)
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error:', error)
      alert('Error en Business Discovery')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-8">
          <h1 className="text-3xl font-bold mb-2">Business Discovery</h1>
          <p className="text-lg opacity-90">Fase 1: Recopilación de Contexto</p>
        </div>

        {/* Progress indicator */}
        <div className="px-8 py-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className={`h-2 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
            </div>
            <span className="text-xs font-semibold text-neutral-600 ml-4">Paso {step}/3</span>
          </div>
          <div className="flex justify-between">
            <div className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-neutral-400'}`}>
              Datos Empresa
            </div>
            <div className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-neutral-400'}`}>
              Documentos
            </div>
            <div className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-neutral-400'}`}>
              Entrevista
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Datos Básicos de la Empresa</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={empresaData.nombre}
                    onChange={handleEmpresaChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Ej: Tech Solutions Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={empresaData.pais}
                    onChange={handleEmpresaChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Ej: Mexico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Industria
                  </label>
                  <input
                    type="text"
                    name="industria"
                    value={empresaData.industria}
                    onChange={handleEmpresaChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Ej: BPO, Retail, SaaS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tamaño de Empresa
                  </label>
                  <select
                    name="tamaño"
                    value={empresaData.tamaño}
                    onChange={handleEmpresaChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Selecciona...</option>
                    <option value="startup">Startup</option>
                    <option value="SMB">SMB</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Número de Empleados
                  </label>
                  <input
                    type="number"
                    name="empleados"
                    value={empresaData.empleados}
                    onChange={handleEmpresaChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Ej: 150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Facturación Anual (USD)
                  </label>
                  <input
                    type="number"
                    name="facturacion_usd"
                    value={empresaData.facturacion_usd}
                    onChange={handleEmpresaChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Ej: 5000000"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Documentos de Discovery</h2>
              <p className="text-neutral-600">
                Sube documentos financieros, estratégicos o comerciales que ayuden en el análisis.
              </p>

              <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentoUpload}
                  className="hidden"
                  id="documento-upload"
                />
                <label htmlFor="documento-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-primary font-semibold">Arrastra documentos aquí</p>
                  <p className="text-neutral-500 text-sm">o haz clic para seleccionar</p>
                </label>
              </div>

              {documentos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900">Documentos seleccionados:</h3>
                  {documentos.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                      <span>📄</span>
                      <span className="text-neutral-700">{doc.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Entrevista de Business Discovery</h2>
              <p className="text-neutral-600">
                Responde las siguientes preguntas o sube una grabación de entrevista.
              </p>

              <div className="space-y-4">
                <textarea
                  value={entrevista}
                  onChange={(e) => setEntrevista(e.target.value)}
                  className="w-full h-48 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Transcripción de entrevista con CEO/COO..."
                />

                <div className="text-center p-6 border border-dashed border-neutral-300 rounded-lg">
                  <button className="text-primary font-semibold hover:text-primary/80">
                    🎙️ Grabar Audio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-8 py-6 border-t border-neutral-200 flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={step === 1}
            className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Procesando...' : 'Completar Discovery'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
