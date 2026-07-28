import { ReactNode } from 'react'

interface TypeformCardProps {
  children: ReactNode
  className?: string
}

export default function TypeformCard({ children, className = '' }: TypeformCardProps) {
  return (
    <div
      className={`
        animate-fadeIn
        bg-white rounded-2xl shadow-lg p-8 md:p-12
        max-w-2xl mx-auto
        border border-aibo-mist
        backdrop-blur-sm bg-opacity-95
        ${className}
      `}
    >
      {children}
    </div>
  )
}
