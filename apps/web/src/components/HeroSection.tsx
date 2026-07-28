export default function HeroSection() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-white via-sky-100 to-blue-50">
      {/* Top right glow - vibrant */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-sky-400 via-sky-300 to-transparent opacity-60 blur-3xl" />

      {/* Bottom left glow */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-cyan-300 via-blue-200 to-transparent opacity-55 blur-3xl" />

      {/* Center accent orb */}
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-radial from-sky-300 via-sky-200 to-transparent opacity-50 blur-2xl transform -translate-y-1/2" />

      {/* SVG visualization */}
      <svg
        className="absolute inset-0 w-full h-full opacity-85"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="curve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="curve2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Curved lines representing growth and excellence */}
        <path
          d="M 150 700 Q 400 350 900 100"
          stroke="url(#curve2)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 100 750 Q 380 420 880 180"
          stroke="url(#curve2)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        <path
          d="M 150 780 Q 420 480 920 240"
          stroke="url(#curve1)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Axis lines */}
        <line x1="100" y1="750" x2="950" y2="750" stroke="#64748b" strokeWidth="2" opacity="0.3" />
        <line x1="100" y1="50" x2="100" y2="750" stroke="#64748b" strokeWidth="2" opacity="0.3" />

        {/* Data points */}
        <circle cx="100" cy="750" r="8" fill="#0ea5e9" opacity="1" />
        <circle cx="380" cy="420" r="6" fill="#06b6d4" opacity="0.9" />
        <circle cx="900" cy="100" r="8" fill="#0369a1" opacity="1" />

        {/* Connection lines */}
        <line x1="100" y1="750" x2="380" y2="420" stroke="#0ea5e9" strokeWidth="1" opacity="0.25" strokeDasharray="4,4" />
        <line x1="380" y1="420" x2="900" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.25" strokeDasharray="4,4" />

        {/* Decorative elements */}
        <circle cx="100" cy="750" r="12" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.3" />
        <circle cx="900" cy="100" r="14" fill="none" stroke="#0369a1" strokeWidth="1.5" opacity="0.3" />
      </svg>

      {/* Top accent line */}
      <div className="absolute top-20 left-1/4 w-96 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-40" />

      {/* Right side accent */}
      <div className="absolute top-1/3 right-20 w-px h-96 bg-gradient-to-b from-cyan-400 to-transparent opacity-20" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  )
}
