"use client"

import { AmbientBackground } from "@/components/travex/ambient-background"
import { Navbar } from "@/components/travex/navbar"
import { HeroSection } from "@/components/travex/hero-section"
import { TripProgress } from "@/components/travex/trip-progress"
import { JourneyTimeline } from "@/components/travex/journey-timeline"
import { EventsSection } from "@/components/travex/events-section"
import { AIAssistant } from "@/components/travex/ai-assistant"
import { ItineraryPanel } from "@/components/travex/itinerary-panel"
import { AIChat } from "@/components/travex/ai-chat"
import { CursorGlow } from "@/components/travex/cursor-glow"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AmbientBackground />
      <CursorGlow />
      <Navbar />

      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <HeroSection />
        <TripProgress />

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <JourneyTimeline />
            <EventsSection />
            <AIAssistant />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <ItineraryPanel />
          </div>
        </div>
      </main>

      <AIChat />
    </div>
  )
}
