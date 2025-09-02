import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: 'Twilio configuration missing' },
        { status: 500 }
      )
    }

    const client = twilio(accountSid, authToken)
    const { phoneNumbers, message } = await request.json()

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json(
        { error: 'Phone numbers array is required' },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: 'Twilio configuration missing' },
        { status: 500 }
      )
    }

    const results = []

    for (const phoneNumber of phoneNumbers) {
      try {
        // Format phone number to E.164 format
        const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber.replace(/\D/g, '')}`
        
        const twilioMessage = await client.messages.create({
          body: message,
          from: fromNumber,
          to: formattedNumber
        })

        results.push({
          phoneNumber,
          success: true,
          messageId: twilioMessage.sid
        })
      } catch (error: any) {
        console.error(`Failed to send SMS to ${phoneNumber}:`, error)
        results.push({
          phoneNumber,
          success: false,
          error: error.message || 'Failed to send SMS'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    })

  } catch (error: any) {
    console.error('SMS API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
