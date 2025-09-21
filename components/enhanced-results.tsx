"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DownloadIcon,
  RefreshCwIcon,
  ShareIcon,
  MapIcon,
  CalendarIcon,
  DollarSignIcon,
  StarIcon,
  ClockIcon,
  ThermometerIcon,
  InfoIcon,
  HeartIcon,
  CameraIcon,
  UserIcon,
} from "lucide-react"
import { ItineraryDisplay } from "@/components/itinerary-display"
import { InteractiveMap } from "@/components/interactive-map"
import { ShareModal } from "@/components/share-modal"
import { ProfileModal } from "@/components/profile-modal"
import { EnhancedExport } from "@/components/enhanced-export"

interface EnhancedResultsProps {
  itinerary: string
  formData: {
    destination: string
    startDate: string
    endDate: string
    budget: string
    currency: string
    travelStyle: string
    interests: string[]
    modeOfTravel: string
  }
  onRegenerate: () => void
  onExportPDF: () => void
  isGenerating: boolean
}

export function EnhancedResults({
  itinerary,
  formData,
  onRegenerate,
  onExportPDF,
  isGenerating,
}: EnhancedResultsProps) {
  const [activeTab, setActiveTab] = useState("itinerary")
  const [showShareModal, setShowShareModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getSeasonInfo = () => {
    const month = new Date(formData.startDate).getMonth()
    if (month >= 2 && month <= 5) return { season: "Summer", temp: "25-40°C", icon: "☀️" }
    if (month >= 6 && month <= 9) return { season: "Monsoon", temp: "20-35°C", icon: "🌧️" }
    return { season: "Winter", temp: "10-25°C", icon: "❄️" }
  }

  const seasonInfo = getSeasonInfo()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Trip Summary Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="font-semibold text-lg">{formData.destination}</div>
                  <div className="text-muted-foreground text-sm">Destination</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="font-semibold text-lg">{calculateDays()} Days</div>
                  <div className="text-muted-foreground text-sm">Duration</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSignIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="font-semibold text-lg">
                    {formData.currency === "INR" ? "₹" : "$"}
                    {formData.budget}
                  </div>
                  <div className="text-muted-foreground text-sm">Budget</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ThermometerIcon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="font-semibold text-lg">{seasonInfo.season}</div>
                  <div className="text-muted-foreground text-sm">{seasonInfo.temp}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-4 lg:grid-cols-4">
              <TabsTrigger value="itinerary" className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Itinerary</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center space-x-2">
                <MapIcon className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center space-x-2">
                <InfoIcon className="h-4 w-4" />
                <span>Local Tips</span>
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center space-x-2">
                <CameraIcon className="h-4 w-4" />
                <span>Gallery</span>
              </TabsTrigger>
            </TabsList>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2"
              >
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button
                variant="outline"
                onClick={onRegenerate}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-transparent"
              >
                <RefreshCwIcon className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                <span>Regenerate</span>
              </Button>
              <Button variant="outline" onClick={() => setShowShareModal(true)} className="flex items-center space-x-2">
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <DownloadIcon className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          <TabsContent value="itinerary" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                  <span>Your Personalized Itinerary</span>
                </CardTitle>
                <CardDescription className="flex items-center space-x-4 text-base">
                  <span>
                    {formatDate(formData.startDate)} - {formatDate(formData.endDate)}
                  </span>
                  <Badge variant="secondary">{formData.travelStyle}</Badge>
                  <div className="flex space-x-1">
                    {formData.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {formData.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{formData.interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div id="itinerary-content">
                  <ItineraryDisplay itinerary={itinerary} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapIcon className="h-6 w-6 text-primary" />
                  <span>Interactive Map & Points of Interest</span>
                </CardTitle>
                <CardDescription>
                  Explore your destinations, view detailed information, and plan your routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveMap destination={formData.destination} itinerary={itinerary} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <InfoIcon className="h-5 w-5 text-primary" />
                    <span>Travel Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <div className="font-medium">Best Time to Visit</div>
                        <div className="text-sm text-muted-foreground">
                          {seasonInfo.season} season with temperatures around {seasonInfo.temp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <DollarSignIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Currency</div>
                        <div className="text-sm text-muted-foreground">
                          Indian Rupee (₹). Cards accepted in most places.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <HeartIcon className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <div className="font-medium">Local Customs</div>
                        <div className="text-sm text-muted-foreground">
                          Respect local traditions and dress modestly at religious sites.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <StarIcon className="h-5 w-5 text-primary" />
                    <span>Hidden Gems</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Discover these local favorites that most tourists miss:
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <div className="font-medium text-sm">Local Markets</div>
                        <div className="text-xs text-muted-foreground">Visit early morning for the best experience</div>
                      </div>
                      <div className="p-3 bg-accent/5 rounded-lg">
                        <div className="font-medium text-sm">Street Food</div>
                        <div className="text-xs text-muted-foreground">Try local specialties from trusted vendors</div>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <div className="font-medium text-sm">Cultural Events</div>
                        <div className="text-xs text-muted-foreground">Check for local festivals during your visit</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CameraIcon className="h-6 w-6 text-primary" />
                  <span>Destination Gallery</span>
                </CardTitle>
                <CardDescription>Beautiful photos of {formData.destination} to inspire your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={`/ceholder-svg-key-6qys5-height-300-width-300-text-.jpg?key=6qys5&height=300&width=300&text=${formData.destination}+Photo+${i}`}
                        alt={`${formData.destination} photo ${i}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          destination={formData.destination}
          itinerary={itinerary}
        />

        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

        <EnhancedExport
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          destination={formData.destination}
          itinerary={itinerary}
          formData={formData}
        />
      </main>
    </div>
  )
}
