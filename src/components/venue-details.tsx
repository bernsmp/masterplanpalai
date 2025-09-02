"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Star, DollarSign, Clock, Phone, Globe, Image as ImageIcon, ExternalLink, Navigation } from "lucide-react"
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

interface VenueDetailsProps {
  venue: VenueDetails
  className?: string
  showFullDetails?: boolean
}

export default function VenueDetailsComponent({
  venue,
  className,
  showFullDetails = false
}: VenueDetailsProps) {
  const [fullVenueDetails, setFullVenueDetails] = useState<VenueDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const fetchFullVenueDetails = async () => {
    if (!window.google?.maps?.places || fullVenueDetails) return

    setIsLoading(true)
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )

      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: venue.place_id,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'rating',
          'price_level',
          'types',
          'geometry',
          'photos',
          'opening_hours',
          'website',
          'formatted_phone_number',
          'reviews'
        ]
      }

      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const details: VenueDetails = {
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
            photos: place.photos?.map(photo => ({
              photo_reference: photo.getUrl({ maxWidth: 800, maxHeight: 600 }) || '',
              height: 600,
              width: 800
            })),
            opening_hours: place.opening_hours ? {
              open_now: place.opening_hours.open_now || false,
              weekday_text: place.opening_hours.weekday_text
            } : undefined,
            website: place.website,
            formatted_phone_number: place.formatted_phone_number,
            reviews: place.reviews?.map(review => ({
              author_name: review.author_name || '',
              rating: review.rating || 0,
              text: review.text || '',
              time: review.time || 0
            }))
          }
          setFullVenueDetails(details)
        }
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Error fetching venue details:', error)
      setIsLoading(false)
    }
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${venue.geometry.location.lat},${venue.geometry.location.lng}`
    window.open(url, '_blank')
  }

  const openWebsite = () => {
    if (fullVenueDetails?.website) {
      window.open(fullVenueDetails.website, '_blank')
    }
  }

  const callVenue = () => {
    if (fullVenueDetails?.formatted_phone_number) {
      window.open(`tel:${fullVenueDetails.formatted_phone_number}`, '_self')
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Venue Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getActivityIcon(venue.types)}</span>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {venue.name}
            </h3>
            {venue.opening_hours?.open_now && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Open Now
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{venue.formatted_address}</span>
          </div>
        </div>
      </div>

      {/* Rating and Price */}
      <div className="flex items-center gap-4">
        {venue.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {venue.rating.toFixed(1)}
            </span>
          </div>
        )}
        {venue.price_level && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              {getPriceLevel(venue.price_level)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 dark:text-slate-400 text-sm capitalize">
            {venue.types[0]?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openInMaps}
          className="flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </Button>
        
        {showFullDetails && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchFullVenueDetails}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ffb829]"></div>
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                More Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getActivityIcon(venue.types)}</span>
                  {venue.name}
                </DialogTitle>
                <DialogDescription>
                  {venue.formatted_address}
                </DialogDescription>
              </DialogHeader>
              
              {fullVenueDetails && (
                <div className="space-y-6">
                  {/* Photos */}
                  {fullVenueDetails.photos && fullVenueDetails.photos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Photos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {fullVenueDetails.photos.slice(0, 4).map((photo, index) => (
                          <img
                            key={index}
                            src={photo.photo_reference}
                            alt={`${venue.name} photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="space-y-2">
                      {fullVenueDetails.formatted_phone_number && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={callVenue}
                          className="flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          {fullVenueDetails.formatted_phone_number}
                        </Button>
                      )}
                      {fullVenueDetails.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openWebsite}
                          className="flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Hours */}
                  {fullVenueDetails.opening_hours?.weekday_text && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Hours</h4>
                      <div className="space-y-1">
                        {fullVenueDetails.opening_hours.weekday_text.map((hours, index) => (
                          <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                            {hours}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {fullVenueDetails.reviews && fullVenueDetails.reviews.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Recent Reviews</h4>
                      <div className="space-y-3">
                        {fullVenueDetails.reviews.slice(0, 3).map((review, index) => (
                          <Card key={index} className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{review.author_name}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                {review.text}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
