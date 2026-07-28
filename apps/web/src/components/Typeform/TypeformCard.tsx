import { ReactNode } from 'react'

interface TypeformCardProps {
  children: ReactNode
  className?: string
}

export default function TypeformCard({ children, className = '' }: TypeformCardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md p-10 md:p-16
        max-w-2xl mx-auto
        border border-aibo-line
        hover:shadow-lg transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </div>
  )
}
