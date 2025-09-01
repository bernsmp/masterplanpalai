"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Users, Plus, X, MapPin, Sparkles } from "lucide-react"

export default function CreatePlanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
    activityType: "",
    participants: [] as string[]
  })

  const [newParticipant, setNewParticipant] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showTimeModal, setShowTimeModal] = useState(false)

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
    // Convert suggestion to form data
    setFormData(prev => ({
      ...prev,
      date: suggestion.calculatedDate.toISOString().split('T')[0],
      time: suggestion.time
    }))
    
    setShowTimeModal(false)
    
    // Show brief success message
    setToastMessage("Time selected successfully!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !formData.participants.includes(newParticipant.trim())) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }))
      setNewParticipant("")
    }
  }

  const handleRemoveParticipant = (email: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== email)
    }))
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
    
    // Redirect to plan details page after a short delay
    setTimeout(() => {
      router.push(`/plans/${planId}`)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create a New Plan
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Plan the perfect get-together with your friends
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
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
                          <Sparkles className="w-5 h-5 text-blue-600" />
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
                            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300 dark:hover:border-blue-600"
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
                    />
                  </div>
                </div>

                {/* Selected Time Indicator */}
                {formData.date && formData.time && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
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

              {/* Participants Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddParticipant}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Person
                  </Button>
                </div>

                {/* Participant List */}
                {formData.participants.length > 0 && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {formData.participants.map((email, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {email}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1 hover:bg-transparent"
                            onClick={() => handleRemoveParticipant(email)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {formData.eventName && (
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Plan Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Event:</strong> {formData.eventName}</p>
                {formData.date && <p><strong>Date:</strong> {formData.date}</p>}
                {formData.time && <p><strong>Time:</strong> {formData.time}</p>}
                {formData.activityType && (
                  <p><strong>Type:</strong> {activityTypes.find(t => t.value === formData.activityType)?.label}</p>
                )}
                {formData.participants.length > 0 && (
                  <p><strong>Participants:</strong> {formData.participants.length} people</p>
                )}
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
