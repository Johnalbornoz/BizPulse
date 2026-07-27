import { useMemo } from 'react'

interface RadarDataPoint {
  pilar: string
  eje1: number
  eje2: number
}

interface RadarChartProps {
  data: RadarDataPoint[]
  width?: number
  height?: number
}

export default function RadarChart({ data, width = 400, height = 400 }: RadarChartProps) {
  const CENTER_X = width / 2
  const CENTER_Y = height / 2
  const RADIUS = Math.min(width, height) / 2 - 60

  const angles = useMemo(() => {
    const angleSlice = (Math.PI * 2) / data.length
    return data.map((_, i) => angleSlice * i - Math.PI / 2)
  }, [data.length])

  const getPoint = (value: number, angle: number) => {
    const x = CENTER_X + (value / 5) * RADIUS * Math.cos(angle)
    const y = CENTER_Y + (value / 5) * RADIUS * Math.sin(angle)
    return { x, y }
  }

  // Generar puntos para cada eje
  const eje1Points = data.map((d, i) => getPoint(d.eje1, angles[i]))
  const eje2Points = data.map((d, i) => getPoint(d.eje2, angles[i]))

  const pathStringEje1 = eje1Points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ')
    .concat('Z')

  const pathStringEje2 = eje2Points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ')
    .concat('Z')

  // Líneas de grid
  const gridLines = Array.from({ length: 5 }, (_, i) => (i + 1) * (RADIUS / 5))

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="bg-white rounded-lg">
        {/* Grid concéntrico */}
        {gridLines.map((radius, i) => (
          <circle
            key={`grid-${i}`}
            cx={CENTER_X}
            cy={CENTER_Y}
            r={radius}
            fill="none"
            stroke="#CBD7E5"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        {/* Líneas radiales */}
        {angles.map((angle, i) => {
          const end = getPoint(5, angle)
          return (
            <line
              key={`radial-${i}`}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={end.x}
              y2={end.y}
              stroke="#E3EAF3"
              strokeWidth="1"
            />
          )
        })}

        {/* Polígono Eje 1 (Azul) */}
        <path
          d={pathStringEje1}
          fill="rgba(40, 108, 190, 0.1)"
          stroke="#286CBE"
          strokeWidth="2"
        />

        {/* Polígono Eje 2 (Signal/Teal) */}
        <path
          d={pathStringEje2}
          fill="rgba(18, 184, 166, 0.1)"
          stroke="#12B8A6"
          strokeWidth="2"
        />

        {/* Puntos en Eje 1 */}
        {eje1Points.map((p, i) => (
          <circle
            key={`eje1-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#286CBE"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Puntos en Eje 2 */}
        {eje2Points.map((p, i) => (
          <circle
            key={`eje2-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#12B8A6"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Labels de pilares */}
        {angles.map((angle, i) => {
          const labelPoint = getPoint(5.7, angle)
          return (
            <text
              key={`label-${i}`}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="600"
              fill="#1D3C6A"
              className="font-display"
            >
              {data[i].pilar}
            </text>
          )
        })}

        {/* Círculo central */}
        <circle cx={CENTER_X} cy={CENTER_Y} r="3" fill="#1D3C6A" />
      </svg>

      {/* Leyenda */}
      <div className="flex gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aibo-blue"></div>
          <span className="text-sm text-aibo-navy font-medium">Eje 1: Estado del Arte</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aibo-signal"></div>
          <span className="text-sm text-aibo-navy font-medium">Eje 2: Segmento/Competencia</span>
        </div>
      </div>
    </div>
  )
}
