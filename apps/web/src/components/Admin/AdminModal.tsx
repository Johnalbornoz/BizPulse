import { useState } from 'react'

interface Field {
  key: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea'
  required?: boolean
  options?: Array<{ value: string | number; label: string }>
  placeholder?: string
}

interface AdminModalProps {
  title: string
  fields: Field[]
  initialData?: Record<string, any>
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onSubmit: (data: Record<string, any>) => Promise<void>
}

export default function AdminModal({
  title,
  fields,
  initialData,
  isOpen,
  isLoading = false,
  onClose,
  onSubmit
}: AdminModalProps) {
  const [formData, setFormData] = useState(initialData || {})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await onSubmit(formData)
        setFormData({})
        onClose()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-aibo-mist">
          <h2 className="text-xl font-bold text-aibo-navy">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-aibo-slate hover:text-aibo-navy transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-aibo-navy mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-aibo-blue ${
                    errors[field.key]
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-aibo-line'
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-aibo-blue resize-none ${
                    errors[field.key]
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-aibo-line'
                  }`}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-aibo-blue ${
                    errors[field.key]
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-aibo-line'
                  }`}
                />
              )}

              {errors[field.key] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-aibo-mist">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-aibo-line text-aibo-navy font-medium hover:bg-aibo-cloud transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-aibo-blue text-white font-medium hover:bg-aibo-signal disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
