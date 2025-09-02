"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, DollarSign, Clock, Phone, Globe, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface VenueDetails {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  price_level?: number
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  website?: string
  formatted_phone_number?: string
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
}

interface WeatherData {
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  icon: string
  isIndoorWeather: boolean
  recommendations: string[]
}

interface VenueRecommendationsProps {
  location: {
    lat: number
    lng: number
    name: string
  }
  activityType: string
  onVenueSelect: (venue: VenueDetails) => void
  selectedVenue?: VenueDetails | null
  weather?: WeatherData | null
  className?: string
}

export default function VenueRecommendations({
  location,
  activityType,
  onVenueSelect,
  selectedVenue,
  weather,
  className
}: VenueRecommendationsProps) {
  const [venues, setVenues] = useState<VenueDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Activity-specific search terms and filters
  const getActivityConfig = (activity: string, weather?: WeatherData | null) => {
    const baseConfigs = {
      dinner: {
        keyword: 'restaurant',
        types: ['restaurant', 'food'],
        radius: 2000, // 2km
        minRating: 4.0
      },
      drinks: {
        keyword: 'bar',
        types: ['bar', 'night_club', 'lounge'],
        radius: 1500, // 1.5km
        minRating: 4.0
      },
      coffee: {
        keyword: 'cafe',
        types: ['cafe', 'coffee_shop'],
        radius: 1000, // 1km
        minRating: 4.0
      },
      activity: {
        keyword: 'entertainment',
        types: ['amusement_park', 'bowling_alley', 'movie_theater', 'museum', 'park'],
        radius: 3000, // 3km
        minRating: 3.5
      }
    }

    const config = baseConfigs[activity as keyof typeof baseConfigs] || baseConfigs.dinner

    // Weather-aware modifications
    if (weather?.isIndoorWeather) {
      // Prioritize indoor venues when weather is bad
      if (activity === 'activity') {
        config.types = ['bowling_alley', 'movie_theater', 'museum', 'arcade', 'indoor_entertainment']
        config.keyword = 'indoor entertainment'
      }
    } else if (weather && weather.temperature > 20 && !weather.condition.toLowerCase().includes('rain')) {
      // Good weather - prioritize outdoor options
      if (activity === 'drinks') {
        config.keyword = 'rooftop bar outdoor seating'
      } else if (activity === 'dinner') {
        config.keyword = 'restaurant outdoor dining patio'
      }
    }

    return config
  }

  const searchNearbyVenues = async () => {
    if (!window.google?.maps?.places) {
      setError('Google Maps API not loaded')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const config = getActivityConfig(activityType, weather)
      const { Place } = window.google.maps.places
      
      if (!Place) {
        setError('Places API not available. Please enable Places API in Google Cloud Console.')
        setIsLoading(false)
        return
      }

      // Use the new Places API for nearby search
      const request = {
        textQuery: `${config.keyword} near ${location.name}`,
        locationBias: {
          center: { lat: location.lat, lng: location.lng },
          radius: config.radius
        },
        fields: ['id', 'displayName', 'formattedAddress', 'rating', 'priceLevel', 'types', 'location'],
        maxResultCount: 6
      }

      const { places } = await Place.searchByText(request)
      
      if (places && places.length > 0) {
        // Filter and format results
        const filteredResults = places
          .filter(place => 
            place.rating && 
            place.rating >= config.minRating &&
            place.id
          )
          .map(place => ({
            place_id: place.id || '',
            name: place.displayName || '',
            formatted_address: place.formattedAddress || '',
            rating: place.rating,
            price_level: place.priceLevel,
            types: place.types || [],
            geometry: {
              location: {
                lat: place.location?.lat() || 0,
                lng: place.location?.lng() || 0
              }
            },
            photos: undefined,
            opening_hours: undefined
          }))

        setVenues(filteredResults)
      } else {
        setError('No venues found in this area')
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error searching venues:', error)
      setError('Failed to load venue recommendations')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (location.lat && location.lng) {
      searchNearbyVenues()
    }
  }, [location, activityType])

  const getPriceLevel = (level?: number) => {
    if (!level) return null
    return '$'.repeat(level)
  }

  const getActivityIcon = (types: string[]) => {
    if (types.includes('restaurant') || types.includes('food')) return '🍽️'
    if (types.includes('bar') || types.includes('night_club')) return '🍸'
    if (types.includes('cafe') || types.includes('coffee_shop')) return '☕'
    if (types.includes('amusement_park') || types.includes('bowling_alley') || types.includes('movie_theater')) return '🎯'
    return '📍'
  }

  const calculateDistance = (venueLat: number, venueLng: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (venueLat - location.lat) * Math.PI / 180
    const dLng = (venueLng - location.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location.lat * Math.PI / 180) * Math.cos(venueLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`
    } else {
      return `${distance.toFixed(1)}km away`
    }
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#ffb829]" />
          <h3 className="text-lg font-semibold">Suggested Venues</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#ffb829]" />
          <h3 className="text-lg font-semibold">Suggested Venues</h3>
        </div>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={searchNearbyVenues}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-[#ffb829]" />
        <h3 className="text-lg font-semibold">Suggested Venues</h3>
        <Badge variant="outline" className="text-xs">
          Near {location.name}
        </Badge>
        {weather && (
          <Badge 
            variant={weather.isIndoorWeather ? "destructive" : "default"}
            className={cn(
              "text-xs flex items-center gap-1",
              weather.isIndoorWeather 
                ? "bg-red-100 text-red-800 border-red-200" 
                : "bg-green-100 text-green-800 border-green-200"
            )}
          >
            <span>{weather.icon}</span>
            {weather.isIndoorWeather ? "Indoor" : "Outdoor"} Friendly
          </Badge>
        )}
      </div>
      
      {venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue) => (
            <Card 
              key={venue.place_id} 
              className={cn(
                "hover:shadow-md transition-all duration-200 cursor-pointer border-2",
                selectedVenue?.place_id === venue.place_id 
                  ? "border-[#ffb829] bg-[#ffb829]/5" 
                  : "border-slate-200 hover:border-[#ffb829]/30 dark:border-slate-700 dark:hover:border-[#ffb829]/60"
              )}
              onClick={() => onVenueSelect(venue)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Venue Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">
                        {venue.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {venue.formatted_address}
                      </p>
                    </div>
                    <div className="text-lg ml-2">
                      {getActivityIcon(venue.types)}
                    </div>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {venue.rating?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {venue.price_level && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {getPriceLevel(venue.price_level)}
                        </Badge>
                      )}
                      {venue.opening_hours?.open_now && (
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200">
                          Open
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {calculateDistance(venue.geometry.location.lat, venue.geometry.location.lng)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    size="sm" 
                    variant={selectedVenue?.place_id === venue.place_id ? "default" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onVenueSelect(venue)
                    }}
                  >
                    {selectedVenue?.place_id === venue.place_id ? "Selected" : "Select Venue"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400">
              No venues found in this area. Try selecting a different location.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
