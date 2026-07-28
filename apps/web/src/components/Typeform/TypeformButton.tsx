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
    rounded-2xl
    outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-aibo-blue
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
    shadow-md hover:shadow-lg
  `

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-lg',
    lg: 'px-12 py-5 text-xl',
  }

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-aibo-blue to-aibo-signal
      text-white
      hover:shadow-xl hover:scale-105
      active:scale-95
    `,
    secondary: `
      bg-gradient-to-r from-aibo-navy to-aibo-blue
      text-white
      hover:shadow-xl
      active:scale-95
    `,
    outline: `
      bg-white
      text-aibo-blue
      border-2 border-aibo-blue
      hover:bg-aibo-cloud
      active:scale-95
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
