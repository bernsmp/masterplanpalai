"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BorderTrail } from "@/components/ui/border-trail"
import { ParticleButton } from "@/components/ui/particle-button"
import { Calendar, Clock, Users, Plus, X, MapPin, Sparkles } from "lucide-react"
import LocationSearch from "@/components/location-search"
import VenueRecommendations from "@/components/venue-recommendations"
import WeatherService from "@/components/weather-service"

export default function CreatePlanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
    activityType: "",
    location: null as { lat: number; lng: number; name: string } | null,
    venue: null as any | null,
    participants: [] as Array<{ email: string; phone?: string }>
  })

  const [newParticipant, setNewParticipant] = useState({ email: "", phone: "" })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [isSendingInvites, setIsSendingInvites] = useState(false)
  const [weather, setWeather] = useState<any>(null)

  const activityTypes = [
    { value: "dinner", label: "Dinner", icon: "🍽️" },
    { value: "drinks", label: "Drinks", icon: "🍸" },
    { value: "coffee", label: "Coffee", icon: "☕" },
    { value: "activity", label: "Activity", icon: "🎯" }
  ]

  const getTimeSuggestions = () => {
    const today = new Date()
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    return [
      {
        id: 1,
        date: "Friday",
        time: "7:00 PM",
        description: "Most people free after work",
        availability: "High",
        icon: "🌅",
        calculatedDate: (() => {
          const targetDay = 5 // Friday
          const currentDay = today.getDay()
          let daysToAdd = targetDay - currentDay
          if (daysToAdd <= 0) daysToAdd += 7
          const date = new Date(today)
          date.setDate(today.getDate() + daysToAdd)
          return date
        })()
      },
      {
        id: 2,
        date: "Saturday",
        time: "2:00 PM",
        description: "Weekend afternoon",
        availability: "Medium",
        icon: "☀️",
        calculatedDate: (() => {
          const targetDay = 6 // Saturday
          const currentDay = today.getDay()
          let daysToAdd = targetDay - currentDay
          if (daysToAdd <= 0) daysToAdd += 7
          const date = new Date(today)
          date.setDate(today.getDate() + daysToAdd)
          return date
        })()
      },
      {
        id: 3,
        date: "Thursday",
        time: "8:00 PM",
        description: "Avoid traffic",
        availability: "High",
        icon: "🌙",
        calculatedDate: (() => {
          const targetDay = 4 // Thursday
          const currentDay = today.getDay()
          let daysToAdd = targetDay - currentDay
          if (daysToAdd <= 0) daysToAdd += 7
          const date = new Date(today)
          date.setDate(today.getDate() + daysToAdd)
          return date
        })()
      }
    ]
  }

  const timeSuggestions = getTimeSuggestions()

  const handleTimeSuggestionSelect = (suggestion: typeof timeSuggestions[0]) => {
    // Convert 12-hour time to 24-hour format for HTML time input
    const convertTo24Hour = (time12: string) => {
      const [time, period] = time12.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours)
      
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes}`
    }
    
    // Convert suggestion to form data
    setFormData(prev => ({
      ...prev,
      date: suggestion.calculatedDate.toISOString().split('T')[0],
      time: convertTo24Hour(suggestion.time)
    }))
    
    setShowTimeModal(false)
    
    // Show brief success message
    setToastMessage("Time selected successfully!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleAddParticipant = () => {
    if (newParticipant.email.trim()) {
      // Check if email already exists
      const emailExists = formData.participants.some(p => p.email === newParticipant.email.trim())
      
      if (!emailExists) {
        setFormData(prev => ({
          ...prev,
          participants: [...prev.participants, {
            email: newParticipant.email.trim(),
            phone: newParticipant.phone.trim() || undefined
          }]
        }))
        setNewParticipant({ email: "", phone: "" })
      }
    }
  }

  const handleRemoveParticipant = (email: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.email !== email)
    }))
  }

  const handleUpdateParticipant = (email: string, field: 'email' | 'phone', value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.email === email ? { ...p, [field]: value } : p
      )
    }))
  }

  const handleLocationSelect = (location: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng,
        name: location.name
      },
      venue: null // Reset venue when location changes
    }))
  }

  const handleVenueSelect = (venue: any) => {
    setFormData(prev => ({
      ...prev,
      venue: venue
    }))
  }

  const sendEmailInvites = async (planId: string) => {
    const emailAddresses = formData.participants
      .filter(p => p.email && p.email.trim())
      .map(p => p.email!.trim())
    
    if (emailAddresses.length === 0) {
      return { success: 0, failed: 0 }
    }

    let successCount = 0
    let failedCount = 0

    for (const email of emailAddresses) {
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            eventName: formData.eventName,
            date: formData.date,
            time: formData.time,
            location: formData.location?.name,
            venue: formData.venue ? {
              name: formData.venue.name,
              address: formData.venue.formatted_address,
              rating: formData.venue.rating,
              priceLevel: formData.venue.price_level
            } : undefined,
            shareCode: planId,
            organizerName: "Your friend" // Could be dynamic in the future
          })
        })

        const result = await response.json()
        if (result.success) {
          successCount++
        } else {
          failedCount++
        }
      } catch (error) {
        console.error('Email error for', email, ':', error)
        failedCount++
      }
    }

    return { success: successCount, failed: failedCount }
  }

  const sendSMSInvites = async (planId: string) => {
    const phoneNumbers = formData.participants
      .filter(p => p.phone && p.phone.trim())
      .map(p => p.phone!.trim())
    
    if (phoneNumbers.length === 0) {
      return { success: 0, failed: 0 }
    }
    
    try {
      const inviteLink = `${window.location.origin}/join/${planId}`
      const message = `🎉 You're invited to: ${formData.eventName}\n📅 ${formData.date} at ${formData.time}\n📍 ${formData.activityType}\n\nJoin here: ${inviteLink}\n\nSent via PlanPal AI`

      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumbers,
          message
        })
      })

      const result = await response.json()

      if (result.success) {
        return { success: result.summary.successful, failed: result.summary.failed }
      } else {
        throw new Error(result.error || 'Failed to send SMS')
      }
    } catch (error: any) {
      console.error('SMS error:', error)
      return { success: 0, failed: phoneNumbers.length }
    }
  }

  const sendAllInvites = async (planId: string) => {
    setIsSendingInvites(true)
    
    try {
      const [emailResults, smsResults] = await Promise.all([
        sendEmailInvites(planId),
        sendSMSInvites(planId)
      ])

      const totalSuccess = emailResults.success + smsResults.success
      const totalFailed = emailResults.failed + smsResults.failed

      let message = ""
      if (totalSuccess > 0) {
        message = `Invites sent! ${totalSuccess} successful`
        if (totalFailed > 0) {
          message += `, ${totalFailed} failed`
        }
      } else {
        message = "No invites sent - check participant contact info"
      }

      setToastMessage(message)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    } catch (error: any) {
      console.error('Invite error:', error)
      setToastMessage(`Invites failed: ${error.message}`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    } finally {
      setIsSendingInvites(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate unique ID for the plan
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create plan object with additional metadata
    const planData = {
      ...formData,
      id: planId,
      createdAt: new Date().toISOString()
    }
    
    // Store in localStorage
    const existingPlans = localStorage.getItem('plans')
    const plans = existingPlans ? JSON.parse(existingPlans) : []
    plans.push(planData)
    localStorage.setItem('plans', JSON.stringify(plans))
    
    // Show success toast
    setToastMessage("Plan created successfully!")
    setShowToast(true)
    
    // Send invites (email and/or SMS) if there are participants
    if (formData.participants.length > 0) {
      sendAllInvites(planId)
    }
    
    // Redirect to plan details page after a short delay
    setTimeout(() => {
      router.push(`/plans/${planId}`)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
        <div className="text-center mb-8">
          <div className="relative flex items-center justify-center mb-6">
            {/* Left side navigation */}
            <div className="absolute left-0">
              <Button
                onClick={() => router.push('/my-plans')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                My Plans
              </Button>
            </div>
            
            {/* Centered logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="PlanPal AI Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">PlanPal AI</span>
            </div>
            
            {/* Right side navigation */}
            <div className="absolute right-0">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
              >
                Home
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create a New Plan
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Plan the perfect get-together with your friends
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-4xl mx-auto px-5">
          <div className={formData.location ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}>
            {/* Main Form */}
            <div className={formData.location ? "lg:col-span-2" : ""}>
              <Card className="shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/95 dark:hover:bg-slate-800/95 group">
                <BorderTrail className="bg-[#ffb829] group-hover:bg-[#e6a025] transition-colors duration-300" size={50} delay={0} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#ffb829]" />
                      Create a New Plan
                    </CardTitle>
                    <CardDescription>
                      Fill out the details below to create your perfect plan
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Friday Night Dinner, Weekend Hike"
                  value={formData.eventName}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  required
                  className="invalid:border-red-500 invalid:ring-red-500"
                />
              </div>

              {/* Date and Time Row */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Date & Time</Label>
                  
                  {/* Find Best Time Button */}
                  <Dialog open={showTimeModal} onOpenChange={setShowTimeModal}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Find Best Time
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#ffb829]" />
                          AI Time Suggestions
                        </DialogTitle>
                        <DialogDescription>
                          Based on typical availability patterns, here are the best times for your event:
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-3">
                        {timeSuggestions.map((suggestion) => (
                          <Card
                            key={suggestion.id}
                            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-[#ffb829]/30 dark:hover:border-[#ffb829]/60"
                            onClick={() => handleTimeSuggestionSelect(suggestion)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{suggestion.icon}</span>
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                      {suggestion.date} {suggestion.time}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                      {suggestion.description}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {suggestion.calculatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant={suggestion.availability === "High" ? "default" : "secondary"}
                                  className={suggestion.availability === "High" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                                >
                                  {suggestion.availability} Availability
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className="invalid:border-red-500 invalid:ring-red-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                      className="invalid:border-red-500 invalid:ring-red-500"
                    />
                  </div>
                </div>

                {/* Selected Time Indicator */}
                {formData.date && formData.time && (
                  <div className="bg-[#ffb829]/10 dark:bg-[#ffb829]/20 border border-[#ffb829]/20 dark:border-[#ffb829]/40 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#ffb829] dark:text-[#ffb829]" />
                      <span className="text-sm font-medium text-[#b8860b] dark:text-[#ffb829]">
                        Selected: {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {formData.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select
                  value={formData.activityType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ffb829]" />
                  <Label className="text-base font-medium">Location & Venue</Label>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose your preferred area and we'll suggest great venues nearby, or search for a specific venue.
                </p>
                
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search for a city, neighborhood, or area..."
                  label="Preferred Location"
                  searchType="location"
                />

                {/* Custom Venue Search */}
                {formData.location && (
                  <div className="pt-2">
                    <LocationSearch
                      onVenueSelect={handleVenueSelect}
                      placeholder="Or search for a specific venue..."
                      label="Custom Venue Search"
                      searchType="venue"
                      activityType={formData.activityType}
                    />
                  </div>
                )}
              </div>

              {/* Participants Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants
                  <Badge variant="outline" className="text-xs">Email & SMS</Badge>
                </Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Add participants with email addresses. Include phone numbers to send both email and SMS invites.
                </p>
                
                {/* Add New Participant */}
                <div className="space-y-3 p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="newEmail" className="text-sm">Email *</Label>
                      <Input
                        id="newEmail"
                        placeholder="john@email.com"
                        value={newParticipant.email}
                        onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="newPhone" className="text-sm">Phone (optional)</Label>
                      <Input
                        id="newPhone"
                        placeholder="555-123-4567"
                        value={newParticipant.phone}
                        onChange={(e) => setNewParticipant(prev => ({ ...prev, phone: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddParticipant}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={!newParticipant.email.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add Participant
                  </Button>
                </div>

                {/* Participant List */}
                {formData.participants.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="space-y-3">
                      {formData.participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-500">Email</Label>
                              <Input
                                value={participant.email}
                                onChange={(e) => handleUpdateParticipant(participant.email, 'email', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-500">Phone</Label>
                              <Input
                                placeholder="Optional"
                                value={participant.phone || ''}
                                onChange={(e) => handleUpdateParticipant(participant.email, 'phone', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 hover:bg-red-100 dark:hover:bg-red-900/20"
                            onClick={() => handleRemoveParticipant(participant.email)}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <ParticleButton
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]"
                      size="lg"
                      disabled={isSendingInvites}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {isSendingInvites ? "Sending Invites..." : "Create Plan"}
                    </ParticleButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Venue Recommendations Sidebar */}
          <div className={formData.location ? "lg:col-span-1" : ""}>
            {formData.location && (
              <div className="sticky top-6 space-y-4">
                {/* Weather Service */}
                <WeatherService
                  location={formData.location}
                  onWeatherChange={setWeather}
                />
                
                {/* Venue Recommendations */}
                {formData.activityType && (
                  <VenueRecommendations
                    location={formData.location}
                    activityType={formData.activityType}
                    onVenueSelect={handleVenueSelect}
                    selectedVenue={formData.venue}
                    weather={weather}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {formData.eventName && (
          <Card className="mt-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Plan Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Event:</strong> {formData.eventName}</p>
                  {formData.date && <p><strong>Date:</strong> {formData.date}</p>}
                  {formData.time && <p><strong>Time:</strong> {formData.time}</p>}
                  {formData.activityType && (
                    <p><strong>Type:</strong> {activityTypes.find(t => t.value === formData.activityType)?.label}</p>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.location && (
                    <p><strong>Location:</strong> {formData.location.name}</p>
                  )}
                  {formData.venue && (
                    <p><strong>Venue:</strong> {formData.venue.name}</p>
                  )}
                  {formData.participants.length > 0 && (
                    <p><strong>Participants:</strong> {formData.participants.length} people</p>
                  )}
                  {formData.participants.filter(p => p.email).length > 0 && (
                    <p><strong>Email Invites:</strong> {formData.participants.filter(p => p.email).length} email addresses</p>
                  )}
                  {formData.participants.filter(p => p.phone).length > 0 && (
                    <p><strong>SMS Invites:</strong> {formData.participants.filter(p => p.phone).length} phone numbers</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Success Toast */}
      {showToast && (
        <Toast className="animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </Toast>
      )}
    </div>
  )
}

