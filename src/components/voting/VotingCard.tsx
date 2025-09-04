import React from 'react'

interface VotingCardProps {
  children: React.ReactNode
  onClick: () => void
  progress: number
  isSelected: boolean
}

export const VotingCard: React.FC<VotingCardProps> = ({
  children,
  onClick,
  progress,
  isSelected,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-6 border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md flex flex-col ${
        isSelected
          ? 'border-amber-300 shadow-lg shadow-amber-100'
          : 'border-gray-200 hover:border-amber-200'
      }`}
    >
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Pulse animation for high votes */}
      {progress > 70 && (
        <div className="absolute inset-0 rounded-2xl bg-amber-50 animate-pulse" />
      )}

      {children}
    </div>
  )
}
