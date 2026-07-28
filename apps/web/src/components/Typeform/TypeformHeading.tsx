import { ReactNode } from 'react'

interface TypeformHeadingProps {
  children: ReactNode
  subtitle?: string
  className?: string
}

export default function TypeformHeading({ children, subtitle, className = '' }: TypeformHeadingProps) {
  return (
    <div className={`mb-8 md:mb-12 ${className}`}>
      <h2
        className={`
          text-5xl md:text-6xl font-semibold
          font-display
          text-black
          mb-6 md:mb-8
          leading-tight
          tracking-tight
        `}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-dark font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
