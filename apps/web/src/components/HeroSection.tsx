export default function HeroSection() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image - premium luxury aesthetic */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/ImageBG.png)',
        }}
      />

      {/* Subtle overlay to enhance text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5" />
    </div>
  )
}
