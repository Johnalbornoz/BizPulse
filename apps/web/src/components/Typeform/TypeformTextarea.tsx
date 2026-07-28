import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TypeformTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
}

const TypeformTextarea = forwardRef<HTMLTextAreaElement, TypeformTextareaProps>(
  ({ label, error, helperText, showCharCount, className = '', value, maxLength, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full space-y-3">
        {label && (
          <label className="block text-lg font-medium text-aibo-navy font-display">
            {label}
          </label>
        )}
        <textarea
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
            placeholder-aibo-slate/50
            bg-gradient-to-b from-aibo-cloud to-white
            font-sans
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            ${className}
          `}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex justify-between items-end gap-4">
          <div>
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-aibo-slate">{helperText}</p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p className="text-xs text-aibo-slate font-medium">
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

TypeformTextarea.displayName = 'TypeformTextarea'

export default TypeformTextarea
