import React, { useState } from 'react'
import {
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  Award,
  AlertTriangle,
} from 'lucide-react'
import { VotingCard } from './VotingCard'
import { ProgressRing } from './ProgressRing'

interface DateVotingProps {
  onVote: (
    category: 'dates',
    itemId: string,
    weight: number,
    isRequired: boolean,
  ) => void
  getVotesForItem: (category: string, itemId: string) => any[]
  getVoteWeight: (category: string, itemId: string) => number
  users: any[]
  dateOptions?: any[]
  existingVotes?: any[]
}

interface DateOption {
  id: string
  date: string
  dayName: string
  weather: {
    icon: 'sun' | 'cloud' | 'rain'
    temp: number
    description: string
  }
  availability: number
  conflicts: string[]
  isOptimal?: boolean
}

export const DateVoting: React.FC<DateVotingProps> = ({
  onVote,
  getVotesForItem,
  getVoteWeight,
  users,
  dateOptions = [],
  existingVotes = [],
}) => {
  // Use real date options from props, or fallback to mock data
  const dates = dateOptions.length > 0 ? dateOptions.map((option: any) => {
    const availableCount = option.availability?.filter((a: any) => a.is_available).length || 0
    const totalVotes = option.availability?.length || 0
    const availabilityPercentage = totalVotes > 0 ? Math.round((availableCount / totalVotes) * 100) : 0
    
    return {
      id: option.id,
      date: option.option_date,
      dayName: new Date(option.option_date).toLocaleDateString('en-US', { weekday: 'long' }),
      weather: {
        icon: 'sun' as const, // Default to sun for now
        temp: 72, // Default temperature
        description: 'Good weather',
      },
      availability: availabilityPercentage,
      conflicts: [],
      isOptimal: availabilityPercentage > 80, // Mark as optimal if >80% available
    }
  }) : [
    // Fallback mock data if no real data
    {
      id: 'date1',
      date: '2024-03-15',
      dayName: 'Friday',
      weather: {
        icon: 'sun' as const,
        temp: 72,
        description: 'Sunny',
      },
      availability: 0, // Hide percentage until real data
      conflicts: [],
      isOptimal: false,
    },
  ]

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="text-yellow-400" size={24} />
      case 'cloud':
        return <Cloud className="text-gray-400" size={24} />
      case 'rain':
        return <CloudRain className="text-blue-400" size={24} />
      default:
        return <Sun className="text-yellow-400" size={24} />
    }
  }

  const maxVotes = Math.max(
    ...dates.map((date) => getVoteWeight('dates', date.id)),
    1,
  )

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Choose Your Dates
        </h2>
        <p className="text-slate-600">Select the best dates for your event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dates.map((date) => {
          const votes = getVotesForItem('dates', date.id)
          const voteWeight = getVoteWeight('dates', date.id)
          const progress = maxVotes > 0 ? (voteWeight / maxVotes) * 100 : 0

          return (
            <VotingCard
              key={date.id}
              onClick={() => onVote('dates', date.id, 1, false)}
              progress={progress}
              isSelected={votes.some((v) => v.userId === '1')}
            >
              <div className="relative">
                {date.isOptimal && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full p-1">
                    <Award size={16} className="text-white" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {date.dayName}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {new Date(date.date).toLocaleDateString()}
                    </p>
                  </div>
                  <ProgressRing progress={date.availability} size={40} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {getWeatherIcon(date.weather.icon)}
                  <span className="text-slate-800 font-medium">
                    {date.weather.temp}°F
                  </span>
                  <span className="text-slate-500 text-sm">
                    {date.weather.description}
                  </span>
                </div>

                <div className="text-sm text-slate-600 mb-3">
                  {date.availability}% available
                </div>

                {date.conflicts.length > 0 && (
                  <div className="flex items-center gap-1 text-orange-600 text-sm">
                    <AlertTriangle size={14} />
                    <span>{date.conflicts[0]}</span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="flex -space-x-2">
                    {votes.slice(0, 3).map((vote, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-100 flex items-center justify-center text-xs font-medium"
                      >
                        {users.find((u) => u.id === vote.userId)?.name?.charAt(0) || '?'}
                      </div>
                    ))}
                    {votes.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-xs text-white">
                        +{votes.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-slate-500 text-sm">
                    {voteWeight} votes
                  </span>
                </div>
              </div>
            </VotingCard>
          )
        })}
      </div>
    </div>
  )
}
