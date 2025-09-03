"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-muted-foreground">Last Updated: January 2, 2025</p>
              <p className="text-sm font-medium mt-2">
                PlanPal AI is a service provided by Smart Living, Smarter Solutions.
              </p>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>By using PlanPal AI ("Service"), you agree to these Terms of Service. If you don't agree, please don't use our Service.</p>

              <h2>2. Service Description</h2>
              <p>PlanPal AI is an event planning tool that helps users organize group events, send invitations via SMS/email, and track RSVPs. This service is operated by Smart Living, Smarter Solutions.</p>

              <h2>3. User Responsibilities</h2>
              <ul>
                <li>You must have permission to contact anyone whose phone number or email you add to an event</li>
                <li>You are responsible for all content you create</li>
                <li>You must not use the Service for spam or illegal purposes</li>
                <li>You must be 18+ to use this Service</li>
              </ul>

              <h2>4. SMS/Communications</h2>
              <ul>
                <li>By adding phone numbers, you confirm you have consent to contact those individuals</li>
                <li>Recipients can opt out at any time by replying STOP</li>
                <li>Message and data rates may apply</li>
                <li>We are not responsible for carrier charges</li>
              </ul>

              <h2>5. Privacy</h2>
              <p>Your use of our Service is also governed by our <Link href="/privacy" className="text-[#ffb829] hover:underline">Privacy Policy</Link>.</p>

              <h2>6. Limitation of Liability</h2>
              <p>The Service is provided "as is" without warranties. We are not liable for any damages arising from use of the Service.</p>

              <h2>7. Termination</h2>
              <p>We may terminate or suspend access to our Service immediately, without prior notice, for any breach of these Terms.</p>

              <h2>8. Contact</h2>
              <p>
                PlanPal AI is operated by Smart Living, Smarter Solutions.<br />
                For support, email: <a href="mailto:newsletter@smarterliving.ai" className="text-[#ffb829] hover:underline">newsletter@smarterliving.ai</a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}