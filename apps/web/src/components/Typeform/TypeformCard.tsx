import { ReactNode } from 'react'

interface TypeformCardProps {
  children: ReactNode
  className?: string
}

export default function TypeformCard({ children, className = '' }: TypeformCardProps) {
  return (
    <div
      className={`
        bg-white
        p-0 md:p-0
        max-w-3xl mx-auto
        ${className}
      `}
    >
      {children}
    </div>
  )
}
