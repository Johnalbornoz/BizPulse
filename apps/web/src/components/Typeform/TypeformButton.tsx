import { ButtonHTMLAttributes, ReactNode } from 'react'

interface TypeformButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export default function TypeformButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}: TypeformButtonProps) {
  const baseClasses = `
    font-semibold font-display
    transition-all duration-300
    rounded-lg
    outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-aibo-blue
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
  `

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg',
  }

  const variantClasses = {
    primary: `
      bg-aibo-blue text-white
      hover:bg-aibo-navy hover:shadow-lg
      active:bg-aibo-navy
      shadow-md
    `,
    secondary: `
      bg-aibo-signal text-white
      hover:bg-aibo-navy hover:shadow-lg
      active:bg-aibo-navy
      shadow-md
    `,
    outline: `
      bg-white
      text-aibo-blue
      border border-aibo-blue
      hover:bg-aibo-cloud
      active:bg-aibo-mist
    `,
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
