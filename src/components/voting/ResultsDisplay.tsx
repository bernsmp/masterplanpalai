import React from 'react'
import { Award, Users, TrendingUp, Download, Sparkles } from 'lucide-react'

interface ResultsDisplayProps {
  votes: any[]
  users: any[]
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  votes,
  users,
}) => {
  const getTopChoice = (category: string) => {
    const categoryVotes = votes.filter((v) => v.category === category)
    const voteCounts = categoryVotes.reduce(
      (acc, vote) => {
        acc[vote.itemId] = (acc[vote.itemId] || 0) + vote.weight
        return acc
      },
      {} as Record<string, number>,
    )
    const topItem = Object.entries(voteCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0]
    return topItem
      ? {
          itemId: topItem[0],
          votes: topItem[1],
        }
      : null
  }

  const getConsensusScore = () => {
    const totalVotes = votes.length
    const uniqueVoters = new Set(votes.map((v) => v.userId)).size
    if (uniqueVoters === 0) return 0
    return Math.round((totalVotes / (uniqueVoters * 3)) * 100) // 3 categories
  }

  const getMinorityReport = () => {
    const reports: Array<{ category: string; itemId: string; votes: number }> = []
    const categories = ['dates', 'venues', 'activities']
    categories.forEach((category) => {
      const categoryVotes = votes.filter((v) => v.category === category)
      const voteCounts = categoryVotes.reduce(
        (acc, vote) => {
          acc[vote.itemId] = (acc[vote.itemId] || 0) + vote.weight
          return acc
        },
        {} as Record<string, number>,
      )
      const sortedItems = Object.entries(voteCounts).sort(
        ([, a], [, b]) => (b as number) - (a as number),
      )
      if (sortedItems.length > 1 && (sortedItems[1][1] as number) >= 2) {
        reports.push({
          category,
          itemId: sortedItems[1][0],
          votes: sortedItems[1][1] as number,
        })
      }
    })
    return reports
  }

  const topDate = getTopChoice('dates')
  const topVenue = getTopChoice('venues')
  const topActivity = getTopChoice('activities')
  const consensusScore = getConsensusScore()
  const minorityReports = getMinorityReport()

  const itemNames = {
    date1: 'Friday, March 15',
    date2: 'Saturday, March 16',
    date3: 'Sunday, March 17',
    date4: 'Friday, March 22',
    venue1: 'Rooftop Garden',
    venue2: 'Downtown Brewery',
    venue3: 'Art Gallery Loft',
    venue4: 'Waterfront Cafe',
    activity1: 'Live Jazz Night',
    activity2: 'Food Tour',
    activity3: 'Art Workshop',
    activity4: 'Game Tournament',
    activity5: 'Photography Walk',
    activity6: 'Dance Class',
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Voting Results
        </h2>
        <p className="text-slate-600">Here's what your group has decided</p>
      </div>

      {/* Consensus Score */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="text-amber-500" size={24} />
          <h3 className="text-xl font-semibold text-slate-800">
            Group Consensus Score
          </h3>
        </div>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(245, 158, 11, 0.2)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgb(245, 158, 11)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${consensusScore * 2.83} 283`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">
              {consensusScore}%
            </span>
          </div>
        </div>
        <p className="text-slate-600">
          {consensusScore >= 80
            ? 'Excellent agreement!'
            : consensusScore >= 60
              ? 'Good consensus'
              : 'More discussion needed'}
        </p>
      </div>

      {/* Perfect Plan */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-amber-500" size={24} />
          <h3 className="text-xl font-semibold text-slate-800">
            AI-Suggested Perfect Plan
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-slate-700 font-medium mb-2">Date</h4>
            <p className="text-slate-800">
              {topDate
                ? itemNames[topDate.itemId as keyof typeof itemNames]
                : 'No votes yet'}
            </p>
            {topDate && (
              <p className="text-sm text-slate-500">{topDate.votes as number} votes</p>
            )}
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-slate-700 font-medium mb-2">Venue</h4>
            <p className="text-slate-800">
              {topVenue
                ? itemNames[topVenue.itemId as keyof typeof itemNames]
                : 'No votes yet'}
            </p>
            {topVenue && (
              <p className="text-sm text-slate-500">{topVenue.votes as number} votes</p>
            )}
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-slate-700 font-medium mb-2">Activity</h4>
            <p className="text-slate-800">
              {topActivity
                ? itemNames[topActivity.itemId as keyof typeof itemNames]
                : 'No votes yet'}
            </p>
            {topActivity && (
              <p className="text-sm text-slate-500">
                {topActivity.votes as number} votes
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Minority Reports */}
      {minorityReports.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-orange-500" size={24} />
            <h3 className="text-xl font-semibold text-slate-800">
              Alternative Preferences
            </h3>
          </div>
          <div className="space-y-3">
            {minorityReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-200"
              >
                <div>
                  <span className="text-orange-700 text-sm capitalize">
                    {report.category}:{' '}
                  </span>
                  <span className="text-slate-800">
                    {itemNames[report.itemId as keyof typeof itemNames]}
                  </span>
                </div>
                <span className="text-orange-600 text-sm">
                  {report.votes as number} people prefer this
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-md">
          <Download size={20} />
          Export Beautiful Invitation
        </button>
      </div>
    </div>
  )
}
