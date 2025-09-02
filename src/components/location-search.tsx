"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Star, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaceResult {
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
  }
}

interface LocationSearchProps {
  onLocationSelect: (location: PlaceResult) => void
  onVenueSelect?: (venue: PlaceResult) => void
  placeholder?: string
  label?: string
  searchType?: 'location' | 'venue'
  activityType?: string
  className?: string
}

export default function LocationSearch({
  onLocationSelect,
  onVenueSelect,
  placeholder = "Search for a location...",
  label = "Location",
  searchType = 'location',
  activityType,
  className
}: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<PlaceResult | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [apiLoaded, setApiLoaded] = useState(false)

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        return Promise.resolve()
      }
      
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
      console.log('Loading Google Maps API with key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NO KEY FOUND')
      
      if (!apiKey) {
        return Promise.reject(new Error('Google Places API key not found in environment variables'))
      }
      
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`
        script.async = true
        script.defer = true
        script.onload = () => {
          console.log('Google Maps API loaded successfully')
          resolve(true)
        }
        script.onerror = (error) => {
          console.error('Failed to load Google Maps API:', error)
          reject(new Error('Google Maps API failed to load'))
        }
        document.head.appendChild(script)
      })
    }

    loadGoogleMaps()
      .then(() => setApiLoaded(true))
      .catch((error) => {
        console.error('Google Maps API loading error:', error)
        setApiLoaded(false)
      })
  }, [])

  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim() || !window.google?.maps?.places) return

    setIsLoading(true)
    
    try {
      // Try the new Places API first
      const { Place } = window.google.maps.places
      
      if (Place && Place.searchByText) {
        // Use the new Places API
        const request = {
          textQuery: searchType === 'venue' && activityType 
            ? `${searchQuery} ${getActivityKeyword(activityType)}`
            : searchQuery,
          fields: ['id', 'displayName', 'formattedAddress', 'rating', 'priceLevel', 'types', 'location'],
          maxResultCount: 5
        }

        const { places } = await Place.searchByText(request)
        
        if (places && places.length > 0) {
          const formattedResults: PlaceResult[] = places.map(place => ({
            place_id: place.id || '',
            name: place.displayName || '',
            formatted_address: place.formattedAddress || '',
            rating: place.rating || undefined,
            price_level: place.priceLevel ? Number(place.priceLevel) : undefined,
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
          
          setSuggestions(formattedResults)
          setShowSuggestions(true)
        }
        setIsLoading(false)
        return
      }

      // Fallback to the old PlacesService API
      console.log('Using fallback PlacesService API')
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )

      const request = {
        query: searchType === 'venue' && activityType 
          ? `${searchQuery} ${getActivityKeyword(activityType)}`
          : searchQuery,
        fields: ['place_id', 'name', 'formatted_address', 'rating', 'price_level', 'types', 'geometry']
      }

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const formattedResults: PlaceResult[] = results.map(place => ({
            place_id: place.place_id || '',
            name: place.name || '',
            formatted_address: place.formatted_address || '',
            rating: place.rating,
            price_level: place.price_level,
            types: place.types || [],
            geometry: {
              location: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              }
            },
            photos: undefined,
            opening_hours: undefined
          }))
          
          setSuggestions(formattedResults.slice(0, 5))
          setShowSuggestions(true)
        }
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Error searching places:', error)
      setIsLoading(false)
    }
  }

  const getActivityKeyword = (activity: string) => {
    const keywords = {
      dinner: 'restaurant',
      drinks: 'bar',
      coffee: 'cafe',
      activity: 'entertainment'
    }
    return keywords[activity as keyof typeof keywords] || ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length > 2) {
      searchPlaces(value)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: PlaceResult) => {
    setQuery(suggestion.name)
    setSelectedLocation(suggestion)
    setShowSuggestions(false)
    
    if (searchType === 'location') {
      onLocationSelect(suggestion)
    } else if (searchType === 'venue' && onVenueSelect) {
      onVenueSelect(suggestion)
    }
  }

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

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="location-search">{label}</Label>
      {!apiLoaded && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
          Loading location services...
        </div>
      )}
      {!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
          ⚠️ Google Places API key not configured. Please check your .env.local file.
        </div>
      )}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            id="location-search"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ffb829]"></div>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg border-2 border-[#ffb829]/20">
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.place_id}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-lg mt-0.5">
                      {getActivityIcon(suggestion.types)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                          {suggestion.name}
                        </h4>
                        {suggestion.opening_hours?.open_now && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Open Now
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                        {suggestion.formatted_address}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        {suggestion.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{suggestion.rating}</span>
                          </div>
                        )}
                        {suggestion.price_level && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{getPriceLevel(suggestion.price_level)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="capitalize">{suggestion.types[0]?.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <Card className="bg-[#ffb829]/5 border-[#ffb829]/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ffb829]" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  {selectedLocation.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedLocation.formatted_address}
                </p>
              </div>
              {selectedLocation.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{selectedLocation.rating}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
