"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, XCircle, Star, Mail, User } from "lucide-react"
import VenueDetailsComponent from "@/components/venue-details"
import { supabase, planHelpers } from "@/lib/supabase"
import { VotingInterface } from "@/components/voting/VotingInterface"

interface Plan {
  id: string
  eventName?: string
  name?: string
  date: string
  time: string
  activityType?: string
  activity_type?: string
  location?: {
    lat: number
    lng: number
    name: string
  }
  location_name?: string
  location_address?: string
  venue?: any
  participants?: Array<{ email: string; phone?: string }>
  createdAt?: string
  created_at?: string
}

interface RSVP {
  id: string
  plan_id: string
  user_email: string
  user_name: string
  status: 'going' | 'not_going' | 'maybe'
  created_at: string
}

interface Venue {
  id: string
  name: string
  type: string
  cuisine?: string
  rating: number
  price: string
  distance: string
  address: string
  description: string
}

export default function JoinPage() {
  const params = useParams()
  const router = useRouter()
  const shareCode = params.share_code as string
  
  // ADD THIS NEW CODE (keeps your existing code working):
  const [dbPlan, setDbPlan] = useState<any>(null)
  const [loadingDb, setLoadingDb] = useState(true)
  
  useEffect(() => {
    async function loadFromDatabase() {
      try {
        // Get the plan WITH its RSVPs and date options using direct Supabase query
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select(`
            *,
            rsvps (
              id,
              name,
              email,
              response,
              notes,
              created_at
            ),
            date_options (
              id,
              option_date,
              option_time,
              availability (
                id,
                name,
                email,
                is_available,
                created_at
              )
            )
          `)
          .eq('share_code', shareCode)
          .single()
        
        if (planError) throw planError
        
        setDbPlan(planData)
        console.log('✅ Loaded plan with RSVPs:', planData)
        
      } catch (error) {
        console.log('⚠️ Database not connected, using mock data:', error)
      } finally {
        setLoadingDb(false)
      }
    }
    
    loadFromDatabase()
  }, [shareCode])
  
  const [plan, setPlan] = useState<Plan | null>(null)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rsvpCounts, setRsvpCounts] = useState({
    going: 0,
    not_going: 0,
    maybe: 0
  })
  
  // Form state for new RSVP
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [rsvpNotes, setRsvpNotes] = useState("")
  const [currentUserRSVP, setCurrentUserRSVP] = useState<'going' | 'not_going' | 'maybe' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Date voting state
  const [dateVoting, setDateVoting] = useState<{[key: string]: boolean}>({})
  const [isSubmittingVote, setIsSubmittingVote] = useState(false)
  
  // RSVP summary toggle state
  const [showRSVPDetails, setShowRSVPDetails] = useState<{[key: string]: boolean}>({
    going: false,
    maybe: false,
    notGoing: false
  })

  useEffect(() => {
    const fetchPlanAndRSVPs = () => {
      try {
        setLoading(true)
        setError(null)

        // Use database data if available, otherwise fall back to localStorage
        let planData = null
        
        if (dbPlan) {
          // Use data from database
          planData = dbPlan
          console.log('✅ Using database data for plan')
        } else {
          // Fall back to localStorage
        const plansData = localStorage.getItem('plans')
        if (!plansData) {
          setError('Event not found')
          return
        }

        const plans = JSON.parse(plansData)
          planData = plans.find((p: any) => p.id === shareCode)

        if (!planData) {
          setError('Event not found')
          return
          }
          console.log('⚠️ Using localStorage fallback data')
        }

        setPlan(planData)

        // Fetch RSVPs from localStorage
        const rsvpsData = localStorage.getItem('rsvps')
        const rsvpsList = rsvpsData ? JSON.parse(rsvpsData).filter((r: RSVP) => r.plan_id === shareCode) : []
        setRsvps(rsvpsList)

        // Calculate counts
        const counts = {
          going: rsvpsList.filter((r: RSVP) => r.status === 'going').length,
          not_going: rsvpsList.filter((r: RSVP) => r.status === 'not_going').length,
          maybe: rsvpsList.filter((r: RSVP) => r.status === 'maybe').length
        }
        setRsvpCounts(counts)

        // Check if current user has RSVP'd (by email)
        const userRSVP = rsvpsList.find((r: RSVP) => r.user_email === userEmail)
        if (userRSVP) {
          setCurrentUserRSVP(userRSVP.status)
          setUserName(userRSVP.user_name)
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load event details')
      } finally {
        setLoading(false)
      }
    }

    if (shareCode) {
      fetchPlanAndRSVPs()
    }
  }, [shareCode, userEmail, dbPlan])

  // Add this RSVP handler function
  const handleRSVP = async (response: 'going' | 'not-going' | 'maybe') => {
    try {
      // Use form values instead of prompts
      if (!userName.trim()) {
        alert('Please enter your name first')
      return
    }

      const name = userName.trim()
      const email = userEmail.trim() || undefined
      
      // Map response values to match database schema
      const dbResponse = response === 'not-going' ? 'not_going' : response
      
      // Try database first if available
      if (dbPlan && planHelpers.isConfigured()) {
        try {
          await planHelpers.submitRSVP(dbPlan.id, {
            name: name,
            email: email,
            response: dbResponse as 'going' | 'not_going' | 'maybe',
            notes: rsvpNotes || undefined
          })
          
          alert(`Thanks ${name}! You're ${response} to ${dbPlan.name}!`)
          
          // Reload the plan data to show updated RSVP counts
          const { data: updatedPlan, error: reloadError } = await supabase
            .from('plans')
            .select(`
              *,
              rsvps (
                id,
                name,
                email,
                response,
                notes,
                created_at
              ),
              date_options (
                id,
                option_date,
                option_time,
                availability (
                  id,
                  name,
                  email,
                  is_available,
                  created_at
                )
              )
            `)
            .eq('share_code', shareCode)
            .single()
          
          if (!reloadError && updatedPlan) {
            setDbPlan(updatedPlan)
            console.log('✅ Reloaded plan with updated RSVPs:', updatedPlan)
          }
          return
        } catch (dbError) {
          console.log('Database RSVP failed, using localStorage fallback:', dbError)
        }
      }
      
      // Fallback to localStorage
      const rsvpData = {
          id: `rsvp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          plan_id: shareCode,
        user_email: email || 'no-email',
        user_name: name,
        status: response,
          created_at: new Date().toISOString()
        }
        
      const existingRsvps = localStorage.getItem('rsvps')
      const allRsvps = existingRsvps ? JSON.parse(existingRsvps) : []
      allRsvps.push(rsvpData)
      localStorage.setItem('rsvps', JSON.stringify(allRsvps))
      
      alert(`Thanks ${name}! You're ${response} to ${plan?.name || 'this event'}!`)
      window.location.reload()
      
    } catch (error) {
      console.error('RSVP error:', error)
      alert('Sorry, there was an error with your RSVP')
    }
  }

  // Handle date voting
  const handleDateVote = async (dateOptionId: string, isAvailable: boolean) => {
    if (!userName.trim()) {
      alert('Please enter your name first')
      return
    }
    
    setIsSubmittingVote(true)
    try {
      const { error } = await supabase
        .from('availability')
        .upsert({
          date_option_id: dateOptionId,
          name: userName.trim(),
          email: userEmail.trim() || undefined,
          is_available: isAvailable
        }, {
          onConflict: 'date_option_id,email'
        })
      
      if (error) throw error

      // Update local state
      setDateVoting(prev => ({
        ...prev,
        [dateOptionId]: isAvailable
      }))
      
      // Reload data to show updated votes
      const { data: updatedPlan, error: reloadError } = await supabase
        .from('plans')
        .select(`
          *,
          rsvps (
            id,
            name,
            email,
            response,
            notes,
            created_at
          ),
          date_options (
            id,
            option_date,
            option_time,
            availability (
              id,
              name,
              email,
              is_available,
              created_at
            )
          )
        `)
        .eq('share_code', shareCode)
        .single()
      
      if (!reloadError && updatedPlan) {
        setDbPlan(updatedPlan)
      }
      
    } catch (error) {
      console.error('Date vote error:', error)
      alert('Sorry, there was an error with your vote')
    } finally {
      setIsSubmittingVote(false)
    }
  }

  const getSuggestedVenues = (activityType: string): Venue[] => {
    const venues: { [key: string]: Venue[] } = {
      dinner: [
        {
          id: '1',
          name: 'The Copper Table',
          type: 'Restaurant',
          cuisine: 'Modern American',
          rating: 4.7,
          price: '$$$',
          distance: '0.3 miles away',
          address: '123 Main Street',
          description: 'Upscale farm-to-table dining with seasonal ingredients'
        },
        {
          id: '2',
          name: 'Sakura Sushi Bar',
          type: 'Restaurant',
          cuisine: 'Japanese',
          rating: 4.5,
          price: '$$',
          distance: '0.8 miles away',
          address: '456 Oak Avenue',
          description: 'Authentic Japanese sushi and sashimi'
        },
        {
          id: '3',
          name: 'Bella Vista Trattoria',
          type: 'Restaurant',
          cuisine: 'Italian',
          rating: 4.6,
          price: '$$',
          distance: '1.2 miles away',
          address: '789 Pine Street',
          description: 'Family-owned Italian restaurant with homemade pasta'
        }
      ],
      drinks: [
        {
          id: '4',
          name: 'The Velvet Lounge',
          type: 'Cocktail Bar',
          cuisine: 'Craft Cocktails',
          rating: 4.4,
          price: '$$',
          distance: '0.5 miles away',
          address: '321 Elm Street',
          description: 'Sophisticated cocktail bar with artisanal drinks'
        },
        {
          id: '5',
          name: 'Hops & Grains',
          type: 'Brewery',
          cuisine: 'Craft Beer',
          rating: 4.3,
          price: '$',
          distance: '0.9 miles away',
          address: '654 Maple Drive',
          description: 'Local brewery with food trucks and live music'
        },
        {
          id: '6',
          name: 'Skyline Rooftop',
          type: 'Rooftop Bar',
          cuisine: 'Wine & Cocktails',
          rating: 4.8,
          price: '$$$',
          distance: '1.1 miles away',
          address: '987 Hilltop Road',
          description: 'Rooftop bar with panoramic city views'
        }
      ],
      coffee: [
        {
          id: '7',
          name: 'Brew & Bean',
          type: 'Coffee Shop',
          cuisine: 'Artisan Coffee',
          rating: 4.6,
          price: '$',
          distance: '0.2 miles away',
          address: '147 Coffee Lane',
          description: 'Third-wave coffee shop with house-roasted beans'
        },
        {
          id: '8',
          name: 'The Daily Grind',
          type: 'Café',
          cuisine: 'Coffee & Pastries',
          rating: 4.4,
          price: '$',
          distance: '0.6 miles away',
          address: '258 Bakery Street',
          description: 'Cozy café with fresh pastries and specialty drinks'
        },
        {
          id: '9',
          name: 'Urban Roast',
          type: 'Coffee Roastery',
          cuisine: 'Premium Coffee',
          rating: 4.7,
          price: '$$',
          distance: '1.0 miles away',
          address: '369 Roast Way',
          description: 'Coffee roastery with tasting room and light bites'
        }
      ],
      activity: [
        {
          id: '10',
          name: 'Adventure Zone',
          type: 'Entertainment Center',
          cuisine: 'Activities',
          rating: 4.5,
          price: '$$',
          distance: '0.4 miles away',
          address: '741 Fun Street',
          description: 'Indoor rock climbing, escape rooms, and arcade games'
        },
        {
          id: '11',
          name: 'Riverside Park',
          type: 'Outdoor Recreation',
          cuisine: 'Nature',
          rating: 4.6,
          price: '$',
          distance: '0.7 miles away',
          address: '852 River Road',
          description: 'Scenic park with hiking trails and picnic areas'
        },
        {
          id: '12',
          name: 'Creative Studio',
          type: 'Art Workshop',
          cuisine: 'Creative',
          rating: 4.3,
          price: '$$',
          distance: '1.3 miles away',
          address: '963 Art Avenue',
          description: 'Art classes, pottery, and creative workshops'
        }
      ]
    }
    
    return venues[activityType] || venues.activity
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb829] mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {error || 'Event not found'}
          </p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Event Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {plan.eventName || plan.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {plan.activityType || plan.activity_type}
            </Badge>
            {plan.location && (
              <Badge variant="outline" className="text-lg px-4 py-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {plan.location.name}
              </Badge>
            )}
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            You've been invited to this event!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#ffb829]" />
                  <div>
                    <p className="font-medium">{formatDate(plan.date)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">{formatTime(plan.time)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#ffb829]" />
                  <div>
                    <p className="font-medium">{plan.location_name || plan.location?.name || "Location TBD"}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{plan.location_address || "Venue"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participants ({dbPlan?.rsvps?.length || 0})
                </CardTitle>
                <CardDescription>
                  People who have responded to this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(dbPlan?.rsvps?.length || 0) > 0 ? (
                  <div className="space-y-3">
                    {dbPlan?.rsvps?.map((rsvp: any) => (
                      <div key={rsvp.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              {rsvp.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {rsvp.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {rsvp.email}
                            </p>
                            {rsvp.notes && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1">
                                "{rsvp.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={
                            rsvp.response === 'going' ? 'default' : 
                            rsvp.response === 'maybe' ? 'secondary' : 'destructive'
                          }
                        >
                          {rsvp.response === 'going' ? 'Going' : 
                           rsvp.response === 'maybe' ? 'Maybe' : 'Not Going'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No responses yet</p>
                    <p className="text-sm">Be the first to RSVP!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RSVP Form */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  RSVP to this Event
                </CardTitle>
                <CardDescription>
                  Let us know if you're coming by entering your details below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Info Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={rsvpNotes}
                    onChange={(e) => setRsvpNotes(e.target.value)}
                    placeholder="e.g., I'm bringing chips and dip!"
                    className="min-h-[80px]"
                  />
                </div>

                {/* RSVP Buttons */}
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={currentUserRSVP === 'going' ? 'default' : 'outline'}
                    onClick={() => handleRSVP('going')}
                    disabled={isSubmitting}
                    className="flex flex-col items-center gap-2 py-6"
                  >
                    <span className="text-lg">✅</span>
                    <span>I'm Going</span>
                    <Badge variant="secondary">{dbPlan?.rsvps?.filter((r: any) => r.response === 'going').length || 0}</Badge>
                  </Button>
                  <Button
                    variant={currentUserRSVP === 'maybe' ? 'default' : 'outline'}
                    onClick={() => handleRSVP('maybe')}
                    disabled={isSubmitting}
                    className="flex flex-col items-center gap-2 py-6"
                  >
                    <span className="text-lg">🤔</span>
                    <span>Maybe</span>
                    <Badge variant="secondary">{dbPlan?.rsvps?.filter((r: any) => r.response === 'maybe').length || 0}</Badge>
                  </Button>
                  <Button
                    variant={currentUserRSVP === 'not_going' ? 'default' : 'outline'}
                    onClick={() => handleRSVP('not-going')}
                    disabled={isSubmitting}
                    className="flex flex-col items-center gap-2 py-6"
                  >
                    <span className="text-lg">❌</span>
                    <span>Can't Make It</span>
                    <Badge variant="secondary">{dbPlan?.rsvps?.filter((r: any) => r.response === 'not_going').length || 0}</Badge>
                  </Button>
                </div>

                {currentUserRSVP && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Thanks {userName}! You're {currentUserRSVP === 'going' ? 'going' : currentUserRSVP === 'maybe' ? 'maybe going' : 'not going'} to this event!
                    </p>
                  </div>
                )}

                {(!userName.trim() || !userEmail.trim()) && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Please enter your name and email to RSVP
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#ffb829]" />
                  Share This Event
                </CardTitle>
                <CardDescription>
                  Invite others to join this event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `${window.location.origin}/join/${shareCode}`
                      navigator.clipboard.writeText(url)
                      alert('Link copied to clipboard!')
                    }}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Copy Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const name = prompt('Your name:')
                      if (!name) return
                      
                      const phone = prompt('Recipient phone number (with country code, e.g., +1234567890):')
                      if (!phone) return
                      
                      try {
                        const response = await fetch('/api/send-sms', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            to: phone,
                            message: `Hi! ${name} invited you to "${plan?.name || 'an event'}" on ${plan?.date}. Join here: ${window.location.href}`
                          })
                        })
                        
                        if (response.ok) {
                          alert('SMS sent successfully!')
                        } else {
                          alert('Failed to send SMS. Please try again.')
                        }
                      } catch (error) {
                        console.error('SMS error:', error)
                        alert('Failed to send SMS. Please try again.')
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send SMS
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const name = prompt('Your name:')
                      if (!name) return
                      
                      const email = prompt('Recipient email:')
                      if (!email) return
                      
                      try {
                        const response = await fetch('/api/send-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            to: email,
                            subject: `You're invited to "${plan?.name || 'an event'}"`,
                            html: `
                              <h2>You're invited to an event!</h2>
                              <p>Hi there!</p>
                              <p><strong>${name}</strong> invited you to <strong>"${plan?.name || 'an event'}"</strong></p>
                              <p><strong>Date:</strong> ${plan?.date}</p>
                              <p><strong>Time:</strong> ${plan?.time}</p>
                              <p><strong>Location:</strong> ${plan?.location_name || 'TBD'}</p>
                              <br>
                              <a href="${window.location.href}" style="background: #ffb829; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Event</a>
                              <br><br>
                              <p>Best regards,<br>PlanPal AI</p>
                            `
                          })
                        })
                        
                        if (response.ok) {
                          alert('Email sent successfully!')
                        } else {
                          alert('Failed to send email. Please try again.')
                        }
                      } catch (error) {
                        console.error('Email error:', error)
                        alert('Failed to send email. Please try again.')
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>


            {/* Enhanced Voting Interface - Show if multiple date options exist */}
            {dbPlan?.date_options && dbPlan.date_options.length > 1 && (
              <div className="mt-12">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-6">
                  <div className="text-center">
                    <span className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium mb-2">
                      ✨ NEW: Advanced Voting System
                    </span>
                    <h3 className="text-xl font-semibold text-slate-800">
                      Vote on dates, venues, and activities
                    </h3>
                  </div>
                </div>
                
                <VotingInterface
                  planId={dbPlan.id}
                  shareCode={params.share_code as string}
                  dateOptions={dbPlan.date_options}
                  existingVotes={dbPlan.availability || []}
                  currentUserEmail={userEmail}
                />
                  </div>
                )}

            {/* Venue Information - Only show if venue is selected */}
            {plan.venue && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#ffb829]" />
                    Selected Venue
                  </CardTitle>
                  <CardDescription>
                    The venue chosen for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <VenueDetailsComponent 
                    venue={plan.venue} 
                    showFullDetails={true}
                    className="border-2 border-[#ffb829]/20 bg-[#ffb829]/5 rounded-lg p-4"
                  />
              </CardContent>
            </Card>
                )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RSVP Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Going */}
                <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                      <span className="text-lg">✅</span>
                    Going
                  </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{dbPlan?.rsvps?.filter((r: any) => r.response === 'going').length || 0}</Badge>
                      {dbPlan?.rsvps?.filter((r: any) => r.response === 'going').length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowRSVPDetails(prev => ({ ...prev, going: !prev.going }))}
                          className="h-6 w-6 p-0"
                        >
                          {showRSVPDetails.going ? '−' : '+'}
                        </Button>
                      )}
                </div>
                  </div>
                  {showRSVPDetails.going && dbPlan?.rsvps?.filter((r: any) => r.response === 'going').length > 0 && (
                    <div className="ml-6 space-y-1">
                      {dbPlan.rsvps.filter((r: any) => r.response === 'going').map((rsvp: any) => (
                        <div key={rsvp.id} className="text-sm text-slate-600 dark:text-slate-400">
                          • {rsvp.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Maybe */}
                <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🤔</span>
                    Maybe
                  </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{dbPlan?.rsvps?.filter((r: any) => r.response === 'maybe').length || 0}</Badge>
                      {dbPlan?.rsvps?.filter((r: any) => r.response === 'maybe').length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowRSVPDetails(prev => ({ ...prev, maybe: !prev.maybe }))}
                          className="h-6 w-6 p-0"
                        >
                          {showRSVPDetails.maybe ? '−' : '+'}
                        </Button>
                      )}
                </div>
                  </div>
                  {showRSVPDetails.maybe && dbPlan?.rsvps?.filter((r: any) => r.response === 'maybe').length > 0 && (
                    <div className="ml-6 space-y-1">
                      {dbPlan.rsvps.filter((r: any) => r.response === 'maybe').map((rsvp: any) => (
                        <div key={rsvp.id} className="text-sm text-slate-600 dark:text-slate-400">
                          • {rsvp.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Not Going */}
                <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">❌</span>
                    Not Going
                  </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{dbPlan?.rsvps?.filter((r: any) => r.response === 'not_going').length || 0}</Badge>
                      {dbPlan?.rsvps?.filter((r: any) => r.response === 'not_going').length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowRSVPDetails(prev => ({ ...prev, notGoing: !prev.notGoing }))}
                          className="h-6 w-6 p-0"
                        >
                          {showRSVPDetails.notGoing ? '−' : '+'}
                        </Button>
                      )}
                </div>
                  </div>
                  {showRSVPDetails.notGoing && dbPlan?.rsvps?.filter((r: any) => r.response === 'not_going').length > 0 && (
                    <div className="ml-6 space-y-1">
                      {dbPlan.rsvps.filter((r: any) => r.response === 'not_going').map((rsvp: any) => (
                        <div key={rsvp.id} className="text-sm text-slate-600 dark:text-slate-400">
                          • {rsvp.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Responses</span>
                    <Badge variant="outline">
                      {dbPlan?.rsvps?.length || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {new Date(plan.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Share Code</p>
                  <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {shareCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How to Use */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    1. Enter your name and email above
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    2. Click one of the RSVP buttons
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    3. Your response will be saved
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
