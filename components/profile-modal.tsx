"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserIcon, MapPinIcon, CalendarIcon, HeartIcon, DownloadIcon, TrashIcon, EditIcon } from "lucide-react"

interface TripHistory {
  id: string
  destination: string
  dates: string
  budget: string
  style: string
  status: "completed" | "upcoming" | "draft"
  createdAt: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("history")

  // Mock user data
  const mockTrips: TripHistory[] = [
    {
      id: "1",
      destination: "Jaipur, Rajasthan",
      dates: "Dec 15-20, 2024",
      budget: "₹25,000",
      style: "Cultural",
      status: "upcoming",
      createdAt: "2024-12-01",
    },
    {
      id: "2",
      destination: "Goa",
      dates: "Nov 10-15, 2024",
      budget: "₹30,000",
      style: "Relaxed",
      status: "completed",
      createdAt: "2024-10-25",
    },
    {
      id: "3",
      destination: "Manali, Himachal Pradesh",
      dates: "Jan 5-10, 2025",
      budget: "₹35,000",
      style: "Adventure",
      status: "draft",
      createdAt: "2024-11-20",
    },
  ]

  const mockFavorites = [
    { name: "Hawa Mahal", location: "Jaipur", type: "Heritage Site" },
    { name: "Amber Fort", location: "Jaipur", type: "Fort" },
    { name: "Baga Beach", location: "Goa", type: "Beach" },
    { name: "Rohtang Pass", location: "Manali", type: "Mountain Pass" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-600"
      case "upcoming":
        return "bg-blue-500/20 text-blue-600"
      case "draft":
        return "bg-gray-500/20 text-gray-600"
      default:
        return "bg-gray-500/20 text-gray-600"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <span>Your Travel Profile</span>
          </DialogTitle>
          <DialogDescription>Manage your travel history, favorites, and preferences</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">Trip History</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-4">
              {mockTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <MapPinIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{trip.destination}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{trip.dates}</span>
                            </span>
                            <span>{trip.budget}</span>
                            <Badge variant="outline" className="text-xs">
                              {trip.style}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {mockFavorites.map((favorite, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <HeartIcon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-medium">{favorite.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {favorite.location} • {favorite.type}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Travel Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Preferred Travel Style</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Cultural", "Adventure", "Relaxed", "Luxury", "Budget"].map((style) => (
                        <Badge key={style} variant="outline" className="cursor-pointer hover:bg-primary/10">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Favorite Destinations</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Rajasthan", "Kerala", "Himachal Pradesh", "Goa"].map((dest) => (
                        <Badge key={dest} variant="secondary" className="text-xs">
                          {dest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Trips Planned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">8</div>
                      <div className="text-sm text-muted-foreground">States Visited</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">45</div>
                      <div className="text-sm text-muted-foreground">Places Explored</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">₹2.5L</div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
