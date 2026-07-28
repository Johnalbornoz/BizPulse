interface TypeformProgressBarProps {
  current: number
  total: number
  showLabel?: boolean
}

export default function TypeformProgressBar({
  current,
  total,
  showLabel = true,
}: TypeformProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full space-y-3 mb-8">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-aibo-slate">
            Paso {current} de {total}
          </span>
          <span className="text-sm font-medium text-aibo-blue">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-aibo-mist rounded-full overflow-hidden">
        <div
          className={`
            h-full rounded-full
            bg-gradient-to-r from-aibo-blue to-aibo-signal
            transition-all duration-500 ease-out
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
