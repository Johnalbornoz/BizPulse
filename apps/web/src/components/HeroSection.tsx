export default function HeroSection() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Premium gradient background - metallic luxury look */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100" />

      {/* Glow orbs - premium 3D effect */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-radial from-sky-400 via-sky-300 to-transparent opacity-70 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-gradient-radial from-blue-400 via-cyan-300 to-transparent opacity-60 blur-3xl" />
      <div className="absolute top-1/2 right-20 w-72 h-72 bg-gradient-radial from-cyan-300 via-blue-200 to-transparent opacity-50 blur-2xl" />

      {/* Main SVG - 3D visualization */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Premium gradients with metallic effect */}
          <linearGradient id="premiumCurve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0099cc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#006699" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="premiumCurve2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0077aa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="premiumCurve3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00b3d9" stopOpacity="0.3" />
          </linearGradient>

          {/* Radial gradient for glowing spheres */}
          <radialGradient id="sphereGlow1" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0077aa" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sphereGlow2" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#006699" stopOpacity="0" />
          </radialGradient>

          {/* Filter for glow effect */}
          <filter id="premiumGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background area - translucent panels */}
        <rect x="650" y="100" width="120" height="300" fill="#f0f8ff" opacity="0.15" rx="8" />
        <rect x="680" y="130" width="8" height="240" fill="#00d4ff" opacity="0.2" />

        {/* Main curves - representing growth and excellence */}
        <path
          d="M 150 680 Q 400 250 950 80"
          stroke="url(#premiumCurve1)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#premiumGlow)"
        />

        <path
          d="M 100 730 Q 380 320 920 150"
          stroke="url(#premiumCurve2)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        <path
          d="M 150 770 Q 420 400 980 220"
          stroke="url(#premiumCurve3)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Coordinate system - elegant axes */}
        <line x1="100" y1="750" x2="1000" y2="750" stroke="#333333" strokeWidth="2" opacity="0.25" />
        <line x1="100" y1="50" x2="100" y2="750" stroke="#333333" strokeWidth="2" opacity="0.25" />

        {/* Axis arrows */}
        <polygon points="1000,750 990,745 995,750 990,755" fill="#333333" opacity="0.25" />
        <polygon points="100,50 95,60 100,55 105,60" fill="#333333" opacity="0.25" />

        {/* Premium data point spheres with glow */}
        <g>
          {/* Sphere 1 - start point */}
          <circle cx="100" cy="750" r="10" fill="url(#sphereGlow1)" filter="url(#premiumGlow)" />
          <circle cx="100" cy="750" r="8" fill="#00d4ff" opacity="0.4" />

          {/* Sphere 2 - mid point */}
          <circle cx="380" cy="320" r="8" fill="url(#sphereGlow2)" filter="url(#premiumGlow)" />
          <circle cx="380" cy="320" r="6" fill="#00b3d9" opacity="0.5" />

          {/* Sphere 3 - end point (larger) */}
          <circle cx="950" cy="80" r="12" fill="url(#sphereGlow1)" filter="url(#premiumGlow)" />
          <circle cx="950" cy="80" r="10" fill="#0077aa" opacity="0.6" />
        </g>

        {/* Connection lines - dashed for elegance */}
        <line x1="100" y1="750" x2="380" y2="320" stroke="#00d4ff" strokeWidth="1.5" opacity="0.35" strokeDasharray="8,4" />
        <line x1="380" y1="320" x2="950" y2="80" stroke="#0099cc" strokeWidth="1.5" opacity="0.35" strokeDasharray="8,4" />

        {/* Decorative rings around key points */}
        <circle cx="100" cy="750" r="16" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
        <circle cx="950" cy="80" r="18" fill="none" stroke="#0077aa" strokeWidth="1.5" opacity="0.4" />
      </svg>

      {/* Top accent line */}
      <div className="absolute top-24 left-1/4 w-96 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50" />

      {/* Right side vertical accent */}
      <div className="absolute top-1/4 right-32 w-px h-80 bg-gradient-to-b from-cyan-400 via-sky-300 to-transparent opacity-40" />

      {/* Subtle grid pattern - very faint */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  )
}
