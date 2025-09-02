"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface WeatherServiceProps {
  location: {
    lat: number
    lng: number
    name: string
  }
  onWeatherChange?: (weather: WeatherData) => void
  className?: string
}

export default function WeatherService({
  location,
  onWeatherChange,
  className
}: WeatherServiceProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️'
    if (conditionLower.includes('snow')) return '❄️'
    if (conditionLower.includes('cloud')) return '☁️'
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️'
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️'
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️'
    return '🌤️'
  }

  const getWeatherRecommendations = (condition: string, temperature: number) => {
    const conditionLower = condition.toLowerCase()
    const recommendations: string[] = []

    if (conditionLower.includes('rain') || conditionLower.includes('storm')) {
      recommendations.push('Consider indoor venues like restaurants, cafes, or entertainment centers')
      recommendations.push('Bring an umbrella if you need to walk between locations')
    } else if (conditionLower.includes('snow')) {
      recommendations.push('Indoor venues are recommended due to snow conditions')
      recommendations.push('Check if venues have heating and are easily accessible')
    } else if (conditionLower.includes('sun') && temperature > 25) {
      recommendations.push('Great weather for outdoor activities and patios')
      recommendations.push('Consider venues with outdoor seating or rooftop bars')
    } else if (conditionLower.includes('cloud') && temperature > 20) {
      recommendations.push('Pleasant weather - both indoor and outdoor venues work well')
      recommendations.push('Consider venues with covered outdoor areas')
    } else if (temperature < 10) {
      recommendations.push('Cold weather - prioritize indoor venues with good heating')
      recommendations.push('Consider venues with cozy atmospheres')
    }

    return recommendations
  }

  const fetchWeather = async () => {
    if (!location.lat || !location.lng) return

    setIsLoading(true)
    setError(null)

    try {
      // Using OpenWeatherMap API (you'll need to get a free API key)
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      
      if (!apiKey) {
        // Fallback to mock weather data for demo
        const mockWeather: WeatherData = {
          temperature: 22,
          condition: 'Partly Cloudy',
          description: 'Partly cloudy with occasional sunshine',
          humidity: 65,
          windSpeed: 12,
          visibility: 10,
          icon: '☁️',
          isIndoorWeather: false,
          recommendations: ['Pleasant weather - both indoor and outdoor venues work well']
        }
        setWeather(mockWeather)
        onWeatherChange?.(mockWeather)
        setIsLoading(false)
        return
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${apiKey}&units=metric`
      )

      if (!response.ok) {
        throw new Error('Weather data not available')
      }

      const data = await response.json()
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000, // Convert to km
        icon: getWeatherIcon(data.weather[0].main),
        isIndoorWeather: data.weather[0].main.toLowerCase().includes('rain') || 
                        data.weather[0].main.toLowerCase().includes('snow') ||
                        data.weather[0].main.toLowerCase().includes('storm'),
        recommendations: getWeatherRecommendations(data.weather[0].main, data.main.temp)
      }

      setWeather(weatherData)
      onWeatherChange?.(weatherData)
    } catch (error) {
      console.error('Error fetching weather:', error)
      setError('Weather data unavailable')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchWeather()
    }
  }, [location])

  if (isLoading) {
    return (
      <Card className={cn("border-blue-200 bg-blue-50 dark:bg-blue-900/20", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-600 dark:text-blue-400">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className={cn("border-amber-200 bg-amber-50 dark:bg-amber-900/20", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Weather data unavailable
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-blue-200 bg-blue-50 dark:bg-blue-900/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-lg">{weather.icon}</span>
          Current Weather
        </CardTitle>
        <CardDescription className="text-xs">
          {location.name} • {weather.condition}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Temperature and Condition */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {weather.temperature}°C
            </span>
          </div>
          <Badge 
            variant={weather.isIndoorWeather ? "destructive" : "default"}
            className={cn(
              "text-xs",
              weather.isIndoorWeather 
                ? "bg-red-100 text-red-800 border-red-200" 
                : "bg-green-100 text-green-800 border-green-200"
            )}
          >
            {weather.isIndoorWeather ? "Indoor Recommended" : "Outdoor Friendly"}
          </Badge>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Recommendations */}
        {weather.recommendations.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-blue-800 dark:text-blue-200">
              Weather Recommendations:
            </div>
            {weather.recommendations.map((rec, index) => (
              <div key={index} className="text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 p-2 rounded">
                {rec}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
