"use client"

import React from "react"

import { motion, useInView } from "framer-motion"
import { Plane, Car, PlaneTakeoff, MapPin, Hotel, Navigation, Gauge, Train, Bus, ChevronDown, Sparkles, Star, Info, CarTaxiFront } from "lucide-react"
import { useRef, useState } from "react"

interface TimelineItemProps {
  index: number
  icon: React.ReactNode
  iconColor: string
  borderColor: string
  children: React.ReactNode
}

function TimelineItem({ index, icon, iconColor, borderColor, children }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-16 pb-8 group"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 300, damping: 15 }}
        className={`absolute left-2 top-0 w-10 h-10 rounded-full bg-card border-2 ${borderColor} flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110`}
      >
        {icon}
      </motion.div>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-xl hover:shadow-black/20 relative overflow-hidden ${iconColor}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </motion.div>
  )
}

function FlightOption({
  airline,
  code,
  times,
  price,
  color,
  selected,
  onSelect,
  tags,
}: {
  airline: string
  code: string
  times: string
  price: string
  color: string
  selected: boolean
  onSelect: () => void
  tags?: string[]
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`rounded-xl p-4 cursor-pointer transition-all duration-300 border ${
        selected
          ? "bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/30"
          : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1] opacity-70 hover:opacity-100"
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
        <div className="text-right">
          <div className="text-lg font-bold text-foreground tabular-nums">{price}</div>
          <div className="text-xs text-muted-foreground">per person</div>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 flex gap-2"
        >
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 rounded bg-white/5 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export function JourneyTimeline() {
  const [selectedFlight, setSelectedFlight] = useState(0)
  const [selectedTransfer, setSelectedTransfer] = useState<number | null>(null)
  const [expandedDetails, setExpandedDetails] = useState(false)

  const transfers = [
    { icon: Train, label: "Narita Express", price: "\u00A53,070", color: "text-blue-400" },
    { icon: Bus, label: "Airport Bus", price: "\u00A51,300", color: "text-emerald-400" },
    { icon: CarTaxiFront, label: "Taxi", price: "\u00A530,000", color: "text-amber-400" },
  ]

  return (
    <section className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden border border-white/[0.06]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Plane className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground font-display">Your Journey</h2>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-[50px] bottom-10 w-[2px] overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-blue-500 via-blue-400/50 to-transparent"
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Item 1: Drive to Airport */}
        <TimelineItem
          index={0}
          icon={<Car className="w-4 h-4 text-cyan-400" />}
          iconColor=""
          borderColor="border-cyan-500/50"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Drive to COK Airport</h3>
              <p className="text-sm text-muted-foreground">Cochin International Airport</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">05:30 AM</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-cyan-400">
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                45 mins
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                Traffic: Light
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpandedDetails(!expandedDetails)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <motion.div animate={{ rotate: expandedDetails ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </motion.button>
          </div>
        </TimelineItem>

        {/* Item 2: Flight Selection */}
        <TimelineItem
          index={1}
          icon={<PlaneTakeoff className="w-4 h-4 text-blue-400" />}
          iconColor=""
          borderColor="border-blue-500/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Select Flight</h3>
              <p className="text-sm text-muted-foreground">{"COK \u2192 NRT \u2022 Feb 14, 2026"}</p>
            </div>
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20"
            >
              Best Price
            </motion.span>
          </div>

          <div className="space-y-3 mb-4">
            <FlightOption
              airline="Japan Airlines"
              code="JL"
              times={"08:30 \u2192 20:15 \u2022 Direct"}
              price={"\u20AC265.46"}
              color="bg-blue-500/20 text-blue-400"
              selected={selectedFlight === 0}
              onSelect={() => setSelectedFlight(0)}
              tags={["23kg baggage", "Meals included"]}
            />
            <FlightOption
              airline="Singapore Airlines"
              code="SQ"
              times={"06:15 \u2192 22:30 \u2022 1 stop"}
              price={"\u20AC312.80"}
              color="bg-cyan-500/20 text-cyan-400"
              selected={selectedFlight === 1}
              onSelect={() => setSelectedFlight(1)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Sparkles className="w-3 h-3" />
            <span>AI suggests booking within 24h for this price</span>
          </div>
        </TimelineItem>

        {/* Item 3: Arrive in Tokyo */}
        <TimelineItem
          index={2}
          icon={<MapPin className="w-4 h-4 text-blue-400" />}
          iconColor=""
          borderColor="border-blue-500/50"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-foreground text-lg">Arrive in Tokyo</h3>
            <span className="text-xs text-muted-foreground font-mono">20:15 JST</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {transfers.map((t, i) => (
              <motion.button
                key={t.label}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedTransfer(i)}
                className={`p-3 rounded-xl transition-all text-center border ${
                  selectedTransfer === i
                    ? "bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/30"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                <t.icon className={`w-5 h-5 ${t.color} mx-auto mb-1`} />
                <div className="text-xs font-medium text-foreground">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.price}</div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Info className="w-3 h-3" />
            <span>Hotel check-in available 24/7</span>
          </div>
        </TimelineItem>

        {/* Item 4: Hotel */}
        <TimelineItem
          index={3}
          icon={<Hotel className="w-4 h-4 text-cyan-400" />}
          iconColor=""
          borderColor="border-cyan-500/50"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg">Check-in: Park Hyatt Tokyo</h3>
              <p className="text-sm text-muted-foreground">{"Shinjuku \u2022 Deluxe Twin Room"}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
              Confirmed
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              4.9 (2,341 reviews)
            </span>
            <span>{"•"}</span>
            <span>Free cancellation</span>
          </div>
        </TimelineItem>
      </div>
    </section>
  )
}
