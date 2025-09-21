"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  MapPinIcon,
  DollarSignIcon,
  SparklesIcon,
  TrainIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ScreenTransition } from "@/components/screen-transition"
import { EnhancedLoading } from "@/components/enhanced-loading"
import { EnhancedResults } from "@/components/enhanced-results"
import { exportTextToPDF } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"

const interests = ["Temples", "Beaches", "Food", "Trekking", "Heritage Sites", "Shopping", "Nightlife", "Festivals"]
const travelStyles = ["Relaxed", "Adventure", "Luxury", "Family", "Backpacker"]
const currencies = [
  { value: "INR", label: "₹ INR" },
  { value: "USD", label: "$ USD" },
]
const travelModes = ["Flight", "Train", "Bus", "Car"]

type Screen = "landing" | "form" | "loading" | "results"

type FormDataShape = {
  destination: string[]
  startDate: string
  endDate: string
  budget: string
  currency: string
  travelStyle: string
  interests: string[]
  modeOfTravel: string
}

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [formData, setFormData] = useState<FormDataShape>({
    destination: [],
    startDate: "",
    endDate: "",
    budget: "",
    currency: "INR",
    travelStyle: "",
    interests: [],
    modeOfTravel: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [itinerary, setItinerary] = useState("")
  const { toast } = useToast()

  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minEndDate = tomorrow.toISOString().split("T")[0]

  const navigateToScreen = (screen: Screen) => setCurrentScreen(screen)

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
    }))
  }

  // ----- DESTINATION HANDLERS (used by the child component) -----
  const addDestinations = useCallback((items: string[]) => {
    if (!items?.length) return
    setFormData((prev) => {
      const lowerSet = new Set(prev.destination.map((d) => d.toLowerCase()))
      const newList = [...prev.destination]
      items.forEach((raw) => {
        const trimmed = raw.trim()
        if (!trimmed) return
        if (!lowerSet.has(trimmed.toLowerCase())) {
          newList.push(trimmed)
          lowerSet.add(trimmed.toLowerCase())
        }
      })
      return { ...prev, destination: newList }
    })
  }, [])

  const removeDestination = useCallback((dest: string) => {
    setFormData((prev) => ({ ...prev, destination: prev.destination.filter((d) => d !== dest) }))
  }, [])

  // ----- DateInput: isolated native date input that calls showPicker() on focus -----
  const DateInput: React.FC<{
    id: string
    value: string
    min?: string
    onCommit: (val: string) => void
    placeholder?: string
  }> = ({ id, value, min, onCommit }) => {
    const [local, setLocal] = useState(value || "")
    const ref = useRef<HTMLInputElement | null>(null)

    // Keep local in sync if parent changes programmatically
    React.useEffect(() => setLocal(value || ""), [value])

    const commit = useCallback(() => {
      onCommit(local)
    }, [local, onCommit])

    const onFocus = () => {
      // Try to open the native date picker where supported
      try {
        // @ts-ignore showPicker is not yet standard in types
        ref.current?.showPicker?.()
      } catch (e) {
        // ignore silently
      }
    }

    return (
      <input
        id={id}
        ref={ref}
        type="date"
        value={local}
        min={min}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onFocus={onFocus}
        className="text-base px-3 py-2 rounded-md bg-input border border-input/40"
      />
    )
  }

  // ----- BudgetInput: isolated numeric input that commits onBlur or Enter -----
  const BudgetInput: React.FC<{
    value: string
    onCommit: (val: string) => void
    placeholder?: string
  }> = ({ value, onCommit, placeholder }) => {
    const [local, setLocal] = useState(value || "")
    const ref = useRef<HTMLInputElement | null>(null)

    React.useEffect(() => setLocal(value || ""), [value])

    const commit = useCallback(() => {
      onCommit(local.trim())
    }, [local, onCommit])

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        commit()
        ref.current?.blur()
      }
    }

    return (
      <input
        ref={ref}
        type="number"
        min={0}
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className="flex-1 text-base px-3 py-2 rounded-md bg-input border border-input/40"
      />
    )
  }

  // ---------- DestinationInput (memoized native input) ----------
  const DestinationInput: React.FC<{
    onAdd: (items: string[]) => void
    onRemoveLast?: () => void
    placeholder?: string
  }> = React.memo(({ onAdd, onRemoveLast, placeholder }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [value, setValue] = useState("")

    const commit = useCallback(
      (raw?: string) => {
        const toProcess = (raw ?? value).trim()
        if (!toProcess) return
        const parts = toProcess
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
        onAdd(parts)
        setValue("")
        setTimeout(() => inputRef.current?.focus(), 0)
      },
      [onAdd, value]
    )

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        commit()
        return
      }
      if (e.key === ",") {
        e.preventDefault()
        commit()
        return
      }
      if (e.key === "Backspace" && !value) {
        e.preventDefault()
        onRemoveLast?.()
        return
      }
    }

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text")
      if (!text) return
      if (text.includes(",")) {
        e.preventDefault()
        commit(text)
      }
    }

    return (
      <input
        ref={inputRef}
        aria-label="destination-input"
        className="flex-1 text-base px-3 py-2 rounded-md bg-input border border-input/40 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />
    )
  })

  // ----- Validation & submit logic (unchanged behaviour) -----
  const validateForm = () => {
    if (formData.destination.length === 0) {
      toast({ title: "Destination required", description: "Please add at least one destination city.", variant: "destructive" })
      return false
    }
    if (!formData.startDate || !formData.endDate) {
      toast({ title: "Dates required", description: "Please select both start and end dates.", variant: "destructive" })
      return false
    }
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    if (startDate < todayDate) {
      toast({ title: "Invalid start date", description: "Start date cannot be in the past.", variant: "destructive" })
      return false
    }
    if (endDate <= startDate) {
      toast({ title: "Invalid end date", description: "End date must be after start date.", variant: "destructive" })
      return false
    }
    if (!formData.budget || Number.parseInt(formData.budget) <= 0) {
      toast({ title: "Budget required", description: "Please enter a valid budget amount.", variant: "destructive" })
      return false
    }
    if (!formData.travelStyle) {
      toast({ title: "Travel style required", description: "Please select your travel style.", variant: "destructive" })
      return false
    }
    if (formData.interests.length === 0) {
      toast({ title: "Interests required", description: "Please select at least one interest.", variant: "destructive" })
      return false
    }
    if (!formData.modeOfTravel) {
      toast({ title: "Travel mode required", description: "Please select your preferred mode of travel.", variant: "destructive" })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setCurrentScreen("loading")
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setItinerary(data.itinerary)
      setCurrentScreen("results")
      toast({ title: "Itinerary generated!", description: "Your personalized travel plan is ready." })
    } catch (error) {
      console.error("Error generating itinerary:", error)
      toast({ title: "Generation failed", description: "Unable to generate itinerary. Please try again.", variant: "destructive" })
      setCurrentScreen("form")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    if (isGenerating) return
    toast({ title: "Regenerating itinerary...", description: "Creating a new personalized travel plan for you." })
    setCurrentScreen("loading")
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setItinerary(data.itinerary)
      toast({ title: "New itinerary generated!", description: "Your fresh travel plan is ready." })
    } catch (error) {
      console.error("Error regenerating itinerary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = async () => {
    if (!itinerary) {
      toast({ title: "No itinerary to export", description: "Please generate an itinerary first.", variant: "destructive" })
      return
    }
    toast({ title: "Preparing PDF...", description: "Your itinerary is being formatted for download." })
    try {
      const filename = `${formData.destination.join("_").toLowerCase()}_itinerary.pdf`
      const success = await exportTextToPDF(itinerary, formData, filename)
      if (success) {
        toast({ title: "PDF exported successfully!", description: "Your itinerary has been downloaded." })
      } else throw new Error("Export failed")
    } catch (error) {
      console.error("PDF export error:", error)
      toast({ title: "Export failed", description: "There was an error creating your PDF. Please try again.", variant: "destructive" })
    }
  }

  // ---------- Screens (Landing kept minimal) ----------
  const LandingScreen = () => (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 indian-pattern opacity-30" />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="hero-text-gradient">Discover</span>
                <br />
                <span className="text-white">Incredible</span>
                <br />
                <span className="text-primary">India</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                Your AI-powered travel companion for exploring India's rich heritage, vibrant culture, and breathtaking
                destinations. Powered by Google Cloud AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white pulse-glow" onClick={() => navigateToScreen("form")}>
                Plan My Trip
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10 bg-transparent">
                <PlayIcon className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="floating-animation">
              <div className="relative">
                <img src="/beautiful-indian-palace-at-sunset-with-vibrant-col.jpg" alt="Beautiful Indian Palace at sunset with vibrant colors" className="w-full h-[600px] object-cover rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ---------------- FormScreen ----------------
  const FormScreen = () => {
    const removeLast = useCallback(() => {
      setFormData((prev) => ({ ...prev, destination: prev.destination.slice(0, -1) }))
    }, [])

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <MapPinIcon className="h-6 w-6 text-primary" />
                <span>Trip Preferences</span>
              </CardTitle>
              <CardDescription className="text-base">Share your travel preferences and let AI create the perfect itinerary</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-base font-medium">
                    Destination Cities *
                    <span className="text-sm text-muted-foreground ml-2">({formData.destination.length} added)</span>
                  </Label>

                  <div className="flex space-x-2">
                    <DestinationInput onAdd={addDestinations} onRemoveLast={removeLast} placeholder="e.g., New Delhi, Jaipur — press Enter or , to add" />
                    <Button type="button" onClick={() => { /* no-op */ }} variant="outline">Add</Button>
                  </div>

                  {formData.destination.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.destination.map((dest) => (
                        <Badge key={dest} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors" onClick={() => removeDestination(dest)}>
                          {dest}
                          <span className="ml-1">×</span>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {formData.destination.length === 0 && (
                    <p className="text-sm text-muted-foreground">Add destinations by typing and pressing Enter or comma (or paste "Goa, Jaipur").</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center space-x-1 text-base font-medium">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Start Date *</span>
                    </Label>
                    <DateInput
                      id="startDate"
                      value={formData.startDate}
                      min={today}
                      onCommit={(val) => setFormData((prev) => ({ ...prev, startDate: val }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center space-x-1 text-base font-medium">
                      <CalendarIcon className="h-4 w-4" />
                      <span>End Date *</span>
                    </Label>
                    <DateInput
                      id="endDate"
                      value={formData.endDate}
                      min={formData.startDate || minEndDate}
                      onCommit={(val) => setFormData((prev) => ({ ...prev, endDate: val }))}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center space-x-1 text-base font-medium">
                    <DollarSignIcon className="h-4 w-4" />
                    <span>Budget *</span>
                  </Label>
                  <div className="flex space-x-2">
                    <BudgetInput value={formData.budget} onCommit={(val) => setFormData((prev) => ({ ...prev, budget: val }))} placeholder="50000" />
                    <Select value={formData.currency} onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Travel Style */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Travel Style *</Label>
                  <Select value={formData.travelStyle} onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your travel style" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelStyles.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-1 text-base font-medium">
                    <TrainIcon className="h-4 w-4" />
                    <span>Mode of Travel *</span>
                  </Label>
                  <Select value={formData.modeOfTravel} onValueChange={(value) => setFormData((prev) => ({ ...prev, modeOfTravel: value }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred mode of travel" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelModes.map((mode) => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Interests *
                    <span className="text-sm text-muted-foreground ml-2">({formData.interests.length} selected)</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 text-sm px-3 py-1 ${formData.interests.includes(interest) ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105" : "hover:bg-primary/10 hover:border-primary/50"}`}
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                        {formData.interests.includes(interest) && <span className="ml-1">✓</span>}
                      </Badge>
                    ))}
                  </div>
                  {formData.interests.length === 0 && <p className="text-sm text-muted-foreground">Please select at least one interest</p>}
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isGenerating}>
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  {isGenerating ? "Generating..." : "Generate My Perfect Trip"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="dark">
      {currentScreen !== "landing" && <Navigation currentScreen={currentScreen} onNavigate={navigateToScreen} destination={formData.destination.join(", ")} />}

      <div className="relative">
        <ScreenTransition isActive={currentScreen === "landing"}><LandingScreen /></ScreenTransition>
        <ScreenTransition isActive={currentScreen === "form"}><FormScreen /></ScreenTransition>
        <ScreenTransition isActive={currentScreen === "loading"}><EnhancedLoading destination={formData.destination.join(", ")} /></ScreenTransition>
        <ScreenTransition isActive={currentScreen === "results"}>
          <EnhancedResults itinerary={itinerary} formData={formData} onRegenerate={handleRegenerate} onExportPDF={handleExportPDF} isGenerating={isGenerating} />
        </ScreenTransition>
      </div>
    </div>
  )
}
