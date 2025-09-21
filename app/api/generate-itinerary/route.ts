import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    console.log("[v0] Generating itinerary for:", formData.destination)

    const prompt = `Plan a detailed itinerary from ${formData.startDate} to ${formData.endDate} for a ${formData.travelStyle} traveler visiting ${formData.destination} in India with a budget of ${formData.budget} ${formData.currency}. Interests: ${formData.interests.join(", ")}. Preferred travel mode: ${formData.modeOfTravel}.

Return a day-by-day schedule with morning, afternoon, and evening activities. Include approximate costs in ${formData.currency}, local transport suggestions (train, metro, rickshaw, cab), cultural tips, and 1 local food recommendation per day.

Format the output clearly with Day 1, Day 2, etc. For each day include:
📅 Day X: [Location/Theme]
🌅 Morning: [Activity with description] (Cost: ${formData.currency === "INR" ? "₹" : "$"}XXX)
🌞 Afternoon: [Activity with description] (Cost: ${formData.currency === "INR" ? "₹" : "$"}XXX)  
🌙 Evening: [Activity with description] (Cost: ${formData.currency === "INR" ? "₹" : "$"}XXX)
🚗 Transport: [Local transport recommendations]
🍽️ Food: [Local food recommendation with restaurant suggestion]
💡 Local Tip: [Cultural tip, best time to visit, or local custom]

Include practical Indian travel details like:
- Best times to visit attractions to avoid crowds
- Local customs and etiquette (especially for temples/religious sites)
- Seasonal considerations and weather
- Booking recommendations for trains/flights
- Safety tips for solo/family travelers
- Regional specialties and must-try dishes
- Local festivals or events during the travel period`

    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      console.log("[v0] Missing Google Cloud API key, using fallback itinerary")
      return generateFallbackItinerary(formData)
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Google AI API error:", response.status, errorText)
      return generateFallbackItinerary(formData)
    }

    const data = await response.json()
    const itinerary =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate itinerary. Please try again."

    console.log("[v0] Successfully generated itinerary")
    return NextResponse.json({ itinerary })
  } catch (error) {
    console.error("[v0] Error generating itinerary:", error)
    return NextResponse.json({ itinerary: "Error generating itinerary. Please try again." })
  }
}

function generateFallbackItinerary(formData: any) {
  const startDate = new Date(formData.startDate)
  const endDate = new Date(formData.endDate)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const currencySymbol = formData.currency === "INR" ? "₹" : "$"
  const budgetPerDay = formData.budget ? Math.floor(formData.budget / days) : 5000

  let fallbackItinerary = `🇮🇳 Your ${formData.travelStyle || "Amazing"} Indian Adventure to ${formData.destination || "Your Destination"}\n\n`

  // Add best time to visit info
  fallbackItinerary += `🌟 Best Time to Visit ${formData.destination || "Your Destination"}:\n`
  fallbackItinerary += `The ideal time depends on the region - generally October to March offers pleasant weather across most of India. Avoid monsoon season (June-September) unless you enjoy the rains!\n\n`

  for (let i = 1; i <= Math.min(days, 7); i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i - 1)
    const dateStr = currentDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

    fallbackItinerary += `📅 Day ${i} (${dateStr}): ${getIndianDayTheme(i, formData.destination)}\n`
    fallbackItinerary += `🌅 Morning: ${getIndianMorningActivity(formData.interests, i)} (Cost: ${currencySymbol}${Math.floor(budgetPerDay * 0.25)})\n`
    fallbackItinerary += `🌞 Afternoon: ${getIndianAfternoonActivity(formData.interests, i)} (Cost: ${currencySymbol}${Math.floor(budgetPerDay * 0.35)})\n`
    fallbackItinerary += `🌙 Evening: ${getIndianEveningActivity(formData.interests, i)} (Cost: ${currencySymbol}${Math.floor(budgetPerDay * 0.25)})\n`
    fallbackItinerary += `🚗 Transport: ${getIndianTransport(formData.modeOfTravel, i)}\n`
    fallbackItinerary += `🍽️ Food: ${getIndianFood(i)} (Cost: ${currencySymbol}${Math.floor(budgetPerDay * 0.15)})\n`
    fallbackItinerary += `💡 Local Tip: ${getIndianLocalTip(i)}\n\n`
  }

  fallbackItinerary += `\n⚠️ Note: This is a sample India-focused itinerary. For personalized AI-generated content with real-time information, please configure your Google Cloud API credentials:\n- GOOGLE_CLOUD_API_KEY`

  return NextResponse.json({ itinerary: fallbackItinerary })
}

