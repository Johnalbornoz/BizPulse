import { SelectHTMLAttributes, forwardRef } from 'react'

interface Option {
  value: string | number
  label: string
}

interface TypeformSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
  helperText?: string
}

const TypeformSelect = forwardRef<HTMLSelectElement, TypeformSelectProps>(
  ({ label, options, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-3">
        {label && (
          <label className="block text-lg font-medium text-aibo-navy font-display">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full
            px-6 py-4
            text-lg
            rounded-2xl
            border-2 border-aibo-mist
            focus:border-aibo-blue focus:ring-0
            focus:shadow-lg
            outline-none
            transition-all duration-300
            bg-gradient-to-b from-aibo-cloud to-white
            font-sans
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
            cursor-pointer
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23286CBE' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.5em',
            paddingRight: '3rem',
          }}
          {...props}
        >
          <option value="">Selecciona una opción...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-aibo-slate">{helperText}</p>
        )}
      </div>
    )
  }
)

TypeformSelect.displayName = 'TypeformSelect'

export default TypeformSelect
