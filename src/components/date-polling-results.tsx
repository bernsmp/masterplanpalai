"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, TrendingUp } from "lucide-react"

interface DateOption {
  id: string
  option_date: string
  option_time: string
  availability?: Array<{
    id: string
    name: string
    email: string
    is_available: boolean
  }>
}

interface DatePollingResultsProps {
  dateOptions: DateOption[]
}

export default function DatePollingResults({ dateOptions }: DatePollingResultsProps) {
  if (!dateOptions || dateOptions.length === 0) {
    return null
  }

  // Calculate results for each date option
  const results = dateOptions.map(option => {
    const totalVotes = option.availability?.length || 0
    const availableVotes = option.availability?.filter(a => a.is_available).length || 0
    const availabilityPercentage = totalVotes > 0 ? Math.round((availableVotes / totalVotes) * 100) : 0
    
    return {
      ...option,
      totalVotes,
      availableVotes,
      availabilityPercentage,
      date: new Date(option.option_date),
      time: option.option_time
    }
  })

  // Sort by availability percentage (highest first)
  const sortedResults = results.sort((a, b) => b.availabilityPercentage - a.availabilityPercentage)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#ffb829]" />
          Date Polling Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedResults.map((result, index) => (
          <div 
            key={result.id} 
            className={`p-4 rounded-lg border-2 transition-all ${
              index === 0 && result.availabilityPercentage > 0
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="font-semibold text-slate-800">
                    {formatDate(result.date)}
                  </p>
                  {result.time && (
                    <p className="text-sm text-slate-600">
                      {formatTime(result.time)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {index === 0 && result.availabilityPercentage > 0 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Most Popular
                    </Badge>
                  )}
                  <Badge 
                    variant={result.availabilityPercentage > 50 ? "default" : "secondary"}
                    className={result.availabilityPercentage > 50 ? "bg-[#ffb829] text-white" : ""}
                  >
                    {result.availabilityPercentage}%
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{result.availableVotes} of {result.totalVotes} available</span>
              </div>
              
              {result.availabilityPercentage > 0 && (
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        result.availabilityPercentage > 50 ? 'bg-[#ffb829]' : 'bg-gray-400'
                      }`}
                      style={{ width: `${result.availabilityPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {results.every(r => r.totalVotes === 0) && (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p>No votes yet - be the first to vote on dates!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
