interface GridOption {
  value: string | number
  label: string
  icon?: string
  description?: string
}

interface TypeformGridOptionsProps {
  label?: string
  options: GridOption[]
  value: string | number | (string | number)[]
  onChange: (value: string | number | (string | number)[]) => void
  multiple?: boolean
  columns?: number
  error?: string
}

export default function TypeformGridOptions({
  label,
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
  error,
}: TypeformGridOptionsProps) {
  const isSelected = (optionValue: string | number) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue)
    }
    return value === optionValue
  }

  const handleSelect = (optionValue: string | number) => {
    if (multiple && Array.isArray(value)) {
      if (value.includes(optionValue)) {
        onChange(value.filter(v => v !== optionValue))
      } else {
        onChange([...value, optionValue])
      }
    } else {
      onChange(optionValue)
    }
  }

  return (
    <div className="w-full space-y-4">
      {label && (
        <label className="block text-lg font-medium text-aibo-navy font-display">
          {label}
        </label>
      )}

      <div
        className={`grid gap-4 grid-cols-1 ${
          columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
        }`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`
              group p-6 rounded-2xl
              border-2 transition-all duration-300
              text-left
              ${isSelected(option.value)
                ? 'border-aibo-blue bg-aibo-blue/10 shadow-lg'
                : 'border-aibo-mist bg-white hover:border-aibo-blue hover:shadow-md'
              }
            `}
          >
            {option.icon && (
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {option.icon}
              </div>
            )}
            <h4 className="font-semibold text-aibo-navy text-lg mb-1">
              {option.label}
            </h4>
            {option.description && (
              <p className="text-sm text-aibo-slate">
                {option.description}
              </p>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
