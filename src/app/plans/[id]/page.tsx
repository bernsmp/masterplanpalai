"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, MapPin, ArrowLeft, Edit, Share2 } from "lucide-react"

interface Plan {
  id: string
  eventName: string
  date: string
  time: string
  activityType: string
  participants: string[]
  createdAt: string
}

export default function PlanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const planId = params.id as string
    const storedPlans = localStorage.getItem('plans')
    
    if (storedPlans) {
      const plans = JSON.parse(storedPlans)
      const foundPlan = plans.find((p: Plan) => p.id === planId)
      
      if (foundPlan) {
        setPlan(foundPlan)
      } else {
        // Plan not found, redirect to create page
        router.push('/create')
      }
    } else {
      // No plans stored, redirect to create page
      router.push('/create')
    }
    
    setLoading(false)
  }, [params.id, router])

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

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      dinner: '🍽️',
      drinks: '🍸',
      coffee: '☕',
      activity: '🎯'
    }
    return icons[type] || '🎯'
  }

  const getActivityLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      dinner: 'Dinner',
      drinks: 'Drinks',
      coffee: 'Coffee',
      activity: 'Activity'
    }
    return labels[type] || 'Activity'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading plan details...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/create')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Create
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Plan
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Plan Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {plan.eventName}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Created on {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Plan Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-slate-600 dark:text-slate-300">{formatDate(plan.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-slate-600 dark:text-slate-300">{formatTime(plan.time)}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getActivityIcon(plan.activityType)}</span>
                  <div>
                    <p className="font-medium">Activity Type</p>
                    <p className="text-slate-600 dark:text-slate-300">{getActivityLabel(plan.activityType)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Participants ({plan.participants.length})
                </CardTitle>
                <CardDescription>
                  People invited to this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {plan.participants.map((email, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-2 text-sm"
                    >
                      {email}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Send Invites
                </Button>
                <Button className="w-full" variant="outline">
                  Add to Calendar
                </Button>
                <Button className="w-full" variant="outline">
                  Export Details
                </Button>
              </CardContent>
            </Card>

            {/* Plan Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active Plan
                </Badge>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  This plan is ready and waiting for participants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
