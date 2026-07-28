import { ReactNode } from 'react'

interface TypeformStatCardProps {
  icon?: string
  title: string
  value?: string | number
  description?: string
  gradient?: string
  onClick?: () => void
  className?: string
  children?: ReactNode
}

export default function TypeformStatCard({
  icon,
  title,
  value,
  description,
  gradient = 'from-aibo-blue to-aibo-signal',
  onClick,
  className = '',
  children,
}: TypeformStatCardProps) {
  const baseClasses = `
    group p-6 rounded-2xl
    transition-all duration-300
    ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105' : 'cursor-default'}
    ${className}
  `

  if (children) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} bg-gradient-to-br ${gradient} text-white shadow-lg`}
      onClick={onClick}
    >
      <div className="space-y-2">
        {icon && (
          <div className="text-4xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold font-display">
          {title}
        </h3>
        {value !== undefined && (
          <div className="text-3xl font-bold font-display pt-2">
            {value}
          </div>
        )}
        {description && (
          <p className="text-sm opacity-90 pt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