function getIndianDayTheme(day: number, destination: string): string {
  const themes = [
    "Arrival & Heritage Exploration",
    "Cultural Immersion & Temples",
    "Local Markets & Artisan Crafts",
    "Nature & Scenic Beauty",
    "Food Trail & Cooking Experience",
    "Adventure & Outdoor Activities",
    "Farewell & Last-minute Shopping",
  ]
  return themes[(day - 1) % themes.length]
}

function getIndianMorningActivity(interests: string[], day: number): string {
  const activities = [
    "Visit ancient temples and heritage sites with guided tour",
    "Explore bustling local markets and spice bazaars",
    "Take a heritage walk through old city quarters",
    "Visit museums showcasing regional art and history",
    "Early morning yoga session or meditation at peaceful spots",
    "Photography tour of architectural marvels",
    "Visit local artisan workshops and craft centers",
  ]
  return activities[(day - 1) % activities.length]
}

function getIndianAfternoonActivity(interests: string[], day: number): string {
  const activities = [
    "Traditional Indian lunch followed by palace or fort exploration",
    "Shopping for handicrafts, textiles, and souvenirs",
    "Nature excursion to gardens, lakes, or hill stations",
    "Cooking class learning regional Indian cuisine",
    "Visit to local villages or cultural centers",
    "Adventure activities like trekking or water sports",
    "Explore modern attractions and entertainment districts",
  ]
  return activities[(day - 1) % activities.length]
}

function getIndianEveningActivity(interests: string[], day: number): string {
  const activities = [
    "Traditional dinner with cultural dance performance",
    "Evening aarti ceremony at riverside or temple",
    "Sunset viewing from scenic viewpoints or rooftops",
    "Night market exploration and street food tasting",
    "Traditional music and dance show",
    "Evening boat ride or heritage light show",
    "Rooftop dining with panoramic city views",
  ]
  return activities[(day - 1) % activities.length]
}

function getIndianTransport(modeOfTravel: string, day: number): string {
  const transports = [
    "Local trains, metro, or app-based cabs (Ola/Uber)",
    "Auto-rickshaws for short distances, buses for longer routes",
    "Cycle rickshaws in old city areas, walking tours",
    "Private car rental or tourist buses for sightseeing",
    "Local trains for intercity travel, shared taxis",
    "Motorbike rentals or guided bike tours",
    "Airport transfers via pre-paid taxis or metro",
  ]
  return transports[(day - 1) % transports.length]
}

function getIndianFood(day: number): string {
  const foods = [
    "Try regional thali at local restaurant - complete meal with variety",
    "Street food tour: chaat, samosas, and regional specialties",
    "Traditional breakfast: dosa, idli, or parathas with chai",
    "Authentic biryani or pulao at renowned local eatery",
    "Regional sweets and desserts from famous sweet shops",
    "Coastal cuisine: fresh seafood or regional fish curry",
    "Farewell dinner at heritage restaurant with live music",
  ]
  return foods[(day - 1) % foods.length]
}

function getIndianLocalTip(day: number): string {
  const tips = [
    "Remove shoes before entering temples and cover your head if required",
    "Bargaining is expected in markets - start at 50% of quoted price",
    "Carry hand sanitizer and drink bottled water for safety",
    "Dress modestly, especially when visiting religious sites",
    "Learn basic Hindi phrases - locals appreciate the effort",
    "Keep small denomination notes for tips, rickshaws, and street vendors",
    "Book train tickets in advance and arrive early at stations",
  ]
  return tips[(day - 1) % tips.length]
}
