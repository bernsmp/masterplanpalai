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
import { supabase } from '@/lib/supabase'
import { DateVoting } from './DateVoting'
import { VenueVoting } from './VenueVoting'
import { ActivityVoting } from './ActivityVoting'
import { ResultsDisplay } from './ResultsDisplay'
import { VoterAvatars } from './VoterAvatars'
import { HeatMap } from './HeatMap'

interface VotingInterfaceProps {
  'data-id'?: string
  planId?: string
  shareCode?: string
  dateOptions?: any[]
  existingVotes?: any[]
  currentUserEmail?: string
  onVoteSubmitted?: () => void // Callback to refresh parent data
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
  planId,
  shareCode,
  dateOptions = [],
  existingVotes = [],
  currentUserEmail,
  onVoteSubmitted
}) => {
  const [activeTab, setActiveTab] = useState<
    'dates' | 'venues' | 'activities' | 'results'
  >('dates')
  const [votes, setVotes] = useState<Vote[]>([])
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alice',
      avatar: '/placeholder-avatar.jpg',
    },
    {
      id: '2',
      name: 'Bob',
      avatar: '/placeholder-avatar.jpg',
    },
    {
      id: '3',
      name: 'Carol',
      avatar: '/placeholder-avatar.jpg',
    },
    {
      id: '4',
      name: 'David',
      avatar: '/placeholder-avatar.jpg',
    },
    {
      id: '5',
      name: 'Eve',
      avatar: '/placeholder-avatar.jpg',
    },
  ])
  const [currentUserId] = useState('1')

  const addVote = async (
    category: 'dates' | 'venues' | 'activities',
    itemId: string,
    weight: number = 1,
    isRequired: boolean = false,
  ) => {
    // For dates, save to database
    if (category === 'dates' && planId && currentUserEmail) {
      try {
        const { error } = await supabase
          .from('availability')
          .upsert({
            date_option_id: itemId,
            email: currentUserEmail,
            name: 'User', // We'll get this from the form
            is_available: weight > 0
          }, {
            onConflict: 'date_option_id,email'
          })
        
        if (error) {
          console.error('Error saving vote:', error)
          return
        }
        
        // Call the callback to refresh parent data
        if (onVoteSubmitted) {
          onVoteSubmitted()
        }
      } catch (error) {
        console.error('Error saving vote:', error)
        return
      }
    }
    
    // For venues and activities, just update local state (coming soon)
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
      badge: null // Dates work
    },
    {
      id: 'venues',
      label: 'Venues',
      icon: MapPin,
      badge: 'Soon' // Coming soon
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: Activity,
      badge: 'Soon' // Coming soon
    },
    {
      id: 'results',
      label: 'Results',
      icon: TrendingUp,
      badge: null // Results work for dates
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4" data-id={dataId}>
      <div className="max-w-7xl mx-auto pt-4">

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
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
              dateOptions={dateOptions}
              existingVotes={existingVotes}
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
