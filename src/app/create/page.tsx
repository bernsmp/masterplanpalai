"use client"

import { CreateEventWizard } from "@/components/create-event-wizard"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreatePlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link 
          href="/my-plans" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Plans
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <CreateEventWizard />
      </div>
    </div>
  )
}