"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  StarIcon,
  NavigationIcon,
  CameraIcon,
  InfoIcon,
  RouteIcon,
} from "lucide-react"

interface POI {
  id: string
  name: string
  type: string
  coordinates: { lat: number; lng: number }
  description: string
  rating: number
  estimatedCost: string
  timeToSpend: string
  bestTimeToVisit: string
  tips: string[]
  photos: string[]
  day: number
}

interface InteractiveMapProps {
  destination: string
  itinerary: string
}

export function InteractiveMap({ destination, itinerary }: InteractiveMapProps) {
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(1)

  // Mock POI data - in a real app, this would be parsed from the itinerary
  const mockPOIs: POI[] = [
    {
      id: "1",
      name: "Hawa Mahal",
      type: "Heritage Site",
      coordinates: { lat: 26.9239, lng: 75.8267 },
      description: "The iconic Palace of Winds, a stunning example of Rajputana architecture with 953 small windows.",
      rating: 4.5,
      estimatedCost: "₹50-200",
      timeToSpend: "1-2 hours",
      bestTimeToVisit: "Early morning or late afternoon",
      tips: ["Best photos from the street opposite", "Visit early to avoid crowds", "Combine with City Palace visit"],
      photos: ["/placeholder.svg?height=200&width=300&text=Hawa+Mahal"],
      day: 1,
    },
    {
      id: "2",
      name: "City Palace",
      type: "Palace",
      coordinates: { lat: 26.9255, lng: 75.8235 },
      description: "A magnificent palace complex showcasing Mughal and Rajasthani architecture.",
      rating: 4.7,
      estimatedCost: "₹300-500",
      timeToSpend: "2-3 hours",
      bestTimeToVisit: "Morning hours",
      tips: ["Audio guide recommended", "Photography allowed in most areas", "Don't miss the museum"],
      photos: ["/placeholder.svg?height=200&width=300&text=City+Palace"],
      day: 1,
    },
    {
      id: "3",
      name: "Amber Fort",
      type: "Fort",
      coordinates: { lat: 26.9855, lng: 75.8513 },
      description: "A majestic fort overlooking Maota Lake, known for its artistic Hindu style elements.",
      rating: 4.8,
      estimatedCost: "₹200-400",
      timeToSpend: "3-4 hours",
      bestTimeToVisit: "Early morning",
      tips: ["Elephant ride available", "Sound and light show in evening", "Wear comfortable shoes"],
      photos: ["/placeholder.svg?height=200&width=300&text=Amber+Fort"],
      day: 2,
    },
    {
      id: "4",
      name: "Jantar Mantar",
      type: "Observatory",
      coordinates: { lat: 26.9247, lng: 75.8249 },
      description: "UNESCO World Heritage astronomical observatory with the world's largest stone sundial.",
      rating: 4.3,
      estimatedCost: "₹50-100",
      timeToSpend: "1-2 hours",
      bestTimeToVisit: "Morning or afternoon",
      tips: ["Guide recommended for understanding", "Great for astronomy enthusiasts", "Combine with City Palace"],
      photos: ["/placeholder.svg?height=200&width=300&text=Jantar+Mantar"],
      day: 2,
    },
  ]

  const days = [...new Set(mockPOIs.map((poi) => poi.day))].sort()
  const filteredPOIs = mockPOIs.filter((poi) => poi.day === selectedDay)

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Heritage Site": "bg-primary/20 text-primary",
      Palace: "bg-accent/20 text-accent",
      Fort: "bg-orange-500/20 text-orange-600",
      Observatory: "bg-blue-500/20 text-blue-600",
      Temple: "bg-purple-500/20 text-purple-600",
      Market: "bg-green-500/20 text-green-600",
    }
    return colors[type] || "bg-gray-500/20 text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Select Day:</span>
        <div className="flex space-x-2">
          {days.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDay(day)}
              className="min-w-[60px]"
            >
              Day {day}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map Area */}
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-primary" />
              <span>
                {destination} - Day {selectedDay}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <div className="relative h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-30" />

              {/* Map Pins */}
              <div className="relative h-full p-6">
                {filteredPOIs.map((poi, index) => (
                  <div
                    key={poi.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                      selectedPOI?.id === poi.id ? "scale-125 z-10" : "z-0"
                    }`}
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 20}%`,
                    }}
                    onClick={() => setSelectedPOI(poi)}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                        selectedPOI?.id === poi.id
                          ? "bg-primary text-white"
                          : "bg-white text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <MapPinIcon className="h-6 w-6" />
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                      <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                        {poi.name}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Route Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {filteredPOIs.map((poi, index) => {
                    if (index === filteredPOIs.length - 1) return null
                    const x1 = 20 + index * 25
                    const y1 = 30 + index * 20
                    const x2 = 20 + (index + 1) * 25
                    const y2 = 30 + (index + 1) * 20

                    return (
                      <line
                        key={`route-${index}`}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="text-primary/50"
                      />
                    )
                  })}
                </svg>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-xs font-medium mb-2">Legend</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span>Points of Interest</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-primary/50 border-dashed border-t" />
                    <span>Suggested Route</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* POI Details */}
        <div className="space-y-4">
          {selectedPOI ? (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedPOI.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getTypeColor(selectedPOI.type)}>{selectedPOI.type}</Badge>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{selectedPOI.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                    <NavigationIcon className="h-4 w-4" />
                    <span>Directions</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">{selectedPOI.description}</p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Cost</div>
                      <div className="text-xs text-muted-foreground">{selectedPOI.estimatedCost}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-xs text-muted-foreground">{selectedPOI.timeToSpend}</div>
                    </div>
                  </div>
                </div>

                {/* Best Time */}
                <div className="bg-accent/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <InfoIcon className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Best Time to Visit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPOI.bestTimeToVisit}</p>
                </div>

                {/* Local Tips */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <span>Local Tips</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedPOI.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Photo Gallery */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <CameraIcon className="h-4 w-4" />
                    <span>Photos</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPOI.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`${selectedPOI.name} photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPinIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg">Select a Location</h3>
                  <p className="text-muted-foreground">Click on any pin on the map to view detailed information</p>
                </div>
              </div>
            </Card>
          )}

          {/* POI List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <RouteIcon className="h-5 w-5 text-primary" />
                <span>Day {selectedDay} Itinerary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPOIs.map((poi, index) => (
                  <div
                    key={poi.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPOI?.id === poi.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPOI(poi)}
                  >
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{poi.name}</div>
                      <div className="text-xs text-muted-foreground">{poi.type}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{poi.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
