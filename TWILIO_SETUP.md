# Twilio SMS Integration Setup

## 🚀 Premium SMS Feature

PlanPal AI now includes professional SMS invites that make your app feel premium and professional!

## 📱 Setup Instructions

### 1. Get Twilio Credentials

1. Sign up for a [Twilio account](https://www.twilio.com/try-twilio)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number for sending SMS

### 2. Environment Variables

Create or update your `.env.local` file with:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Supabase Configuration (if needed later)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Features Added

#### Create Plan Page
- ✅ Phone number input fields
- ✅ Add/remove phone numbers
- ✅ Premium feature badge
- ✅ Professional UI design

#### Plan Details Page
- ✅ Dual invite options:
  - Copy link button
  - Send SMS button with loading states
- ✅ SMS delivery results
- ✅ Error handling and success feedback

#### SMS API Route
- ✅ `/api/send-sms` endpoint
- ✅ Phone number validation and formatting
- ✅ Batch SMS sending
- ✅ Comprehensive error handling
- ✅ Delivery status tracking

### 4. SMS Message Format

The app sends professionally formatted SMS messages:

```
🎉 You're invited to: [Event Name]
📅 [Date] at [Time]
📍 [Activity Type]

Join here: [Join Link]

Sent via PlanPal AI
```

### 5. Phone Number Handling

- Automatically formats US numbers to E.164 format
- Supports international numbers with + prefix
- Validates phone numbers before sending
- Handles multiple recipients in batch

### 6. Testing

1. Create a plan with phone numbers
2. Use the "Send SMS" button on the plan details page
3. Check your Twilio console for message logs
4. Verify SMS delivery to recipients

## 🔒 Security Notes

- All Twilio credentials are stored in environment variables
- API route includes proper validation and error handling
- No sensitive data is logged or exposed

## 💰 Cost Considerations

- Twilio charges per SMS sent
- US numbers: ~$0.0079 per message
- International rates vary by country
- Consider implementing rate limiting for production use

## 🚀 Next Steps

1. Set up your Twilio account
2. Add credentials to `.env.local`
3. Test with a small group
4. Monitor usage and costs
5. Consider adding SMS templates or scheduling

---

**Made with ❤️ by PlanPal AI - Making group planning feel premium and professional!**
