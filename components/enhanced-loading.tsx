"use client"

import { useState, useEffect } from "react"
import { SparklesIcon, MapPinIcon, CalendarIcon, HeartIcon } from "lucide-react"

interface EnhancedLoadingProps {
  destination?: string
}

export function EnhancedLoading({ destination }: EnhancedLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loadingMessages] = useState([
    "Analyzing your travel preferences...",
    "Discovering hidden gems in India...",
    "Finding the best local experiences...",
    "Optimizing your travel routes...",
    "Adding cultural insights and tips...",
    "Finalizing your perfect itinerary...",
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [loadingMessages.length])

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-pulse" />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-accent/10 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-40 w-40 h-40 bg-primary/5 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-accent/5 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="absolute inset-0 indian-pattern opacity-20" />

      <div className="relative z-10 text-center space-y-12 max-w-2xl mx-auto px-4">
        {/* Main Loading Animation */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center pulse-glow mx-auto relative">
            <SparklesIcon className="h-16 w-16 text-white animate-spin" />

            {/* Orbiting Icons */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
              <MapPinIcon className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-primary" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "6s", animationDirection: "reverse" }}
            >
              <CalendarIcon className="absolute top-1/2 -right-2 transform -translate-y-1/2 h-6 w-6 text-accent" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "10s" }}>
              <HeartIcon className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Creating Your Perfect Journey
            {destination && <span className="block text-2xl md:text-3xl text-primary mt-2">to {destination}</span>}
          </h2>

          <div className="space-y-4">
            <p className="text-xl text-white/80 leading-relaxed">
              Our AI is crafting a personalized itinerary just for you...
            </p>

            {/* Current Step Indicator */}
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-white font-medium">{loadingMessages[currentStep]}</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-2000 ease-out"
                  style={{ width: `${((currentStep + 1) / loadingMessages.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-card/5 backdrop-blur-sm rounded-lg p-4 border border-white/5">
            <div className="text-2xl font-bold text-primary">29</div>
            <div className="text-white/60 text-sm">States to Explore</div>
          </div>
          <div className="bg-card/5 backdrop-blur-sm rounded-lg p-4 border border-white/5">
            <div className="text-2xl font-bold text-accent">1000+</div>
            <div className="text-white/60 text-sm">UNESCO Sites</div>
          </div>
          <div className="bg-card/5 backdrop-blur-sm rounded-lg p-4 border border-white/5">
            <div className="text-2xl font-bold text-white">5000</div>
            <div className="text-white/60 text-sm">Years of History</div>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
        </div>
      </div>
    </div>
  )
}
