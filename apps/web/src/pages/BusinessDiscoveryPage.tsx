import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'

interface DiscoveryData {
  // Empresa
  website_url: string
  nombre: string
  pais: string
  tamaño: string
  empleados: number
  facturacion_usd: number
  cobertura: string

  // Estrategia
  mision: string
  vision: string
  proposito: string
  objetivos_estrategicos: string
  okrs: string
  cultura: string
  valores: string
  liderazgo: string
  innovacion: string
  colaboracion: string
  gestion_cambio: string

  // Modelo de Negocio
  industria: string
  segmento: string
  subindustria: string
  tipo_empresa: string
  tipo_operacion: string
  oferta: string
  propuesta_valor: string
  clientes: string
  canal_adquisicion: string
  crm_quality: string
  metricas_comerciales: string

  // Tecnología
  tiene_crm: boolean
  crm_tipo: string
  tiene_erp: boolean
  erp_tipo: string
  tiene_work_management: boolean
  tiene_bi: boolean
  tiene_ia: boolean
  tiene_automatizacion: boolean
  automatizacion_desc: string
}

const INITIAL_DATA: DiscoveryData = {
  website_url: '',
  nombre: '',
  pais: '',
  tamaño: 'SMB',
  empleados: 0,
  facturacion_usd: 0,
  cobertura: '',
  mision: '',
  vision: '',
  proposito: '',
  objetivos_estrategicos: '',
  okrs: '',
  cultura: '',
  valores: '',
  liderazgo: '',
  innovacion: '',
  colaboracion: '',
  gestion_cambio: '',
  industria: '',
  segmento: '',
  subindustria: '',
  tipo_empresa: '',
  tipo_operacion: '',
  oferta: '',
  propuesta_valor: '',
  clientes: '',
  canal_adquisicion: '',
  crm_quality: '',
  metricas_comerciales: '',
  tiene_crm: false,
  crm_tipo: '',
  tiene_erp: false,
  erp_tipo: '',
  tiene_work_management: false,
  tiene_bi: false,
  tiene_ia: false,
  tiene_automatizacion: false,
  automatizacion_desc: ''
}

const STEPS = [
  { number: 1, title: 'Datos de Empresa' },
  { number: 2, title: 'Estrategia & Cultura' },
  { number: 3, title: 'Modelo de Negocio' },
  { number: 4, title: 'Tecnología' }
]

