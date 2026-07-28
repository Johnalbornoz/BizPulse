import { ReactNode } from 'react'

interface TypeformContainerProps {
  children: ReactNode
  gradient?: 'primary' | 'secondary' | 'accent' | 'neutral'
}

const gradients = {
  primary: 'from-aibo-cloud to-white',
  secondary: 'from-white to-aibo-mist',
  accent: 'from-white via-slate-50 to-white',
  neutral: 'from-white to-white',
}

export default function TypeformContainer({
  children,
  gradient = 'primary',
}: TypeformContainerProps) {
  return (
    <div
      className={`
        min-h-screen
        bg-gradient-to-b ${gradients[gradient]}
        flex items-center justify-center
        py-16 px-4
        relative overflow-hidden
      `}
    >
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-aibo-signal opacity-3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-aibo-navy opacity-5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10">
        {children}
      </div>
    </div>
  )
}
