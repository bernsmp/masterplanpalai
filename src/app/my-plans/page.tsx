"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, Eye, Share2, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Plan {
  id: string
  name: string
  date: string
  time: string
  activity_type: string
  location_name?: string
  location_address?: string
  description?: string
  share_code: string
  creator_email: string
  creator_name: string
  created_at: string
  rsvps?: Array<{
    id: string
    name: string
    email: string
    response: string
  }>
}

export default function MyPlansPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadMyEvents = async () => {
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      const { data, error: dbError } = await supabase
        .from('plans')
        .select(`
          *,
          rsvps (
            id,
            name,
            email,
            response
          )
        `)
        .eq('creator_email', email.trim())
        .order('created_at', { ascending: false })
      
      if (dbError) throw dbError
      
      setPlans(data || [])
      
      if (data && data.length === 0) {
        setError("No events found for this email address")
      }
      
    } catch (error) {
      console.error('Error loading events:', error)
      setError("Failed to load your events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewEvent = (shareCode: string) => {
    router.push(`/join/${shareCode}`)
  }

  const handleShareEvent = (shareCode: string) => {
    const shareUrl = `${window.location.origin}/join/${shareCode}`
    navigator.clipboard.writeText(shareUrl)
    // You could add a toast notification here
    alert("Share link copied to clipboard!")
  }

  const getRSVPCounts = (rsvps: Plan['rsvps']) => {
    if (!rsvps) return { going: 0, maybe: 0, notGoing: 0, total: 0 }
    
    const going = rsvps.filter(r => r.response === 'going').length
    const maybe = rsvps.filter(r => r.response === 'maybe').length
    const notGoing = rsvps.filter(r => r.response === 'not-going').length
    
    return { going, maybe, notGoing, total: rsvps.length }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Events
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Enter your email to view and manage your created events
            </p>
          </div>

          {/* Email Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#ffb829]" />
                Find Your Events
              </CardTitle>
              <CardDescription>
                Enter the email address you used when creating events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    onKeyPress={(e) => e.key === 'Enter' && loadMyEvents()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={loadMyEvents}
                    disabled={loading || !email.trim()}
                    className="bg-[#ffb829] hover:bg-[#ffb829]/90"
                  >
                    {loading ? "Loading..." : "Find Events"}
                  </Button>
                </div>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Events List */}
          {plans.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Your Events ({plans.length})
                </h2>
                <Button 
                  onClick={() => router.push('/create')}
                  className="bg-[#ffb829] hover:bg-[#ffb829]/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Event
                </Button>
              </div>

              <div className="grid gap-6">
                {plans.map((plan) => {
                  const rsvpCounts = getRSVPCounts(plan.rsvps)
                  
                  return (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                {plan.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {plan.share_code}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {new Date(plan.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">
                                  {new Date(`2000-01-01T${plan.time}`).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                              
                              {plan.location_name && (
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{plan.location_name}</span>
                                </div>
                              )}
                            </div>

                            {plan.description && (
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                {plan.description}
                              </p>
                            )}

                            {/* RSVP Summary */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-400">
                                  {rsvpCounts.total} responses
                                </span>
                              </div>
                              
                              {rsvpCounts.going > 0 && (
                                <Badge variant="default" className="text-xs">
                                  {rsvpCounts.going} going
                                </Badge>
                              )}
                              
                              {rsvpCounts.maybe > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {rsvpCounts.maybe} maybe
                                </Badge>
                              )}
                              
                              {rsvpCounts.notGoing > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {rsvpCounts.notGoing} can't go
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEvent(plan.share_code)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShareEvent(plan.share_code)}
                              className="flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {plans.length === 0 && !loading && email && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-sm mb-6">
                    No events were found for this email address. Create your first event to get started!
                  </p>
                  <Button 
                    onClick={() => router.push('/create')}
                    className="bg-[#ffb829] hover:bg-[#ffb829]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}