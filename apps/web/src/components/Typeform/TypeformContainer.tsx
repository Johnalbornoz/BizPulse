import { ReactNode } from 'react'

interface TypeformContainerProps {
  children: ReactNode
  gradient?: 'primary' | 'secondary' | 'accent' | 'neutral'
}

const gradients = {
  primary: 'bg-white',
  secondary: 'bg-white',
  accent: 'bg-white',
  neutral: 'bg-white',
}

export default function TypeformContainer({
  children,
  gradient = 'primary',
}: TypeformContainerProps) {
  return (
    <div
      className={`
        min-h-screen
        ${gradients[gradient]}
        flex items-center justify-center
        py-32 px-4 md:px-8
        relative overflow-hidden
      `}
    >
      <div className="w-full max-w-2xl relative z-10">
        {children}
      </div>
    </div>
  )
}
