import { InputHTMLAttributes, forwardRef } from 'react'

interface TypeformCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
}

const TypeformCheckbox = forwardRef<HTMLInputElement, TypeformCheckboxProps>(
  ({ label, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <label className="flex items-start gap-4 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-6 h-6 mt-1 flex-shrink-0
              rounded-xl
              border-2 border-aibo-mist
              accent-aibo-blue
              focus:ring-2 focus:ring-aibo-blue focus:ring-offset-2
              cursor-pointer
              transition-all duration-300
              ${className}
            `}
            {...props}
          />
          <div className="flex-1">
            <span className="text-lg font-medium text-aibo-navy group-hover:text-aibo-blue transition-colors">
              {label}
            </span>
            {helperText && (
              <p className="text-sm text-aibo-slate mt-1">{helperText}</p>
            )}
          </div>
        </label>
      </div>
    )
  }
)

TypeformCheckbox.displayName = 'TypeformCheckbox'

export default TypeformCheckbox
