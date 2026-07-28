import { InputHTMLAttributes, forwardRef } from 'react'

interface TypeformInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const TypeformInput = forwardRef<HTMLInputElement, TypeformInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-3">
        {label && (
          <label className="block text-lg font-medium text-aibo-navy font-display">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            px-0 py-4
            text-lg
            bg-transparent
            border-b-2 border-gray-medium
            focus:border-black focus:ring-0
            outline-none
            transition-all duration-500
            placeholder-gray-dark/40
            font-sans
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-b-2 border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
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

TypeformInput.displayName = 'TypeformInput'

export default TypeformInput
