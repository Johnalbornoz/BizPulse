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
          text-4xl md:text-5xl font-bold
          font-display
          text-aibo-navy
          mb-4
          leading-tight
          tracking-tight
        `}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg text-aibo-slate font-light">
          {subtitle}
        </p>
      )}
    </div>
  )
}
