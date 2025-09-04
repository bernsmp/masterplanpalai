import React from 'react'

interface ProgressRingProps {
  progress: number
  size: number
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
}) => {
  const radius = (size - 4) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(progress * circumference) / 100} ${circumference}`

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(245, 158, 11, 0.2)"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(245, 158, 11)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-slate-800">{progress}%</span>
      </div>
    </div>
  )
}
