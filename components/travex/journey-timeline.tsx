"use client"

import React from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Plane, Car, PlaneTakeoff, MapPin, Hotel, Navigation, Gauge, Train,
  Bus, ChevronDown, Sparkles, Star, Info, CarTaxiFront, ExternalLink,
  Lock, Check, ArrowRight,
} from "lucide-react"
import { useRef, useState } from "react"

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

interface TimelineItemProps {
  index: number
  icon: React.ReactNode
  borderColor: string
  children: React.ReactNode
}

function TimelineItem({ index, icon, borderColor, children }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.52, ease }}
      className="relative pl-16 pb-8 group"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.12 + 0.15, type: "spring", stiffness: 300, damping: 15 }}
        className={`absolute left-2 top-0 w-10 h-10 rounded-full bg-card border-2 ${borderColor} flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110`}
      >
        {icon}
      </motion.div>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </motion.div>
  )
}

function FlightOption({
  airline, code, times, price, color, selected, onSelect, tags, deepLink,
}: {
  airline: string; code: string; times: string; price: string; color: string
  selected: boolean; onSelect: () => void; tags?: string[]; deepLink: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      onClick={onSelect}
      className={`rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
        selected
          ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] opacity-70 hover:opacity-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            <span className="text-xs font-bold">{code}</span>
          </div>
          <div>
            <div className="font-semibold text-foreground">{airline}</div>
            <div className="text-xs text-muted-foreground">{times}</div>
          </div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-lg font-bold text-foreground tabular-nums">{price}</div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            >
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </motion.div>
          )}
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 rounded bg-white/[0.04] text-xs text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}
      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25, ease }}
          className="mt-3 pt-3 border-t border-white/[0.06]"
        >
          <a
            href={deepLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors duration-200"
          >
            Book on Skyscanner <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      )}
    </motion.div>
  )
}

export interface SelectionState {
  flightSelected: boolean
  hotelSelected: boolean
}

interface JourneyTimelineProps {
  onSelectionChange?: (state: SelectionState) => void
}

export function JourneyTimeline({ onSelectionChange }: JourneyTimelineProps) {
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null)
  const [selectedTransfer, setSelectedTransfer] = useState<number | null>(null)
  const [expandedDetails, setExpandedDetails] = useState(false)

  const handleFlightSelect = (idx: number) => {
    setSelectedFlight(idx)
    onSelectionChange?.({ flightSelected: true, hotelSelected: selectedHotel !== null })
  }

  const handleHotelSelect = (idx: number) => {
    setSelectedHotel(idx)
    onSelectionChange?.({ flightSelected: selectedFlight !== null, hotelSelected: true })
  }

  const transfers = [
    { icon: Train, label: "Narita Express", price: "\u00A53,070", color: "text-sky-400", mapsLink: "https://www.google.com/maps/dir/Narita+Airport/Shinjuku+Station" },
    { icon: Bus, label: "Airport Bus", price: "\u00A51,300", color: "text-emerald-400", mapsLink: "https://www.google.com/maps/dir/Narita+Airport/Shinjuku+Station" },
    { icon: CarTaxiFront, label: "Taxi", price: "\u00A530,000", color: "text-amber-400", mapsLink: "https://www.google.com/maps/dir/Narita+Airport/Park+Hyatt+Tokyo" },
  ]

  const hotels = [
    { name: "Park Hyatt Tokyo", area: "Shinjuku", rating: 4.9, reviews: 2341, price: "$380/night" },
    { name: "Aman Tokyo", area: "Otemachi", rating: 4.8, reviews: 1820, price: "$520/night" },
  ]

  return (
    <section className="glass-card rounded-3xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Plane className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground font-display">Your Journey</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
            selectedFlight !== null ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/[0.03] text-muted-foreground border-white/[0.06]"
          }`}>
            {selectedFlight !== null ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />} Flight
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
            selectedHotel !== null ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/[0.03] text-muted-foreground border-white/[0.06]"
          }`}>
            {selectedHotel !== null ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />} Hotel
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] top-[50px] bottom-10 w-[2px] overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-primary via-primary/50 to-transparent"
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ delay: 0.4, duration: 1.2, ease }}
          />
        </div>

        {/* Smart Transit */}
        <TimelineItem index={0} icon={<Car className="w-4 h-4 text-sky-400" />} borderColor="border-sky-500/50">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Smart Transit to COK</h3>
              <p className="text-sm text-muted-foreground">Cochin International Airport</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">05:30 AM</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-sky-400">
              <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> 45 mins</span>
              <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> Traffic: Light</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://www.google.com/maps/dir/current+location/Cochin+International+Airport" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors duration-200">
                <MapPin className="w-3 h-3" /> Maps <ExternalLink className="w-3 h-3" />
              </a>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setExpandedDetails(!expandedDetails)}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                <motion.div animate={{ rotate: expandedDetails ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {expandedDetails && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease }} className="mt-3 pt-3 border-t border-white/[0.06] space-y-2 text-sm text-muted-foreground overflow-hidden">
                <div className="flex justify-between"><span>Route</span><span className="text-foreground">NH 66 via Nedumbassery</span></div>
                <div className="flex justify-between"><span>Parking</span><span className="text-foreground">Terminal 3 - P2 (Pre-booked)</span></div>
                <div className="flex justify-between"><span>Cost estimate</span><span className="text-foreground">~$12 fuel + $5 parking</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </TimelineItem>

        {/* Flight Selection */}
        <TimelineItem index={1} icon={<PlaneTakeoff className="w-4 h-4 text-primary" />} borderColor="border-primary/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Select Flight</h3>
              <p className="text-sm text-muted-foreground">{"COK \u2192 NRT \u2022 Feb 14, 2026"}</p>
            </div>
            {selectedFlight !== null ? (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                Selected
              </motion.span>
            ) : (
              <motion.span animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                Best Price
              </motion.span>
            )}
          </div>
          <div className="space-y-3 mb-4">
            <FlightOption airline="Japan Airlines" code="JL" times={"08:30 \u2192 20:15 \u2022 Direct"} price={"\u20AC265.46"}
              color="bg-sky-500/20 text-sky-400" selected={selectedFlight === 0} onSelect={() => handleFlightSelect(0)}
              tags={["23kg baggage", "Meals included"]} deepLink="https://www.skyscanner.com/transport/flights/cok/nrt/260214/?adultsv2=2" />
            <FlightOption airline="Singapore Airlines" code="SQ" times={"06:15 \u2192 22:30 \u2022 1 stop"} price={"\u20AC312.80"}
              color="bg-cyan-500/20 text-cyan-400" selected={selectedFlight === 1} onSelect={() => handleFlightSelect(1)}
              deepLink="https://www.skyscanner.com/transport/flights/cok/nrt/260214/?adultsv2=2" />
          </div>
          <div className="flex items-center gap-2 text-xs text-primary">
            <Sparkles className="w-3 h-3" />
            <span>AI suggests booking within 24h for this price</span>
          </div>
        </TimelineItem>

        {/* Arrive in Tokyo */}
        <TimelineItem index={2} icon={<MapPin className="w-4 h-4 text-primary" />} borderColor="border-primary/50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-foreground text-lg">Arrive in Tokyo</h3>
            <span className="text-xs text-muted-foreground font-mono">20:15 JST</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {transfers.map((t, i) => (
              <motion.button key={t.label} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTransfer(i)}
                className={`p-3 rounded-xl transition-all duration-200 text-center border ${
                  selectedTransfer === i ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20" : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                }`}>
                <t.icon className={`w-5 h-5 ${t.color} mx-auto mb-1`} />
                <div className="text-xs font-medium text-foreground">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.price}</div>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {selectedTransfer !== null && (
              <motion.a initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                href={transfers[selectedTransfer].mapsLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors duration-200">
                View Route on Google Maps <ExternalLink className="w-3 h-3" />
              </motion.a>
            )}
          </AnimatePresence>
        </TimelineItem>

        {/* Hotel Selection */}
        <TimelineItem index={3} icon={<Hotel className="w-4 h-4 text-sky-400" />} borderColor="border-sky-500/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Select Hotel</h3>
              <p className="text-sm text-muted-foreground">{"Shinjuku \u2022 Feb 14-16"}</p>
            </div>
            {selectedHotel !== null && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                Confirmed
              </motion.span>
            )}
          </div>
          <div className="space-y-3">
            {hotels.map((hotel, i) => (
              <motion.div key={hotel.name} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                onClick={() => handleHotelSelect(i)}
                className={`rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
                  selectedHotel === i ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] opacity-70 hover:opacity-100"
                }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{hotel.area} {"\u2022"} Deluxe Twin</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{hotel.rating} ({hotel.reviews.toLocaleString()} reviews)</span>
                      <span>{"\u2022"}</span>
                      <span>Free cancellation</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-lg font-bold text-foreground">{hotel.price}</div>
                    {selectedHotel === i && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-primary">
            <Info className="w-3 h-3" />
            <span>Hotel check-in available 24/7</span>
          </div>
        </TimelineItem>
      </div>

      {/* Selection progress */}
      <AnimatePresence>
        {(selectedFlight !== null || selectedHotel !== null) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Selection progress</span>
              <span>{(selectedFlight !== null ? 1 : 0) + (selectedHotel !== null ? 1 : 0)} / 2</span>
            </div>
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((selectedFlight !== null ? 1 : 0) + (selectedHotel !== null ? 1 : 0)) * 50}%` }}
                transition={{ duration: 0.45, ease }} />
            </div>
            {selectedFlight !== null && selectedHotel !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                <Check className="w-3 h-3" />
                <span>All selections complete - AI Assistant unlocked</span>
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
