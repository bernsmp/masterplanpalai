"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
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
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-muted-foreground">Last Updated: January 2, 2025</p>
              <p className="text-sm font-medium mt-2">
                PlanPal AI is a service provided by Smart Living, Smarter Solutions.
              </p>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <h2>1. Information We Collect</h2>
              <ul>
                <li><strong>Account Information</strong>: Email address, name (if provided)</li>
                <li><strong>Event Data</strong>: Event details, participant contact information</li>
                <li><strong>Usage Data</strong>: How you interact with our Service</li>
              </ul>

              <h2>2. How We Use Information</h2>
              <ul>
                <li>To provide the PlanPal AI service</li>
                <li>To send event invitations on your behalf</li>
                <li>To track RSVPs and manage events</li>
                <li>To improve our Service</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>We do not sell your personal information. We share information only:</p>
              <ul>
                <li>With your consent</li>
                <li>To send invitations you request</li>
                <li>To comply with legal obligations</li>
                <li>With service providers who assist our operations (Twilio for SMS, etc.)</li>
              </ul>

              <h2>4. SMS/Email Communications</h2>
              <ul>
                <li>We send messages only at your request</li>
                <li>Recipients can opt out anytime (reply STOP to texts)</li>
                <li>We don't send marketing messages without consent</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>We use industry-standard security measures to protect your information.</p>

              <h2>6. Data Retention</h2>
              <p>We retain event data for 90 days after the event date unless you delete it sooner.</p>

              <h2>7. Your Rights</h2>
              <p>You can:</p>
              <ul>
                <li>Access your data</li>
                <li>Delete your account</li>
                <li>Opt out of communications</li>
                <li>Request data correction</li>
              </ul>

              <h2>8. Children's Privacy</h2>
              <p>Our Service is not directed to individuals under 18.</p>

              <h2>9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy and will post changes on this page.</p>

              <h2>10. Contact Us</h2>
              <p>
                PlanPal AI is operated by Smart Living, Smarter Solutions.<br />
                Questions about this Privacy Policy?<br />
                Email: <a href="mailto:newsletter@smarterliving.ai" className="text-[#ffb829] hover:underline">newsletter@smarterliving.ai</a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}