export default function BusinessDiscoveryPage() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [step, setStep] = useState(1)
  const [data, setData] = useState<DiscoveryData>(INITIAL_DATA)
  const [loading, setLoading] = useState(false)
  const [validatingWebsite, setValidatingWebsite] = useState(false)

  const handleChange = (field: keyof DiscoveryData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleValidateWebsite = async () => {
    if (!data.website_url.trim()) {
      alert('Por favor ingresa una URL del website')
      return
    }

    setValidatingWebsite(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/empresas/analyze-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ website_url: data.website_url })
      })

      if (response.ok) {
        const extractedData = await response.json()
        // Completar automáticamente los campos disponibles
        setData(prev => ({
          ...prev,
          nombre: extractedData.nombre || prev.nombre,
          pais: extractedData.pais || prev.pais,
          mision: extractedData.mision || prev.mision,
          vision: extractedData.vision || prev.vision,
          propuesta_valor: extractedData.propuesta_valor || prev.propuesta_valor,
          oferta: extractedData.oferta || prev.oferta,
          clientes: extractedData.clientes || prev.clientes,
          industria: extractedData.industria || prev.industria,
          subindustria: extractedData.subindustria || prev.subindustria
        }))
        alert('✅ Website validado. Formulario completado automáticamente con información encontrada.')
      } else {
        alert('No se pudo validar el website. Por favor verifica la URL e intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error validating website:', error)
      alert('Error al validar el website')
    } finally {
      setValidatingWebsite(false)
    }
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Guardar discovery data (implementar backend después)
      console.log('Saving discovery data:', data)

      // Avanzar a Fase 2
      await fetch(`/api/diagnosticos/${diagnosticoId}/phase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fase: 2 })
      })
      navigate(`/classification/${diagnosticoId}`)
    } catch (error) {
      alert('Error al guardar información')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-semibold font-display text-black mb-3 tracking-tight">
            Business Discovery
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Comprensión profunda de la empresa: estrategia, modelo operativo y capacidades tecnológicas
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-start gap-4">
          {STEPS.map((s, idx) => (
            <div key={s.number} className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${s.number <= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {s.number}
                </div>
                <p className={`text-xs font-medium ${s.number <= step ? 'text-black' : 'text-gray-400'}`}>
                  {s.title}
                </p>
              </div>
              {s.number < STEPS.length && (
                <div className={`h-px mx-8 ${s.number < step ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="space-y-6">
        {/* STEP 1: Datos de Empresa */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-display">Datos de la Empresa</h2>

            {/* Website URL + Validation */}
            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-black mb-3">Website de la Empresa</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={data.website_url}
                  onChange={e => handleChange('website_url', e.target.value)}
                  className="flex-1 px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="https://www.ejemplo.com"
                />
                <button
                  onClick={handleValidateWebsite}
                  disabled={validatingWebsite || !data.website_url.trim()}
                  className="px-4 py-2 text-sm font-semibold border border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {validatingWebsite ? 'Validando...' : 'Validar'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ingresa tu website para que IA complete automáticamente la información</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nombre de Empresa *</label>
                <input
                  type="text"
                  value={data.nombre}
                  onChange={e => handleChange('nombre', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">País *</label>
                <input
                  type="text"
                  value={data.pais}
                  onChange={e => handleChange('pais', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: México"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Tamaño</label>
                <select
                  value={data.tamaño}
                  onChange={e => handleChange('tamaño', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                >
                  <option value="Startup">Startup (&lt;50)</option>
                  <option value="SMB">SMB (50-500)</option>
                  <option value="Enterprise">Enterprise (&gt;500)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Empleados</label>
                <input
                  type="number"
                  value={data.empleados}
                  onChange={e => handleChange('empleados', parseInt(e.target.value) || 0)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Facturación Anual (USD)</label>
                <input
                  type="number"
                  value={data.facturacion_usd}
                  onChange={e => handleChange('facturacion_usd', parseFloat(e.target.value) || 0)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Cobertura Geográfica</label>
                <input
                  type="text"
                  value={data.cobertura}
                  onChange={e => handleChange('cobertura', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: LATAM, Global"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Estrategia */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-display">Estrategia & Cultura</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Misión</label>
                <textarea
                  value={data.mision}
                  onChange={e => handleChange('mision', e.target.value)}
                  rows={3}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Cuál es la misión de la empresa?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Visión</label>
                <textarea
                  value={data.vision}
                  onChange={e => handleChange('vision', e.target.value)}
                  rows={3}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Cuál es la visión a futuro?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Propósito</label>
                <textarea
                  value={data.proposito}
                  onChange={e => handleChange('proposito', e.target.value)}
                  rows={3}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Cuál es el propósito o razón de ser?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Objetivos Estratégicos</label>
                <textarea
                  value={data.objetivos_estrategicos}
                  onChange={e => handleChange('objetivos_estrategicos', e.target.value)}
                  rows={3}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Objetivos clave para los próximos años"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">OKRs (Objetivos y Resultados Clave)</label>
                <textarea
                  value={data.okrs}
                  onChange={e => handleChange('okrs', e.target.value)}
                  rows={3}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Describe los OKRs principales"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Cultura Organizacional</label>
                <textarea
                  value={data.cultura}
                  onChange={e => handleChange('cultura', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Cómo describirías la cultura?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Valores Principales</label>
                <textarea
                  value={data.valores}
                  onChange={e => handleChange('valores', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Valores que rigen la empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Liderazgo</label>
                <textarea
                  value={data.liderazgo}
                  onChange={e => handleChange('liderazgo', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Descripción del equipo de liderazgo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Innovación</label>
                <textarea
                  value={data.innovacion}
                  onChange={e => handleChange('innovacion', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Cómo innova la empresa?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Colaboración</label>
                <textarea
                  value={data.colaboracion}
                  onChange={e => handleChange('colaboracion', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Cómo colaboran los equipos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Gestión del Cambio</label>
                <textarea
                  value={data.gestion_cambio}
                  onChange={e => handleChange('gestion_cambio', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Cómo maneja la empresa el cambio?"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Modelo de Negocio */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-display">Modelo de Negocio</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Industria *</label>
                <select
                  value={data.industria}
                  onChange={e => handleChange('industria', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                >
                  <option value="">Selecciona</option>
                  <option value="BPO">BPO / Contact Center</option>
                  <option value="Retail">Retail</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Segmento</label>
                <input
                  type="text"
                  value={data.segmento}
                  onChange={e => handleChange('segmento', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: Enterprise, SMB, Startup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Sub-industria</label>
                <input
                  type="text"
                  value={data.subindustria}
                  onChange={e => handleChange('subindustria', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: Customer Service, Tech Support"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Tipo de Empresa</label>
                <input
                  type="text"
                  value={data.tipo_empresa}
                  onChange={e => handleChange('tipo_empresa', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: Privada, Pública, Joint Venture"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Tipo de Operación</label>
                <textarea
                  value={data.tipo_operacion}
                  onChange={e => handleChange('tipo_operacion', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: Operaciones propias, Outsourcing, Híbrido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Oferta (Productos/Servicios/Marcas)</label>
                <textarea
                  value={data.oferta}
                  onChange={e => handleChange('oferta', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Qué ofrece la empresa?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Propuesta de Valor</label>
                <textarea
                  value={data.propuesta_valor}
                  onChange={e => handleChange('propuesta_valor', e.target.value)}
                  rows={2}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="¿Qué valor único ofreces?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Clientes Principales</label>
                <input
                  type="text"
                  value={data.clientes}
                  onChange={e => handleChange('clientes', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: B2B, B2C, Enterprise, Government"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Canal de Adquisición Principal</label>
                <input
                  type="text"
                  value={data.canal_adquisicion}
                  onChange={e => handleChange('canal_adquisicion', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: Ventas directas, Marketing, Partnerships"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Calidad de CRM y Datos de Funnel</label>
                <select
                  value={data.crm_quality}
                  onChange={e => handleChange('crm_quality', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                >
                  <option value="">Selecciona</option>
                  <option value="Excelente">Excelente</option>
                  <option value="Buena">Buena</option>
                  <option value="Regular">Regular</option>
                  <option value="Pobre">Pobre</option>
                  <option value="No tienen">No tienen CRM formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Métricas Comerciales Formales</label>
                <input
                  type="text"
                  value={data.metricas_comerciales}
                  onChange={e => handleChange('metricas_comerciales', e.target.value)}
                  className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black"
                  placeholder="Ej: CAC, LTV, Conversión, Ciclo de venta"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Tecnología */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black font-display">Stack Tecnológico</h2>

            <div className="space-y-4">
              {/* CRM */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="crm"
                    checked={data.tiene_crm}
                    onChange={e => handleChange('tiene_crm', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="crm" className="font-medium text-black">Tiene CRM</label>
                </div>
                {data.tiene_crm && (
                  <input
                    type="text"
                    value={data.crm_tipo}
                    onChange={e => handleChange('crm_tipo', e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black text-sm"
                    placeholder="Ej: Salesforce, HubSpot, Pipedrive"
                  />
                )}
              </div>

              {/* ERP */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="erp"
                    checked={data.tiene_erp}
                    onChange={e => handleChange('tiene_erp', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="erp" className="font-medium text-black">Tiene ERP</label>
                </div>
                {data.tiene_erp && (
                  <input
                    type="text"
                    value={data.erp_tipo}
                    onChange={e => handleChange('erp_tipo', e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black text-sm"
                    placeholder="Ej: SAP, Oracle, NetSuite"
                  />
                )}
              </div>

              {/* Work Management */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="wm"
                    checked={data.tiene_work_management}
                    onChange={e => handleChange('tiene_work_management', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="wm" className="font-medium text-black">Tiene Work Management (Jira, Asana, etc.)</label>
                </div>
              </div>

              {/* BI */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bi"
                    checked={data.tiene_bi}
                    onChange={e => handleChange('tiene_bi', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="bi" className="font-medium text-black">Tiene BI/Analytics (Power BI, Tableau, Looker)</label>
                </div>
              </div>

              {/* IA */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ia"
                    checked={data.tiene_ia}
                    onChange={e => handleChange('tiene_ia', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="ia" className="font-medium text-black">Usa IA en operaciones</label>
                </div>
              </div>

              {/* Automatización */}
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="auto"
                    checked={data.tiene_automatizacion}
                    onChange={e => handleChange('tiene_automatizacion', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="auto" className="font-medium text-black">Tiene Automatización</label>
                </div>
                {data.tiene_automatizacion && (
                  <textarea
                    value={data.automatizacion_desc}
                    onChange={e => handleChange('automatizacion_desc', e.target.value)}
                    rows={2}
                    className="w-full px-0 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black text-black text-sm"
                    placeholder="Describe qué procesos están automatizados"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="flex-1 bg-transparent text-black border border-black font-semibold py-3 hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Atrás
        </button>

        {step < 4 ? (
          <button
            onClick={handleNext}
            className="flex-1 bg-black text-white font-semibold py-3 hover:bg-gray-900 transition-colors"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="flex-1 bg-black text-white font-semibold py-3 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Completar Discovery'}
          </button>
        )}
      </div>
      </div>
    </div>
  )
}
