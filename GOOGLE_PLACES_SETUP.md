# Google Places API Setup Guide

## 🚀 Quick Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for Places API)

### 2. Enable Required APIs
1. Navigate to "APIs & Services" > "Library"
2. Enable these APIs:
   - **Places API** (for venue search and details)
   - **Maps JavaScript API** (for autocomplete functionality)

### 3. Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### 4. Secure Your API Key
1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     - `localhost:3000/*` (for development)
     - `yourdomain.com/*` (for production)
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose: "Places API" and "Maps JavaScript API"

### 5. Add to Environment Variables
Create or update your `.env.local` file:

```bash
# Google Places API
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

### 6. Test the Integration
1. Start your development server: `npm run dev`
2. Go to the create plan page
3. Try searching for a location
4. Select an activity type to see venue recommendations

## 🔧 Features Implemented

### ✅ Location Search
- Google Places Autocomplete for location input
- Real-time search suggestions
- Location selection with coordinates

### ✅ Smart Venue Recommendations
- Dynamic venue suggestions based on:
  - Selected location/area
  - Activity type (dinner, drinks, coffee, activity)
  - Distance from location
  - Rating and price level filters

### ✅ Rich Venue Information
- Real venue photos from Google Places
- Current ratings and reviews
- Opening hours and availability
- Contact information (phone, website)
- Directions integration

### ✅ Enhanced User Experience
- Location-first approach in plan creation
- Custom venue search option
- Fallback to hardcoded venues for existing plans
- Responsive design with loading states

## 🎯 Usage Examples

### Creating a Plan with Location
1. **Select Activity Type**: Choose dinner, drinks, coffee, or activity
2. **Choose Location**: Search for city, neighborhood, or area
3. **Browse Venues**: See AI-recommended venues nearby
4. **Custom Search**: Or search for a specific venue
5. **Select Venue**: Click to choose your preferred venue

### Venue Information Available
- **Photos**: High-quality venue images
- **Reviews**: Recent customer reviews and ratings
- **Hours**: Current opening hours and availability
- **Contact**: Phone number and website
- **Directions**: Direct link to Google Maps

## 🛠️ Technical Details

### Components Created
- `LocationSearch`: Google Places autocomplete component
- `VenueRecommendations`: Smart venue suggestions
- `VenueDetailsComponent`: Rich venue information display

### API Integration
- Google Places Text Search API
- Google Places Nearby Search API
- Google Places Details API
- Google Maps JavaScript API

### Data Flow
1. User searches for location → Google Places Autocomplete
2. Location selected → Nearby venue search based on activity type
3. Venue selected → Full venue details fetched
4. Plan created → Venue data stored with plan

## 🔒 Security Best Practices

1. **API Key Restrictions**: Always restrict your API key to specific domains
2. **Environment Variables**: Never commit API keys to version control
3. **Rate Limiting**: Google Places API has usage limits
4. **Billing Alerts**: Set up billing alerts to monitor usage

## 📊 API Usage & Costs

### Free Tier Limits
- **Places API**: $200 free credit per month
- **Maps JavaScript API**: $200 free credit per month

### Typical Usage Costs
- Text Search: $0.017 per request
- Nearby Search: $0.032 per request
- Place Details: $0.017 per request

### Cost Optimization
- Cache venue results when possible
- Use appropriate search radius
- Implement request debouncing

## 🚨 Troubleshooting

### Common Issues
1. **API Key Not Working**: Check restrictions and enabled APIs
2. **No Results**: Verify location coordinates and search radius
3. **CORS Errors**: Ensure API key is properly configured
4. **Rate Limiting**: Implement request throttling

### Debug Steps
1. Check browser console for errors
2. Verify API key in environment variables
3. Test API key in Google Cloud Console
4. Check network requests in browser dev tools

## 🎉 Next Steps

The enhanced location and venue system is now fully integrated! Users can:
- Search for locations with autocomplete
- Get smart venue recommendations
- View rich venue information
- Create plans with specific venues

The system gracefully falls back to the original hardcoded venues for existing plans while providing the new enhanced experience for new plans.
