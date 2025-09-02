import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeroPill } from '@/components/ui/hero-pill'
import { ArrowRight, Calendar, Users, MessageSquare, MapPin, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ffb829] to-[#e6a025] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">PlanPal AI</span>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">

          <HeroPill 
            text="⚡️ Exclusive for Smart Solutions Subscribers"
            className="mb-6 [&>p]:!bg-[#ffb829] [&>p]:!text-black [&>p]:!dark:bg-[#ffb829] [&>p]:!dark:text-black"
          />
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#ffb829] to-[#e6a025] bg-clip-text text-transparent">
              PlanPal AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            An AI planning assistant that acts like your group's most organized friend—the one who actually remembers everyone's schedules, knows all the good spots, and somehow makes plans happen without the endless group chat chaos.
          </p>

          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#cc8f1f]">
              <Link href="/create">
                Create New Plan
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Your AI Planning Assistant
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ffb829]/10 dark:bg-[#ffb829]/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[#ffb829] dark:text-[#ffb829]" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Smart Scheduling</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Automatically coordinates everyone's availability and suggests optimal meeting times
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ffb829]/10 dark:bg-[#ffb829]/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#ffb829] dark:text-[#ffb829]" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Venue Discovery</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Finds the perfect spots based on group preferences, location, and availability
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ffb829]/10 dark:bg-[#ffb829]/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-[#ffb829] dark:text-[#ffb829]" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Group Coordination</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Eliminates endless group chat confusion with intelligent decision-making
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ffb829]/10 dark:bg-[#ffb829]/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#ffb829] dark:text-[#ffb829]" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Social Intelligence</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Learns your group's preferences and makes plans that everyone will love
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ffb829]/10 dark:bg-[#ffb829]/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#ffb829] dark:text-[#ffb829]" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Instant Execution</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  From idea to confirmed plans in minutes, not days of back-and-forth
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ffb829]/10 dark:bg-[#ffb829]/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[#ffb829] dark:text-[#ffb829]" />
                </div>
                <CardTitle className="text-slate-900 dark:text-white">Calendar Integration</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Seamlessly syncs with your existing calendar apps and sends reminders
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>




    </div>
  )
}
