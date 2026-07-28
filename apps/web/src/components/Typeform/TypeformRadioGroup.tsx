interface Option {
  value: string | number
  label: string
  description?: string
}

interface TypeformRadioGroupProps {
  label?: string
  options: Option[]
  value: string | number
  onChange: (value: string | number) => void
  error?: string
  layout?: 'vertical' | 'horizontal'
}

export default function TypeformRadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  layout = 'vertical',
}: TypeformRadioGroupProps) {
  return (
    <div className="w-full space-y-4">
      {label && (
        <label className="block text-lg font-medium text-aibo-navy font-display">
          {label}
        </label>
      )}

      <div
        className={`
          space-y-3
          ${layout === 'horizontal' ? 'flex flex-wrap gap-4' : ''}
        `}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              group flex items-start gap-4 cursor-pointer
              p-4 rounded-2xl
              border-2 border-aibo-mist
              transition-all duration-300
              hover:border-aibo-blue hover:bg-aibo-cloud/50
              ${value === option.value ? 'border-aibo-blue bg-aibo-blue/10' : 'bg-white'}
              ${layout === 'horizontal' ? 'flex-1 min-w-48' : 'w-full'}
            `}
          >
            <input
              type="radio"
              name="radio-group"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={`
                w-6 h-6 mt-0.5 flex-shrink-0
                rounded-full
                cursor-pointer
                accent-aibo-blue
                focus:ring-2 focus:ring-aibo-blue focus:ring-offset-2
                transition-all duration-300
              `}
            />
            <div className="flex-1">
              <span className="text-lg font-medium text-aibo-navy group-hover:text-aibo-blue transition-colors block">
                {option.label}
              </span>
              {option.description && (
                <p className="text-sm text-aibo-slate mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
