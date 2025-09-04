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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  
  // Communication states
  const [emailMessage, setEmailMessage] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isSendingSms, setIsSendingSms] = useState(false)
  
  // Attendee management states
  const [newAttendeeName, setNewAttendeeName] = useState('')
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('')
  const [isAddingAttendee, setIsAddingAttendee] = useState(false)
  
  // Event management states
  const [isEditingEvent, setIsEditingEvent] = useState(false)
  const [isDeletingEvent, setIsDeletingEvent] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    date: '',
    time: '',
    location_name: '',
    location_address: '',
    description: ''
  })

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

  // Communication handlers
  const handleEmailAllAttendees = async () => {
    if (!plan || !plan.rsvps || plan.rsvps.length === 0) {
      toast({
        title: "No Attendees",
        description: "No attendees to email yet",
        variant: "destructive"
      })
      return
    }

    if (!emailMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive"
      })
      return
    }

    setIsSendingEmail(true)
    try {
      const emails = plan.rsvps
        .filter(rsvp => rsvp.email)
        .map(rsvp => rsvp.email!)

      let successCount = 0
      let errorCount = 0

      for (const email of emails) {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: `Update about "${plan.name}"`,
              html: `
                <h2>Event Update</h2>
                <p>Hi there!</p>
                <p><strong>${plan.creator_name}</strong> sent you an update about <strong>"${plan.name}"</strong></p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  ${emailMessage.replace(/\n/g, '<br>')}
                </div>
                <p><strong>Event Details:</strong></p>
                <ul>
                  <li><strong>Date:</strong> ${plan.date}</li>
                  <li><strong>Time:</strong> ${plan.time}</li>
                  ${plan.location_name ? `<li><strong>Location:</strong> ${plan.location_name}</li>` : ''}
                </ul>
                <br>
                <a href="${window.location.origin}/join/${plan.share_code}" style="background: #ffb829; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Event</a>
                <br><br>
                <p style="color: #64748b; font-size: 14px;">This message was sent by the event organizer.</p>
              `
            })
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error(`Failed to send email to ${email}:`, errorData)
            errorCount++
          } else {
            successCount++
          }
        } catch (error) {
          console.error(`Error sending email to ${email}:`, error)
          errorCount++
        }
      }

      if (errorCount > 0) {
        toast({
          title: "Email Results",
          description: `Sent to ${successCount} attendees, ${errorCount} failed`,
          variant: successCount > 0 ? "default" : "destructive"
        })
      } else {
        toast({
          title: "Emails Sent",
          description: `Successfully sent to ${successCount} attendees`
        })
      }
      setEmailMessage('')
    } catch (error) {
      console.error('Error sending emails:', error)
      toast({
        title: "Error",
        description: "Failed to send emails. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleSmsAllAttendees = async () => {
    if (!plan || !plan.rsvps || plan.rsvps.length === 0) {
      toast({
        title: "No Attendees",
        description: "No attendees to text yet",
        variant: "destructive"
      })
      return
    }

    if (!smsMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive"
      })
      return
    }

    setIsSendingSms(true)
    try {
      const phoneNumbers = plan.rsvps
        .filter(rsvp => rsvp.email) // For now, we'll use email as phone placeholder
        .map(rsvp => rsvp.email!)

      for (const phone of phoneNumbers) {
        await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: phone,
            message: `Event Update: ${plan.name}\n\n${smsMessage}\n\nView: ${window.location.origin}/join/${plan.share_code}`
          })
        })
      }

      toast({
        title: "Texts Sent",
        description: `Sent update to ${phoneNumbers.length} attendees`
      })
      setSmsMessage('')
    } catch (error) {
      console.error('Error sending texts:', error)
      toast({
        title: "Error",
        description: "Failed to send texts. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSendingSms(false)
    }
  }

  // Attendee management handlers
  const handleAddAttendee = async () => {
    if (!plan || !newAttendeeName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter attendee name",
        variant: "destructive"
      })
      return
    }

    setIsAddingAttendee(true)
    try {
      await planHelpers.submitRSVP(plan.id, {
        name: newAttendeeName.trim(),
        email: newAttendeeEmail.trim() || undefined,
        response: 'going' // Default to going when manually added
      })

      // Reload plan data
      const updatedPlan = await planHelpers.getPlanByShareCode(shareCode)
      setPlan(updatedPlan)

      toast({
        title: "Attendee Added",
        description: `${newAttendeeName} has been added to the event`
      })

      setNewAttendeeName('')
      setNewAttendeeEmail('')
    } catch (error) {
      console.error('Error adding attendee:', error)
      toast({
        title: "Error",
        description: "Failed to add attendee. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAddingAttendee(false)
    }
  }

  // Event management handlers
  const handleEditEvent = () => {
    if (!plan) return
    setEditFormData({
      name: plan.name,
      date: plan.date,
      time: plan.time,
      location_name: plan.location_name || '',
      location_address: plan.location_address || '',
      description: plan.description || ''
    })
    setIsEditingEvent(true)
  }

  const handleSaveEvent = async () => {
    if (!plan) return

    try {
      // Update event in database
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('plans')
        .update({
          name: editFormData.name,
          date: editFormData.date,
          time: editFormData.time,
          location_name: editFormData.location_name,
          location_address: editFormData.location_address,
          description: editFormData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', plan.id)

      if (error) throw error

      // Reload plan data
      const updatedPlan = await planHelpers.getPlanByShareCode(shareCode)
      setPlan(updatedPlan)

      toast({
        title: "Event Updated",
        description: "Event details have been saved"
      })

      setIsEditingEvent(false)
    } catch (error) {
      console.error('Error updating event:', error)
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteEvent = async () => {
    if (!plan) return

    try {
      // Delete event from database
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', plan.id)

      if (error) throw error

      toast({
        title: "Event Deleted",
        description: "Event has been permanently deleted"
      })

      // Redirect to my plans
      router.push('/my-plans')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeletingEvent(false)
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
                onClick={handleEditEvent}
              >
                Edit Event
              </Button>
              <Button 
                variant="destructive"
                onClick={() => setIsDeletingEvent(true)}
              >
                Delete Event
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-auto p-4 flex flex-col items-center gap-2" disabled={!plan?.rsvps?.length}>
                        <span className="text-2xl">📧</span>
                        <span>Email All Attendees</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Email All Attendees</DialogTitle>
                        <DialogDescription>
                          Send an update to all {plan?.rsvps?.length || 0} attendees
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email-message">Message</Label>
                          <Textarea
                            id="email-message"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            placeholder="Enter your message to all attendees..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button 
                          onClick={handleEmailAllAttendees}
                          disabled={isSendingEmail || !emailMessage.trim()}
                          className="w-full"
                        >
                          {isSendingEmail ? "Sending..." : "Send Email to All"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-auto p-4 flex flex-col items-center gap-2" disabled={!plan?.rsvps?.length}>
                        <span className="text-2xl">📱</span>
                        <span>Text All Attendees</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Text All Attendees</DialogTitle>
                        <DialogDescription>
                          Send a text message to all {plan?.rsvps?.length || 0} attendees
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sms-message">Message</Label>
                          <Textarea
                            id="sms-message"
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            placeholder="Enter your text message..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button 
                          onClick={handleSmsAllAttendees}
                          disabled={isSendingSms || !smsMessage.trim()}
                          className="w-full"
                        >
                          {isSendingSms ? "Sending..." : "Send Text to All"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-auto p-4 flex flex-col items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <span>Add Attendee</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Attendee</DialogTitle>
                        <DialogDescription>
                          Manually add someone to your event
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="attendee-name">Name *</Label>
                          <Input
                            id="attendee-name"
                            value={newAttendeeName}
                            onChange={(e) => setNewAttendeeName(e.target.value)}
                            placeholder="Enter attendee name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="attendee-email">Email (optional)</Label>
                          <Input
                            id="attendee-email"
                            type="email"
                            value={newAttendeeEmail}
                            onChange={(e) => setNewAttendeeEmail(e.target.value)}
                            placeholder="Enter attendee email"
                          />
                        </div>
                        <Button 
                          onClick={handleAddAttendee}
                          disabled={isAddingAttendee || !newAttendeeName.trim()}
                          className="w-full"
                        >
                          {isAddingAttendee ? "Adding..." : "Add Attendee"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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

        {/* Edit Event Dialog */}
        <Dialog open={isEditingEvent} onOpenChange={setIsEditingEvent}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update your event details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Event Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Time *</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location Name</Label>
                  <Input
                    id="edit-location"
                    value={editFormData.location_name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, location_name: e.target.value }))}
                    placeholder="Enter location name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-address">Location Address</Label>
                <Input
                  id="edit-address"
                  value={editFormData.location_address}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, location_address: e.target.value }))}
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => setIsEditingEvent(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEvent}
                  disabled={!editFormData.name || !editFormData.date || !editFormData.time}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Event Dialog */}
        <Dialog open={isDeletingEvent} onOpenChange={setIsDeletingEvent}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{plan?.name}"? This action cannot be undone and will remove all RSVPs and data associated with this event.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline"
                onClick={() => setIsDeletingEvent(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteEvent}
              >
                Delete Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
