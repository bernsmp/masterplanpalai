import React, { useState } from 'react'
import {
  Music,
  Camera,
  Utensils,
  Gamepad2,
  Clock,
  DollarSign,
  Zap,
  Heart,
  Users,
  Palette,
} from 'lucide-react'
import { VotingCard } from './VotingCard'

interface ActivityVotingProps {
  onVote: (
    category: 'activities',
    itemId: string,
    weight: number,
    isRequired: boolean,
  ) => void
  getVotesForItem: (category: string, itemId: string) => any[]
  getVoteWeight: (category: string, itemId: string) => number
  users: any[]
}

interface Activity {
  id: string
  name: string
  icon: string
  mood: 'chill' | 'active' | 'social' | 'cultural'
  pricePerPerson: number
  duration: number
  description: string
  pairsWell: string[]
}

export const ActivityVoting: React.FC<ActivityVotingProps> = ({
  onVote,
  getVotesForItem,
  getVoteWeight,
  users,
}) => {
  const [activities] = useState<Activity[]>([
    {
      id: 'activity1',
      name: 'Live Jazz Night',
      icon: 'music',
      mood: 'cultural',
      pricePerPerson: 25,
      duration: 180,
      description: 'Enjoy smooth jazz with craft cocktails',
      pairsWell: ['Rooftop Garden', 'Downtown Brewery'],
    },
    {
      id: 'activity2',
      name: 'Food Tour',
      icon: 'utensils',
      mood: 'social',
      pricePerPerson: 45,
      duration: 150,
      description: 'Explore local cuisine with guided tastings',
      pairsWell: ['Waterfront Cafe'],
    },
    {
      id: 'activity3',
      name: 'Art Workshop',
      icon: 'palette',
      mood: 'chill',
      pricePerPerson: 35,
      duration: 120,
      description: 'Create art together in a relaxed setting',
      pairsWell: ['Art Gallery Loft'],
    },
    {
      id: 'activity4',
      name: 'Game Tournament',
      icon: 'gamepad',
      mood: 'active',
      pricePerPerson: 20,
      duration: 240,
      description: 'Competitive gaming with prizes',
      pairsWell: ['Downtown Brewery'],
    },
    {
      id: 'activity5',
      name: 'Photography Walk',
      icon: 'camera',
      mood: 'chill',
      pricePerPerson: 15,
      duration: 90,
      description: 'Capture the city through your lens',
      pairsWell: ['Waterfront Cafe', 'Art Gallery Loft'],
    },
    {
      id: 'activity6',
      name: 'Dance Class',
      icon: 'music',
      mood: 'active',
      pricePerPerson: 30,
      duration: 60,
      description: 'Learn new moves together',
      pairsWell: ['Rooftop Garden'],
    },
  ])

  const getActivityIcon = (iconName: string) => {
    const iconMap = {
      music: Music,
      utensils: Utensils,
      palette: Palette,
      gamepad: Gamepad2,
      camera: Camera,
    }
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Music
    return <IconComponent size={32} className="text-amber-500" />
  }

  const getMoodColor = (mood: string) => {
    const colors = {
      chill: 'bg-blue-100 text-blue-700',
      active: 'bg-red-100 text-red-700',
      social: 'bg-green-100 text-green-700',
      cultural: 'bg-purple-100 text-purple-700',
    }
    return colors[mood as keyof typeof colors] || colors.social
  }

  const getMoodIcon = (mood: string) => {
    const icons = {
      chill: Heart,
      active: Zap,
      social: Users,
      cultural: Palette,
    }
    const IconComponent = icons[mood as keyof typeof icons] || Users
    return <IconComponent size={14} />
  }

  const maxVotes = Math.max(
    ...activities.map((activity) => getVoteWeight('activities', activity.id)),
    1,
  )

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <span className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
            🚀 Coming Soon
          </span>
          <p className="text-slate-600 mt-2">Activity voting will be available soon!</p>
        </div>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Choose Activities
        </h2>
        <p className="text-slate-600">
          Select experiences that match your group's vibe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => {
          const votes = getVotesForItem('activities', activity.id)
          const voteWeight = getVoteWeight('activities', activity.id)
          const progress = maxVotes > 0 ? (voteWeight / maxVotes) * 100 : 0

          return (
            <VotingCard
              key={activity.id}
              onClick={() => onVote('activities', activity.id, 1, false)}
              progress={progress}
              isSelected={votes.some((v) => v.userId === '1')}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.icon)}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {activity.name}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getMoodColor(activity.mood)}`}
                      >
                        {getMoodIcon(activity.mood)}
                        {activity.mood}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm">{activity.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1 text-slate-600">
                    <DollarSign size={14} />
                    <span>${activity.pricePerPerson}/person</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock size={14} />
                    <span>
                      {Math.floor(activity.duration / 60)}h{' '}
                      {activity.duration % 60}m
                    </span>
                  </div>
                </div>

                {activity.pairsWell.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-2">
                    <p className="text-xs text-amber-700 mb-1">
                      Pairs well with:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activity.pairsWell.map((venue, index) => (
                        <span
                          key={index}
                          className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full"
                        >
                          {venue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {votes.slice(0, 3).map((vote, index) => (
                      <img
                        key={index}
                        src={users.find((u) => u.id === vote.userId)?.avatar}
                        alt="Voter"
                        className="w-6 h-6 rounded-full border-2 border-amber-400"
                      />
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
