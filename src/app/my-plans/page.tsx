"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Users, Plus, Eye, Edit, Trash2, Share2 } from "lucide-react"
import { Toast } from "@/components/ui/toast"

interface Plan {
  id: string
  eventName: string
  date: string
  time: string
  activityType: string
  location?: {
    lat: number
    lng: number
    name: string
  }
  venue?: any
  participants: Array<{ email: string; phone?: string }>
  createdAt: string
}

export default function MyPlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    const loadPlans = () => {
      try {
        const plansData = localStorage.getItem('plans')
        if (plansData) {
          const parsedPlans = JSON.parse(plansData)
          // Sort by creation date (newest first)
          const sortedPlans = parsedPlans.sort((a: Plan, b: Plan) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setPlans(sortedPlans)
        }
      } catch (error) {
        console.error('Error loading plans:', error)
        setToastMessage("Failed to load your plans")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [])

  const handleViewPlan = (planId: string) => {
    router.push(`/plans/${planId}`)
  }

  const handleSharePlan = (planId: string) => {
    const shareUrl = `${window.location.origin}/join/${planId}`
    navigator.clipboard.writeText(shareUrl)
    setToastMessage("Share link copied to clipboard!")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      try {
        const updatedPlans = plans.filter(plan => plan.id !== planId)
        localStorage.setItem('plans', JSON.stringify(updatedPlans))
        setPlans(updatedPlans)
        setToastMessage("Plan deleted successfully")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } catch (error) {
        console.error('Error deleting plan:', error)
        setToastMessage("Failed to delete plan")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getActivityIcon = (activityType: string) => {
    const icons: { [key: string]: string } = {
      dinner: "🍽️",
      drinks: "🍸",
      coffee: "☕",
      activity: "🎯"
    }
    return icons[activityType] || "🎉"
  }

  const getActivityLabel = (activityType: string) => {
    const labels: { [key: string]: string } = {
      dinner: "Dinner",
      drinks: "Drinks",
      coffee: "Coffee",
      activity: "Activity"
    }
    return labels[activityType] || "Event"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffb829] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your plans...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 relative flex items-center justify-center">
          {/* Left side navigation */}
          <div className="absolute left-4">
            <Button
              onClick={() => router.push('/create')}
              className="bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]"
            >
              Create Plan
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
          <div className="absolute right-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
              <Image
                src="/logo.png"
                alt="PlanPal AI Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              My Plans
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and view all your created events
          </p>
        </div>

        {/* Create New Plan Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/create')}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>
        </div>

        {/* Plans List */}
        {plans.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No plans yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Create your first event plan to get started!
              </p>
              <Button
                onClick={() => router.push('/create')}
                className="bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {getActivityIcon(plan.activityType)}
                        {plan.eventName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Created on {formatDate(plan.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {getActivityLabel(plan.activityType)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(plan.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(plan.time)}</span>
                      </div>
                      {plan.location && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span>{plan.location.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{plan.participants.length} participant{plan.participants.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Venue Info */}
                    {plan.venue && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          📍 {plan.venue.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {plan.venue.formatted_address}
                        </p>
                      </div>
                    )}

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleViewPlan(plan.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleSharePlan(plan.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        onClick={() => handleDeletePlan(plan.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Success Toast */}
        {showToast && (
          <Toast
            title="Success"
            description={toastMessage}
            className="fixed bottom-4 right-4 z-50"
          />
        )}
        </div>
      </div>
    </div>
  )
}
