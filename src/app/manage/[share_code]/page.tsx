"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { planHelpers } from "@/lib/supabase"
import { useToastContext } from "@/components/ui/toast-provider"

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
    email?: string
    response: 'going' | 'maybe' | 'not-going'
    notes?: string
    created_at: string
  }>
  date_options?: Array<{
    id: string
    option_date: string
    option_time: string
    availability?: Array<{
      id: string
      name: string
      email?: string
      is_available: boolean
    }>
  }>
}

export default function ManageEventPage() {
  const params = useParams()
  const router = useRouter()
  const shareCode = params.share_code as string
  const { toast } = useToastContext()
  
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatorEmail, setCreatorEmail] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Load plan data
  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await planHelpers.getPlanByShareCode(shareCode)
        if (data) {
          setPlan(data)
          console.log('✅ Loaded plan for management:', data)
        }
      } catch (error) {
        console.error('Error loading plan:', error)
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (shareCode) {
      loadPlan()
    }
  }, [shareCode])

  // Verify creator access
  const handleVerifyCreator = () => {
    if (!plan || !creatorEmail) return
    
    if (creatorEmail.toLowerCase() === plan.creator_email.toLowerCase()) {
      setIsVerified(true)
      toast({
        title: "Access Granted",
        description: "You are now managing this event"
      })
    } else {
      toast({
        title: "Access Denied",
        description: "This email is not the event creator",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Event Not Found</CardTitle>
            <CardDescription className="text-center">
              The event you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/')} 
              className="w-full"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show verification form if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Event Management Access</CardTitle>
            <CardDescription className="text-center">
              Enter your email to manage this event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Creator Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyCreator()}
              />
            </div>
            <Button 
              onClick={handleVerifyCreator}
              className="w-full"
              disabled={!creatorEmail}
            >
              Verify Access
            </Button>
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push(`/join/${shareCode}`)}
                className="text-sm"
              >
                View as Attendee Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate RSVP stats
  const rsvpStats = {
    going: plan.rsvps?.filter(r => r.response === 'going').length || 0,
    maybe: plan.rsvps?.filter(r => r.response === 'maybe').length || 0,
    notGoing: plan.rsvps?.filter(r => r.response === 'not-going').length || 0,
    total: plan.rsvps?.length || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Manage Event
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Share Code: <span className="font-mono font-semibold">{shareCode}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => router.push(`/join/${shareCode}`)}
              >
                View as Attendee
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/my-plans')}
              >
                My Events
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📅 Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Event Name</Label>
                    <p className="text-lg font-semibold">{plan.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Activity Type</Label>
                    <p className="text-lg font-semibold">{plan.activity_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Date</Label>
                    <p className="text-lg font-semibold">{plan.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Time</Label>
                    <p className="text-lg font-semibold">{plan.time}</p>
                  </div>
                  {plan.location_name && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Location</Label>
                      <p className="text-lg font-semibold">{plan.location_name}</p>
                      {plan.location_address && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{plan.location_address}</p>
                      )}
                    </div>
                  )}
                </div>
                {plan.description && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Description</Label>
                    <p className="text-slate-700 dark:text-slate-300">{plan.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RSVP Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 RSVP Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{rsvpStats.going}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Going</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{rsvpStats.maybe}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Maybe</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{rsvpStats.notGoing}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Not Going</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{rsvpStats.total}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">📧</span>
                    <span>Email All Attendees</span>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">📱</span>
                    <span>Text All Attendees</span>
                  </Button>
                  <Button className="h-auto p-4 flex flex-col items-center gap-2">
                    <span className="text-2xl">👥</span>
                    <span>Add Attendee</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Attendee Management
                </CardTitle>
                <CardDescription>
                  Manage your event attendees and their RSVPs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {plan.rsvps && plan.rsvps.length > 0 ? (
                  <div className="space-y-4">
                    {plan.rsvps.map((rsvp) => (
                      <div key={rsvp.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold">{rsvp.name}</div>
                          {rsvp.email && (
                            <div className="text-sm text-slate-600 dark:text-slate-400">{rsvp.email}</div>
                          )}
                          {rsvp.notes && (
                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rsvp.notes}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              rsvp.response === 'going' ? 'default' :
                              rsvp.response === 'maybe' ? 'secondary' : 'destructive'
                            }
                          >
                            {rsvp.response === 'going' ? 'Going' :
                             rsvp.response === 'maybe' ? 'Maybe' : 'Not Going'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    No attendees yet. Share the event link to get RSVPs!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💬 Communication Hub
                </CardTitle>
                <CardDescription>
                  Send messages to your attendees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                  Communication features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚙️ Event Settings
                </CardTitle>
                <CardDescription>
                  Manage your event configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                  Settings features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
