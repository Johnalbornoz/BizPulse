import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import {
  TypeformPhaseContainer,
  TypeformInput,
  TypeformSelect,
  TypeformCheckbox,
  TypeformTextarea,
  TypeformRadioGroup,
} from '../components/Typeform'

interface DiscoveryData {
  website_url: string
  nombre: string
  pais: string
  tamaño: string
  empleados: number
  facturacion_usd: number
  cobertura: string
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
  { number: 1, title: 'Datos de Empresa', icon: '🏢' },
  { number: 2, title: 'Estrategia & Cultura', icon: '🎯' },
  { number: 3, title: 'Modelo de Negocio', icon: '💼' },
  { number: 4, title: 'Tecnología', icon: '⚙️' }
]

type StepNumber = 1 | 2 | 3 | 4

export default function BusinessDiscoveryPageImproved() {
  const { diagnosticoId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [data, setData] = useState<DiscoveryData>(INITIAL_DATA)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof DiscoveryData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!data.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
      if (!data.pais.trim()) newErrors.pais = 'El país es requerido'
      if (data.empleados <= 0) newErrors.empleados = 'El número de empleados es requerido'
    } else if (currentStep === 2) {
      if (!data.mision.trim()) newErrors.mision = 'La misión es requerida'
      if (!data.vision.trim()) newErrors.vision = 'La visión es requerida'
    } else if (currentStep === 3) {
      if (!data.industria.trim()) newErrors.industria = 'La industria es requerida'
      if (!data.oferta.trim()) newErrors.oferta = 'La oferta es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateStep()) return

    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as StepNumber)
    } else {
      await handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepNumber)
    } else {
      navigate(`/diagnosis/${diagnosticoId}`)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${apiUrl}/diagnosticos/${diagnosticoId}/discovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        navigate(`/classification/${diagnosticoId}`)
      } else {
        setErrors({ submit: 'Error al guardar los datos' })
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <TypeformInput
              label="Nombre de la Empresa"
              value={data.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Tech Solutions Inc."
              error={errors.nombre}
              autoFocus
            />

            <TypeformInput
              label="Website"
              type="url"
              value={data.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              placeholder="https://ejemplo.com"
              helperText="Opcional: nos ayuda a conocer más de tu empresa"
            />

            <TypeformSelect
              label="País"
              options={[
                { value: 'MX', label: 'México' },
                { value: 'CO', label: 'Colombia' },
                { value: 'AR', label: 'Argentina' },
                { value: 'CL', label: 'Chile' },
                { value: 'PE', label: 'Perú' },
                { value: 'US', label: 'Estados Unidos' },
              ]}
              value={data.pais}
              onChange={(e) => handleInputChange('pais', e.target.value)}
              error={errors.pais}
            />

            <TypeformRadioGroup
              label="Tamaño de Empresa"
              options={[
                { value: 'Startup', label: 'Startup', description: 'Menos de 50 empleados' },
                { value: 'SMB', label: 'Pyme (SMB)', description: '50 - 500 empleados' },
                { value: 'Mid-Market', label: 'Mid-Market', description: '500 - 2,000 empleados' },
                { value: 'Enterprise', label: 'Enterprise', description: 'Más de 2,000 empleados' },
              ]}
              value={data.tamaño}
              onChange={(value) => handleInputChange('tamaño', value)}
            />

            <TypeformInput
              label="Número de Empleados"
              type="number"
              value={data.empleados}
              onChange={(e) => handleInputChange('empleados', parseInt(e.target.value))}
              placeholder="0"
              error={errors.empleados}
            />

            <TypeformInput
              label="Facturación Anual (USD)"
              type="number"
              value={data.facturacion_usd}
              onChange={(e) => handleInputChange('facturacion_usd', parseFloat(e.target.value))}
              placeholder="0"
              helperText="Monto estimado en dólares estadounidenses"
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <TypeformTextarea
              label="Misión"
              value={data.mision}
              onChange={(e) => handleInputChange('mision', e.target.value)}
              placeholder="¿Cuál es la razón de ser de tu empresa?"
              error={errors.mision}
              showCharCount
              maxLength={500}
              autoFocus
            />

            <TypeformTextarea
              label="Visión"
              value={data.vision}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              placeholder="¿Hacia dónde quieres llevar tu empresa?"
              error={errors.vision}
              showCharCount
              maxLength={500}
            />

            <TypeformTextarea
              label="Valores Corporativos"
              value={data.valores}
              onChange={(e) => handleInputChange('valores', e.target.value)}
              placeholder="Ej: Integridad, Innovación, Excelencia..."
              showCharCount
              maxLength={300}
            />

            <TypeformTextarea
              label="Cultura Organizacional"
              value={data.cultura}
              onChange={(e) => handleInputChange('cultura', e.target.value)}
              placeholder="Describe la cultura de tu empresa"
              showCharCount
              maxLength={500}
            />

            <TypeformCheckbox
              label="¿Tiene un programa de innovación establecido?"
              checked={data.tiene_ia}
              onChange={(e) => handleInputChange('tiene_ia', e.target.checked)}
              helperText="Iniciativas, departamentos o procesos para innovación"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <TypeformSelect
              label="Industria Principal"
              options={[
                { value: 'Tecnología', label: 'Tecnología' },
                { value: 'Manufactura', label: 'Manufactura' },
                { value: 'Retail', label: 'Retail' },
                { value: 'Servicios Financieros', label: 'Servicios Financieros' },
                { value: 'Salud', label: 'Salud' },
                { value: 'Educación', label: 'Educación' },
                { value: 'Otras', label: 'Otras' },
              ]}
              value={data.industria}
              onChange={(e) => handleInputChange('industria', e.target.value)}
              error={errors.industria}
            />

            <TypeformTextarea
              label="Propuesta de Valor"
              value={data.propuesta_valor}
              onChange={(e) => handleInputChange('propuesta_valor', e.target.value)}
              placeholder="¿Qué valor único ofreces a tus clientes?"
              error={errors.oferta}
              showCharCount
              maxLength={500}
            />

            <TypeformTextarea
              label="Descripción de Productos/Servicios"
              value={data.oferta}
              onChange={(e) => handleInputChange('oferta', e.target.value)}
              placeholder="Describe tu oferta principal"
              error={errors.oferta}
              showCharCount
              maxLength={500}
              autoFocus
            />

            <TypeformInput
              label="Segmento de Clientes Principales"
              value={data.segmento}
              onChange={(e) => handleInputChange('segmento', e.target.value)}
              placeholder="Ej: Empresas medianas B2B"
            />

            <TypeformSelect
              label="Canal Principal de Adquisición"
              options={[
                { value: 'Ventas Directas', label: 'Ventas Directas' },
                { value: 'Marketing Digital', label: 'Marketing Digital' },
                { value: 'Asociaciones', label: 'Asociaciones' },
                { value: 'Retail', label: 'Retail' },
                { value: 'Múltiples', label: 'Múltiples Canales' },
              ]}
              value={data.canal_adquisicion}
              onChange={(e) => handleInputChange('canal_adquisicion', e.target.value)}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-aibo-navy">Infraestructura Tecnológica</h3>

              <TypeformCheckbox
                label="¿Utilizas un CRM?"
                checked={data.tiene_crm}
                onChange={(e) => handleInputChange('tiene_crm', e.target.checked)}
                helperText="Sistema de Gestión de Relaciones con Clientes"
              />

              {data.tiene_crm && (
                <TypeformInput
                  label="¿Cuál CRM utilizas?"
                  value={data.crm_tipo}
                  onChange={(e) => handleInputChange('crm_tipo', e.target.value)}
                  placeholder="Ej: Salesforce, HubSpot, Pipedrive..."
                />
              )}

              <TypeformCheckbox
                label="¿Utilizas un ERP?"
                checked={data.tiene_erp}
                onChange={(e) => handleInputChange('tiene_erp', e.target.checked)}
                helperText="Sistema de Planificación de Recursos Empresariales"
              />

              {data.tiene_erp && (
                <TypeformInput
                  label="¿Cuál ERP utilizas?"
                  value={data.erp_tipo}
                  onChange={(e) => handleInputChange('erp_tipo', e.target.value)}
                  placeholder="Ej: SAP, Oracle, NetSuite..."
                />
              )}

              <TypeformCheckbox
                label="¿Utilizas herramientas de Business Intelligence?"
                checked={data.tiene_bi}
                onChange={(e) => handleInputChange('tiene_bi', e.target.checked)}
                helperText="Herramientas para análisis y visualización de datos"
              />

              <TypeformCheckbox
                label="¿Utilizas herramientas de IA?"
                checked={data.tiene_ia}
                onChange={(e) => handleInputChange('tiene_ia', e.target.checked)}
                helperText="Machine Learning, NLP, u otras soluciones de IA"
              />

              <TypeformCheckbox
                label="¿Tienes procesos automatizados?"
                checked={data.tiene_automatizacion}
                onChange={(e) => handleInputChange('tiene_automatizacion', e.target.checked)}
                helperText="RPA, flujos automatizados, etc."
              />

              {data.tiene_automatizacion && (
                <TypeformTextarea
                  label="Describe tus automatizaciones"
                  value={data.automatizacion_desc}
                  onChange={(e) => handleInputChange('automatizacion_desc', e.target.value)}
                  placeholder="¿Qué procesos están automatizados?"
                  showCharCount
                  maxLength={300}
                />
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <TypeformPhaseContainer
      phaseNumber={1}
      totalPhases={8}
      title={STEPS[currentStep - 1].title}
      subtitle={`Paso ${currentStep} de ${STEPS.length}: ${STEPS[currentStep - 1].title}`}
      onNext={handleNext}
      onBack={handleBack}
      isLoading={loading}
      nextLabel={currentStep === 4 ? 'Guardar y Continuar →' : 'Siguiente →'}
    >
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
          {errors.submit}
        </div>
      )}
      {renderStep()}
    </TypeformPhaseContainer>
  )
}
