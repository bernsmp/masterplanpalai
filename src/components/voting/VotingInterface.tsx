import React, { useEffect, useState } from 'react'
import {
  Calendar,
  MapPin,
  Activity,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
} from 'lucide-react'
import { DateVoting } from './DateVoting'
import { VenueVoting } from './VenueVoting'
import { ActivityVoting } from './ActivityVoting'
import { ResultsDisplay } from './ResultsDisplay'
import { VoterAvatars } from './VoterAvatars'
import { HeatMap } from './HeatMap'

interface VotingInterfaceProps {
  'data-id'?: string
}

export interface Vote {
  id: string
  userId: string
  category: 'dates' | 'venues' | 'activities'
  itemId: string
  weight: number
  isRequired?: boolean
}

export interface User {
  id: string
  name: string
  avatar: string
  location?: {
    lat: number
    lng: number
  }
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  'data-id': dataId,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dates' | 'venues' | 'activities' | 'results'
  >('dates')
  const [votes, setVotes] = useState<Vote[]>([])
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alice',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Bob',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Carol',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'David',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    {
      id: '5',
      name: 'Eve',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
    },
  ])
  const [currentUserId] = useState('1')

  const addVote = (
    category: 'dates' | 'venues' | 'activities',
    itemId: string,
    weight: number = 1,
    isRequired: boolean = false,
  ) => {
    setVotes((prev) => {
      const existingVote = prev.find(
        (v) =>
          v.userId === currentUserId &&
          v.category === category &&
          v.itemId === itemId,
      )
      if (existingVote) {
        return prev.map((v) =>
          v.id === existingVote.id
            ? {
                ...v,
                weight,
                isRequired,
              }
            : v,
        )
      }
      return [
        ...prev,
        {
          id: Math.random().toString(),
          userId: currentUserId,
          category,
          itemId,
          weight,
          isRequired,
        },
      ]
    })
  }

  const getVotesForItem = (category: string, itemId: string) => {
    return votes.filter((v) => v.category === category && v.itemId === itemId)
  }

  const getVoteWeight = (category: string, itemId: string) => {
    return votes
      .filter((v) => v.category === category && v.itemId === itemId)
      .reduce((sum, v) => sum + v.weight, 0)
  }

  const tabs = [
    {
      id: 'dates',
      label: 'Dates',
      icon: Calendar,
    },
    {
      id: 'venues',
      label: 'Venues',
      icon: MapPin,
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: Activity,
    },
    {
      id: 'results',
      label: 'Results',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4" data-id={dataId}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Exclusive for Smart Solutions Subscribers
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Group Event Planning
          </h1>
          <p className="text-slate-600">
            Vote on dates, venues, and activities to find the perfect plan
          </p>
          <div className="flex justify-center mt-4">
            <VoterAvatars users={users} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heat Map */}
        <HeatMap votes={votes} users={users} />

        {/* Content */}
        <div className="transition-all duration-500">
          {activeTab === 'dates' && (
            <DateVoting
              onVote={addVote}
              getVotesForItem={getVotesForItem}
              getVoteWeight={getVoteWeight}
              users={users}
            />
          )}
          {activeTab === 'venues' && (
            <VenueVoting
              onVote={addVote}
              getVotesForItem={getVotesForItem}
              getVoteWeight={getVoteWeight}
              users={users}
            />
          )}
          {activeTab === 'activities' && (
            <ActivityVoting
              onVote={addVote}
              getVotesForItem={getVotesForItem}
              getVoteWeight={getVoteWeight}
              users={users}
            />
          )}
          {activeTab === 'results' && (
            <ResultsDisplay votes={votes} users={users} />
          )}
        </div>
      </div>
    </div>
  )
}
