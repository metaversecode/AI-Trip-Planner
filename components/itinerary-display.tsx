"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, ClockIcon, LightbulbIcon, MapPinIcon, UtensilsIcon, CarIcon } from "lucide-react"

interface ItineraryDisplayProps {
  itinerary: string
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const parseItinerary = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    const days: any[] = []
    let currentDay: any = null
    let bestTimeToVisit = ""

    for (const line of lines) {
      if (line.includes("🌟 Best Time to Visit")) {
        const nextLineIndex = lines.indexOf(line) + 1
        if (nextLineIndex < lines.length) {
          bestTimeToVisit = lines[nextLineIndex]
        }
      } else if (line.includes("📅 Day")) {
        if (currentDay) days.push(currentDay)
        const dayMatch = line.match(/📅 Day (\d+)(?:\s*$$[^)]+$$)?\s*:\s*(.+)/)
        currentDay = {
          day: dayMatch?.[1] || "1",
          title: dayMatch?.[2] || "Day Activities",
          activities: {
            morning: "",
            afternoon: "",
            evening: "",
          },
          transport: "",
          food: "",
          tip: "",
        }
      } else if (line.includes("🌅 Morning:")) {
        if (currentDay) currentDay.activities.morning = line.replace("🌅 Morning:", "").trim()
      } else if (line.includes("🌞 Afternoon:")) {
        if (currentDay) currentDay.activities.afternoon = line.replace("🌞 Afternoon:", "").trim()
      } else if (line.includes("🌙 Evening:")) {
        if (currentDay) currentDay.activities.evening = line.replace("🌙 Evening:", "").trim()
      } else if (line.includes("🚗 Transport:")) {
        if (currentDay) currentDay.transport = line.replace("🚗 Transport:", "").trim()
      } else if (line.includes("🍽️ Food:")) {
        if (currentDay) currentDay.food = line.replace("🍽️ Food:", "").trim()
      } else if (line.includes("💡 Local Tip:")) {
        if (currentDay) currentDay.tip = line.replace("💡 Local Tip:", "").trim()
      }
    }

    if (currentDay) days.push(currentDay)
    return { days, bestTimeToVisit }
  }

  const { days: parsedDays, bestTimeToVisit } = parseItinerary(itinerary)

  // If parsing fails, show raw text
  if (parsedDays.length === 0) {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
          {itinerary}
        </pre>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Best Time to Visit Info Box */}
      {bestTimeToVisit && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🌟</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Best Time to Visit</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{bestTimeToVisit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {parsedDays.map((day, index) => (
        <Card key={index} className="overflow-hidden shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Day {day.day}</span>
              <Badge variant="secondary" className="ml-auto">
                {day.title}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Morning Activity */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-foreground">Morning</h4>
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{day.activities.morning}</p>
                </div>
              </div>

              <Separator />

              {/* Afternoon Activity */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌞</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-foreground">Afternoon</h4>
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{day.activities.afternoon}</p>
                </div>
              </div>

              <Separator />

              {/* Evening Activity */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌙</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-foreground">Evening</h4>
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{day.activities.evening}</p>
                </div>
              </div>

              {/* Transport and Food Section */}
              {(day.transport || day.food) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Transport */}
                    {day.transport && (
                      <div className="bg-accent/10 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <CarIcon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-accent-foreground mb-1">Transport</h5>
                            <p className="text-sm text-accent-foreground/80 leading-relaxed">{day.transport}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Food */}
                    {day.food && (
                      <div className="bg-primary/10 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <UtensilsIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-primary-foreground mb-1">Local Food</h5>
                            <p className="text-sm text-primary-foreground/80 leading-relaxed">{day.food}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Local Tip */}
              {day.tip && (
                <>
                  <Separator />
                  <div className="bg-accent/20 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <LightbulbIcon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-accent-foreground mb-1">Local Tip</h5>
                        <p className="text-sm text-accent-foreground/80 leading-relaxed">{day.tip}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Google Maps Preview Placeholder */}
              <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted-foreground/20">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <MapPinIcon className="h-5 w-5" />
                  <span className="text-sm">Google Maps preview would appear here</span>
                </div>
                <p className="text-xs text-center text-muted-foreground/60 mt-1">
                  Interactive map showing day's locations and routes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
