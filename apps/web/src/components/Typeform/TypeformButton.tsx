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
    font-display font-semibold
    transition-all duration-500
    rounded-none
    outline-none
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
    tracking-wide
    letter-spacing: 1px
  `

  const sizeClasses = {
    sm: 'px-8 py-2 text-sm',
    md: 'px-12 py-4 text-base',
    lg: 'px-16 py-5 text-lg',
  }

  const variantClasses = {
    primary: `
      bg-black text-white
      border border-black
      hover:bg-white hover:text-black
      active:bg-gray-dark active:text-white
    `,
    secondary: `
      bg-aibo-blue text-white
      border border-aibo-blue
      hover:bg-aibo-navy hover:border-aibo-navy
      active:bg-aibo-navy
    `,
    outline: `
      bg-transparent
      text-black
      border border-black
      hover:bg-black hover:text-white
      active:bg-gray-dark
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
