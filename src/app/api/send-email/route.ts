import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  try {
    // Skip authentication for MVP - remove this later
    // if (!verifyPassword(request)) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('RESEND_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    console.log('Resend API key found, length:', apiKey.length);

    const resend = new Resend(apiKey);
    const body: EmailRequest = await request.json();
    const { to, subject, html } = body;

    console.log('Email request received:', { to, subject: subject?.substring(0, 50) + '...', htmlLength: html?.length });

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: `Invalid email format: ${to}` },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'PlanPal AI <onboarding@resend.dev>',
      to: to, // Send as string instead of array
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to send email: ${error.message || 'Unknown error'}`, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        messageId: data?.id,
        message: 'Email sent successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
