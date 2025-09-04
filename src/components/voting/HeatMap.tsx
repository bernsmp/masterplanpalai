import React from 'react'
import { TrendingUp } from 'lucide-react'

interface HeatMapProps {
  votes: any[]
  users: any[]
}

export const HeatMap: React.FC<HeatMapProps> = ({ votes, users }) => {
  const getHeatIntensity = (category: string) => {
    const categoryVotes = votes.filter((v) => v.category === category)
    const maxPossibleVotes = users.length
    const actualVotes = categoryVotes.length
    return maxPossibleVotes > 0 ? (actualVotes / maxPossibleVotes) * 100 : 0
  }

  const categories = [
    {
      id: 'dates',
      label: 'Dates',
      intensity: getHeatIntensity('dates'),
    },
    {
      id: 'venues',
      label: 'Venues',
      intensity: getHeatIntensity('venues'),
    },
    {
      id: 'activities',
      label: 'Activities',
      intensity: getHeatIntensity('activities'),
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-amber-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">
          Voting Heat Map
        </h3>
        <span className="text-slate-600 text-sm">
          Deeper amber = more consensus
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="text-center">
            <div
              className="h-16 rounded-lg border border-amber-200 flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: `rgba(245, 158, 11, ${(category.intensity / 100) * 0.6 + 0.1})`,
              }}
            >
              <span className="text-slate-800 font-medium">
                {category.label}
              </span>
            </div>
            <p className="text-slate-600 text-sm mt-2">
              {Math.round(category.intensity)}% engaged
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
