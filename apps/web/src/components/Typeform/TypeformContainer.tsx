import { ReactNode } from 'react'

interface TypeformContainerProps {
  children: ReactNode
  gradient?: 'primary' | 'secondary' | 'accent' | 'neutral'
}

const gradients = {
  primary: 'from-aibo-cloud via-blue-50 to-white',
  secondary: 'from-aibo-mist via-aibo-cloud to-white',
  accent: 'from-emerald-50 via-cyan-50 to-white',
  neutral: 'from-neutral-50 to-white',
}

export default function TypeformContainer({
  children,
  gradient = 'primary',
}: TypeformContainerProps) {
  return (
    <div
      className={`
        min-h-screen
        bg-gradient-to-br ${gradients[gradient]}
        flex items-center justify-center
        py-12 px-4
        animate-slideIn
      `}
    >
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  )
}
