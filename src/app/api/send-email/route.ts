import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

interface EmailRequest {
  to: string;
  eventName: string;
  date: string;
  time: string;
  location?: string;
  venue?: {
    name: string;
    address: string;
    rating?: number;
    priceLevel?: number;
  };
  shareCode: string;
  organizerName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body: EmailRequest = await request.json();
    const { to, eventName, date, time, location, venue, shareCode, organizerName } = body;

    if (!to || !eventName || !date || !time || !shareCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const joinUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/join/${shareCode}`;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited to ${eventName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .event-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            align-items: center;
            margin: 15px 0;
        }
        .detail-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            color: #667eea;
        }
        .detail-text {
            flex: 1;
        }
        .detail-label {
            font-size: 14px;
            color: #64748b;
            margin: 0;
        }
        .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 2px 0 0 0;
        }
        .venue-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .venue-name {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px 0;
        }
        .venue-address {
            color: #64748b;
            margin: 0 0 12px 0;
        }
        .venue-rating {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stars {
            color: #fbbf24;
        }
        .rating-text {
            color: #64748b;
            font-size: 14px;
        }
        .rsvp-section {
            text-align: center;
            margin: 30px 0;
        }
        .rsvp-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .rsvp-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header, .content {
                padding: 20px;
            }
            .rsvp-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 You're Invited!</h1>
            <p>${organizerName ? `${organizerName} has invited you to` : 'Join us for'} ${eventName}</p>
        </div>
        
        <div class="content">
            <div class="event-details">
                <div class="detail-row">
                    <div class="detail-icon">📅</div>
                    <div class="detail-text">
                        <p class="detail-label">Date</p>
                        <p class="detail-value">${date}</p>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-icon">🕐</div>
                    <div class="detail-text">
                        <p class="detail-label">Time</p>
                        <p class="detail-value">${time}</p>
                    </div>
                </div>
                
                ${location ? `
                <div class="detail-row">
                    <div class="detail-icon">📍</div>
                    <div class="detail-text">
                        <p class="detail-label">Location</p>
                        <p class="detail-value">${location}</p>
                    </div>
                </div>
                ` : ''}
            </div>
            
            ${venue ? `
            <div class="venue-card">
                <h3 class="venue-name">${venue.name}</h3>
                <p class="venue-address">${venue.address}</p>
                ${venue.rating ? `
                <div class="venue-rating">
                    <span class="stars">${'★'.repeat(Math.floor(venue.rating))}${'☆'.repeat(5 - Math.floor(venue.rating))}</span>
                    <span class="rating-text">${venue.rating}/5 stars</span>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="rsvp-section">
                <p style="margin-bottom: 20px; color: #64748b;">Ready to join? Click the button below to RSVP and get all the details!</p>
                <a href="${joinUrl}" class="rsvp-button">RSVP Now</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This invitation was sent by <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}">PlanPal AI</a></p>
            <p>If you can't make it, no worries! Just ignore this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'PlanPal AI <invites@planpal.ai>',
      to: [to],
      subject: `🎉 You're invited to ${eventName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
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
