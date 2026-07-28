export default function HeroSection() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />

      {/* 3D visualization elements */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="luxGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="luxGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Curved lines - representing growth/excellence */}
        <path
          d="M 300 600 Q 500 400 800 200"
          stroke="url(#luxGradient2)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 300 650 Q 500 450 800 250"
          stroke="url(#luxGradient2)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 300 700 Q 500 500 800 300"
          stroke="url(#luxGradient1)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Axis lines - minimalist coordinate system */}
        <line x1="300" y1="700" x2="900" y2="700" stroke="#d1d5db" strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="200" x2="300" y2="700" stroke="#d1d5db" strokeWidth="1" opacity="0.4" />

        {/* Soft glowing orbs */}
        <circle cx="850" cy="150" r="40" fill="url(#glowEffect)" />
        <circle cx="850" cy="150" r="35" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

        {/* Data point spheres */}
        <circle cx="300" cy="700" r="6" fill="#0ea5e9" opacity="0.6" />
        <circle cx="500" cy="450" r="5" fill="#06b6d4" opacity="0.5" />
        <circle cx="800" cy="200" r="6" fill="#0369a1" opacity="0.7" />

        {/* Subtle accent elements */}
        <rect x="820" y="130" width="60" height="80" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.2" rx="4" />
        <line x1="820" y1="160" x2="880" y2="160" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2" />
        <line x1="820" y1="190" x2="880" y2="190" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2" />
      </svg>

      {/* Radial glow effect - right side */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-sky-100 to-transparent opacity-30 blur-3xl" />

      {/* Left accent line */}
      <div className="absolute top-1/4 left-0 w-px h-32 bg-gradient-to-b from-sky-300 to-transparent opacity-20" />

      {/* Subtle dots pattern */}
      <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-sky-400 opacity-20" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-15" />
      <div className="absolute bottom-1/3 right-1/2 w-1 h-1 rounded-full bg-sky-300 opacity-10" />
    </div>
  )
}
