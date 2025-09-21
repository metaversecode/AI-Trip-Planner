"use client"

import { Button } from "@/components/ui/button"
import { SparklesIcon, ArrowRightIcon, HomeIcon, FormInputIcon, LoaderIcon, MapIcon } from "lucide-react"

type Screen = "landing" | "form" | "loading" | "results"

interface NavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  destination?: string
}

export function Navigation({ currentScreen, onNavigate, destination }: NavigationProps) {
  const screens = [
    { id: "landing" as Screen, label: "Home", icon: HomeIcon },
    { id: "form" as Screen, label: "Plan Trip", icon: FormInputIcon },
    { id: "loading" as Screen, label: "Generating", icon: LoaderIcon },
    { id: "results" as Screen, label: "Itinerary", icon: MapIcon },
  ]

  const currentIndex = screens.findIndex((screen) => screen.id === currentScreen)

  return (
    <nav className="border-b border-border bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center pulse-glow">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">YatraAI</span>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {screens.map((screen, index) => {
              const Icon = screen.icon
              const isActive = screen.id === currentScreen
              const isCompleted = index < currentIndex
              const isAccessible = index <= currentIndex || (currentScreen === "results" && screen.id === "form")

              return (
                <div key={screen.id} className="flex items-center">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => isAccessible && onNavigate(screen.id)}
                    disabled={!isAccessible}
                    className={`flex items-center space-x-2 ${
                      isCompleted ? "text-primary" : ""
                    } ${!isAccessible ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "animate-pulse" : ""}`} />
                    <span>{screen.label}</span>
                  </Button>
                  {index < screens.length - 1 && <ArrowRightIcon className="h-4 w-4 text-muted-foreground mx-2" />}
                </div>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="text-sm text-muted-foreground">
              Step {currentIndex + 1} of {screens.length}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {currentScreen === "form" && (
              <Button variant="ghost" onClick={() => onNavigate("landing")} size="sm">
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
              </Button>
            )}
            {currentScreen === "results" && (
              <>
                <Button variant="ghost" onClick={() => onNavigate("form")} size="sm">
                  Edit Trip
                </Button>
                <Button variant="ghost" onClick={() => onNavigate("landing")} size="sm">
                  New Trip
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 md:hidden">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / screens.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Context */}
        {destination && currentScreen !== "landing" && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
              <MapIcon className="h-4 w-4" />
              <span>Planning trip to {destination}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
