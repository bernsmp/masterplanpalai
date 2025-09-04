import React, { useState } from 'react'
import { MapPin, DollarSign, Star, Clock, Users } from 'lucide-react'
import { VotingCard } from './VotingCard'

interface VenueVotingProps {
  onVote: (
    category: 'venues',
    itemId: string,
    weight: number,
    isRequired: boolean,
  ) => void
  getVotesForItem: (category: string, itemId: string) => any[]
  getVoteWeight: (category: string, itemId: string) => number
  users: any[]
}

interface Venue {
  id: string
  name: string
  image: string
  distance: number
  priceTier: number
  rating: number
  avgTravelTime: number
  walkingDistance: number
  category: string
}

export const VenueVoting: React.FC<VenueVotingProps> = ({
  onVote,
  getVotesForItem,
  getVoteWeight,
  users,
}) => {
  const [venues] = useState<Venue[]>([
    {
      id: 'venue1',
      name: 'Rooftop Garden',
      image:
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop',
      distance: 2.3,
      priceTier: 3,
      rating: 4.8,
      avgTravelTime: 15,
      walkingDistance: 0.5,
      category: 'Restaurant',
    },
    {
      id: 'venue2',
      name: 'Downtown Brewery',
      image:
        'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=300&h=200&fit=crop',
      distance: 1.8,
      priceTier: 2,
      rating: 4.5,
      avgTravelTime: 12,
      walkingDistance: 0.3,
      category: 'Bar',
    },
    {
      id: 'venue3',
      name: 'Art Gallery Loft',
      image:
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
      distance: 3.1,
      priceTier: 4,
      rating: 4.9,
      avgTravelTime: 20,
      walkingDistance: 0.8,
      category: 'Event Space',
    },
    {
      id: 'venue4',
      name: 'Waterfront Cafe',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
      distance: 4.2,
      priceTier: 2,
      rating: 4.3,
      avgTravelTime: 25,
      walkingDistance: 1.2,
      category: 'Cafe',
    },
  ])

  const maxVotes = Math.max(
    ...venues.map((venue) => getVoteWeight('venues', venue.id)),
    1,
  )

  const renderPriceTier = (tier: number) => {
    return Array.from(
      {
        length: 4,
      },
      (_, i) => (
        <DollarSign
          key={i}
          size={12}
          className={i < tier ? 'text-green-400' : 'text-gray-500'}
        />
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Choose Your Venue
        </h2>
        <p className="text-slate-600">
          Find the perfect location for your event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue) => {
          const votes = getVotesForItem('venues', venue.id)
          const voteWeight = getVoteWeight('venues', venue.id)
          const progress = maxVotes > 0 ? (voteWeight / maxVotes) * 100 : 0

          return (
            <VotingCard
              key={venue.id}
              onClick={() => onVote('venues', venue.id, 1, false)}
              progress={progress}
              isSelected={votes.some((v) => v.userId === '1')}
            >
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-white text-xs">{venue.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {venue.name}
                  </h3>
                  <p className="text-slate-500 text-sm">{venue.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderPriceTier(venue.priceTier)}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={12} />
                    <span>{venue.distance} mi</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock size={12} />
                    <span>{venue.avgTravelTime}min avg</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Users size={12} />
                    <span>{venue.walkingDistance}mi walk</span>
                  </div>
                </div>

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
