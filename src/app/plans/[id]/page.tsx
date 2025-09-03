"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, XCircle, Star, Share2, Edit, Check, Plus } from "lucide-react"
import VenueDetailsComponent from "@/components/venue-details"

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
  venue?: any
  participants?: Array<{ email: string; phone?: string }>
  createdAt?: string
  created_at?: string
}

interface RSVP {
  id: string
  plan_id: string
  user_id: string
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

export default function PlanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params.id as string
  
  const [plan, setPlan] = useState<Plan | null>(null)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserRSVP, setCurrentUserRSVP] = useState<'going' | 'not_going' | 'maybe' | null>(null)
  const [rsvpCounts, setRsvpCounts] = useState({
    going: 0,
    not_going: 0,
    maybe: 0
  })
  const [copied, setCopied] = useState(false)
  const [isSendingSMS, setIsSendingSMS] = useState(false)
  const [smsResults, setSmsResults] = useState<any>(null)

  useEffect(() => {
    const fetchPlan = () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch plans from localStorage
        const plansData = localStorage.getItem('plans')
        if (!plansData) {
          setError('Plan not found')
          return
        }

        const plans = JSON.parse(plansData)
        const planData = plans.find((p: any) => p.id === planId)

        if (!planData) {
          setError('Plan not found')
          return
        }

        setPlan(planData)

        // Fetch RSVPs from localStorage
        const rsvpsData = localStorage.getItem('rsvps')
        const rsvpsList = rsvpsData ? JSON.parse(rsvpsData).filter((r: RSVP) => r.plan_id === planId) : []
        setRsvps(rsvpsList)

        // Calculate counts
        const counts = {
          going: rsvpsList.filter((r: RSVP) => r.status === 'going').length,
          not_going: rsvpsList.filter((r: RSVP) => r.status === 'not_going').length,
          maybe: rsvpsList.filter((r: RSVP) => r.status === 'maybe').length
        }
        setRsvpCounts(counts)

      } catch (error) {
        console.error('Error fetching plan:', error)
        setError('Failed to load plan details')
      } finally {
        setLoading(false)
      }
    }

    if (planId) {
      fetchPlan()
    }
  }, [planId])

  const handleRSVP = async (status: 'going' | 'not_going' | 'maybe') => {
    try {
      const userId = 'test-user' // Hardcoded for development

      // Check if user already has an RSVP
      const existingRSVP = rsvps.find((r: RSVP) => r.user_id === userId)

      if (existingRSVP) {
        // Update existing RSVP
        setRsvps(prev => prev.map((r: RSVP) => 
          r.id === existingRSVP.id ? { ...r, status } : r
        ))
      } else {
        // Create new RSVP
        const newRSVP: RSVP = {
          id: `rsvp_${Date.now()}`,
          plan_id: planId,
          user_id: userId,
          status,
          created_at: new Date().toISOString()
        }
        
        setRsvps(prev => [...prev, newRSVP])
      }

      // Update counts
      const newCounts = {
        going: rsvps.filter((r: RSVP) => r.status === 'going').length + (status === 'going' ? 1 : 0),
        not_going: rsvps.filter((r: RSVP) => r.status === 'not_going').length + (status === 'not_going' ? 1 : 0),
        maybe: rsvps.filter((r: RSVP) => r.status === 'maybe').length + (status === 'maybe' ? 1 : 0)
      }
      setRsvpCounts(newCounts)

      setCurrentUserRSVP(status)
    } catch (error) {
      console.error('Error updating RSVP:', error)
    }
  }

  const handleCopyInviteLink = async () => {
    const shareCode = planId
    const inviteLink = `${window.location.origin}/join/${shareCode}`
    
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = inviteLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const sendSMSInvites = async () => {
    if (!plan) return

    setIsSendingSMS(true)
    setSmsResults(null)
    
    try {
      const inviteLink = `${window.location.origin}/join/${planId}`
      const message = `🎉 You're invited to: ${plan.name}\n📅 ${plan.date} at ${plan.time}\n📍 ${plan.activity_type}\n\nJoin here: ${inviteLink}\n\nSent via PlanPal AI`

      // For now, we'll use a mock phone number since we don't have the plan's phone numbers
      // In a real app, you'd get these from the plan data
      const mockPhoneNumbers = ['+15551234567'] // This would come from plan.phoneNumbers

      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_APP_PASSWORD}`,
        },
        body: JSON.stringify({
          phoneNumbers: mockPhoneNumbers,
          message
        })
      })

      const result = await response.json()

      if (result.success) {
        setSmsResults(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 4000)
      } else {
        throw new Error(result.error || 'Failed to send SMS')
      }
    } catch (error: any) {
      console.error('SMS error:', error)
      setSmsResults({ error: error.message })
    } finally {
      setIsSendingSMS(false)
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
          <p className="text-slate-600 dark:text-slate-300">Loading plan details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Plan Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/my-plans')}
              className="w-full bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Plans
            </Button>
            <Button
              onClick={() => router.push('/create')}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Plan
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Plan not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
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
          onClick={() => router.push('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Plan Header */}
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
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Details */}
          <div className="lg:col-span-2">
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
                    <p className="font-medium">Location TBD</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Venue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RSVP Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  RSVP
                </CardTitle>
                <CardDescription>
                  Let us know if you're coming to this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Button
                    variant={currentUserRSVP === 'going' ? 'default' : 'outline'}
                    onClick={() => handleRSVP('going')}
                    className="flex flex-col items-center gap-2 py-6"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>I'm Going</span>
                    <Badge variant="secondary">{rsvpCounts.going}</Badge>
                  </Button>
                  <Button
                    variant={currentUserRSVP === 'maybe' ? 'default' : 'outline'}
                    onClick={() => handleRSVP('maybe')}
                    className="flex flex-col items-center gap-2 py-6"
                  >
                    <span className="text-lg">🤔</span>
                    <span>Maybe</span>
                    <Badge variant="secondary">{rsvpCounts.maybe}</Badge>
                  </Button>
                  <Button
                    variant={currentUserRSVP === 'not_going' ? 'default' : 'outline'}
                    onClick={() => handleRSVP('not_going')}
                    className="flex flex-col items-center gap-2 py-6"
                  >
                    <XCircle className="w-6 h-6" />
                    <span>Can't Make It</span>
                    <Badge variant="secondary">{rsvpCounts.not_going}</Badge>
                  </Button>
                </div>

                {currentUserRSVP && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      You're {currentUserRSVP === 'going' ? 'going' : currentUserRSVP === 'maybe' ? 'maybe going' : 'not going'} to this event!
                    </p>
                  </div>
                )}

                {/* Send Invites Section */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyInviteLink}
                      variant="outline"
                      className="flex-1 flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Link Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={sendSMSInvites}
                      disabled={isSendingSMS}
                      variant="default"
                      className="flex-1 flex items-center gap-2 bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]"
                    >
                      {isSendingSMS ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          📱 Send SMS
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Copy the link or send professional SMS invites
                  </p>

                  {/* SMS Results */}
                  {smsResults && (
                    <div className={`p-3 rounded-lg text-sm ${
                      smsResults.error 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' 
                        : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    }`}>
                      {smsResults.error ? (
                        <p>❌ SMS failed: {smsResults.error}</p>
                      ) : (
                        <div>
                          <p className="font-medium">✅ SMS sent successfully!</p>
                          <p className="text-xs mt-1">
                            {smsResults.summary.successful} of {smsResults.summary.total} messages delivered
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Venue Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ffb829]" />
                  {plan.venue ? 'Selected Venue' : 'Suggested Venues'}
                </CardTitle>
                <CardDescription>
                  {plan.venue 
                    ? 'The venue chosen for this event'
                    : `Great places for your ${plan.activityType || plan.activity_type} event`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {plan.venue ? (
                  /* Selected Venue Display */
                  <VenueDetailsComponent 
                    venue={plan.venue} 
                    showFullDetails={true}
                    className="border-2 border-[#ffb829]/20 bg-[#ffb829]/5 rounded-lg p-4"
                  />
                ) : (
                  /* Fallback to Suggested Venues */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getSuggestedVenues(plan.activityType || plan.activity_type || 'dining').map((venue) => (
                      <Card key={venue.id} className="hover:shadow-md transition-shadow border-2 hover:border-[#ffb829]/30 dark:hover:border-[#ffb829]/60">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Venue Header */}
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">
                                {venue.name}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {venue.type} • {venue.cuisine || venue.type}
                              </p>
                            </div>

                            {/* Rating and Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  {venue.rating}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {venue.price}
                              </Badge>
                            </div>

                            {/* Distance */}
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {venue.distance}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {venue.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RSVP Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Going
                  </span>
                  <Badge variant="secondary">{rsvpCounts.going}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🤔</span>
                    Maybe
                  </span>
                  <Badge variant="secondary">{rsvpCounts.maybe}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Not Going
                  </span>
                  <Badge variant="secondary">{rsvpCounts.not_going}</Badge>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Responses</span>
                    <Badge variant="outline">
                      {rsvpCounts.going + rsvpCounts.maybe + rsvpCounts.not_going}
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
                    {new Date(plan.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Event ID</p>
                  <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {plan.id}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Share Code</p>
                  <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {planId}
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
