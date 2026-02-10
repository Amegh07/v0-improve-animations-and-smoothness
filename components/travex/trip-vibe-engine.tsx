"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
  UtensilsCrossed,
  TreePine,
  Mountain,
  Landmark,
  Coffee,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"

const ease = [0.22, 0.61, 0.36, 1] as const

interface VibeTag {
  id: string
  label: string
  icon: React.ElementType
  color: string
  activeColor: string
}

const vibeTags: VibeTag[] = [
  { id: "food", label: "Food", icon: UtensilsCrossed, color: "text-orange-400", activeColor: "bg-orange-500/15 border-orange-500/40 text-orange-300" },
  { id: "nature", label: "Nature", icon: TreePine, color: "text-emerald-400", activeColor: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" },
  { id: "adventure", label: "Adventure", icon: Mountain, color: "text-sky-400", activeColor: "bg-sky-500/15 border-sky-500/40 text-sky-300" },
  { id: "culture", label: "Culture", icon: Landmark, color: "text-amber-400", activeColor: "bg-amber-500/15 border-amber-500/40 text-amber-300" },
  { id: "relax", label: "Relax", icon: Coffee, color: "text-rose-400", activeColor: "bg-rose-500/15 border-rose-500/40 text-rose-300" },
]

const placeholderExamples = [
  "I have a peanut allergy...",
  "I want to propose to my partner...",
  "We love street photography...",
  "Looking for kid-friendly activities...",
  "Interested in anime culture...",
]

interface CityResult {
  name: string
  country: string
  iataCode: string
}

const cityDatabase: CityResult[] = [
  { name: "Tokyo Narita", country: "Japan", iataCode: "NRT" },
  { name: "Tokyo Haneda", country: "Japan", iataCode: "HND" },
  { name: "Osaka Kansai", country: "Japan", iataCode: "KIX" },
  { name: "Kyoto", country: "Japan", iataCode: "UKY" },
  { name: "London Heathrow", country: "United Kingdom", iataCode: "LHR" },
  { name: "London Gatwick", country: "United Kingdom", iataCode: "LGW" },
  { name: "New York JFK", country: "United States", iataCode: "JFK" },
  { name: "Los Angeles LAX", country: "United States", iataCode: "LAX" },
  { name: "Paris CDG", country: "France", iataCode: "CDG" },
  { name: "Dubai International", country: "UAE", iataCode: "DXB" },
  { name: "Singapore Changi", country: "Singapore", iataCode: "SIN" },
  { name: "Seoul Incheon", country: "South Korea", iataCode: "ICN" },
  { name: "Bangkok Suvarnabhumi", country: "Thailand", iataCode: "BKK" },
  { name: "Cochin International", country: "India", iataCode: "COK" },
  { name: "Mumbai Chhatrapati", country: "India", iataCode: "BOM" },
  { name: "Delhi Indira Gandhi", country: "India", iataCode: "DEL" },
]

function CityAutocomplete({
  label,
  value,
  onSelect,
}: {
  label: string
  value: CityResult | null
  onSelect: (city: CityResult) => void
}) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCities = query.length > 0
    ? cityDatabase.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.iataCode.toLowerCase().includes(query.toLowerCase()) ||
          c.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    setHighlightIndex(0)
  }, [filteredCities.length])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((prev) => Math.min(prev + 1, filteredCities.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && filteredCities[highlightIndex]) {
      e.preventDefault()
      onSelect(filteredCities[highlightIndex])
      setQuery(filteredCities[highlightIndex].name)
      setIsOpen(false)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }, [filteredCities, highlightIndex, onSelect])

  return (
    <div className="relative flex-1">
      <label className="text-xs text-muted-foreground mb-1.5 block font-medium uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value ? `${value.name} (${value.iataCode})` : query}
          onChange={(e) => {
            if (value) {
              onSelect(null as unknown as CityResult)
            }
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            if (query.length > 0) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search city or airport..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          role="combobox"
          aria-expanded={isOpen && filteredCities.length > 0}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {value && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-mono font-bold">
            {value.iataCode}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredCities.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease }}
            className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
            role="listbox"
          >
            {filteredCities.map((city, i) => (
              <motion.button
                key={city.iataCode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                onClick={() => {
                  onSelect(city)
                  setQuery(city.name)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setHighlightIndex(i)}
                role="option"
                aria-selected={i === highlightIndex}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors duration-150 ${
                  i === highlightIndex ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{city.name}</div>
                  <div className="text-xs text-muted-foreground">{city.country}</div>
                </div>
                <span className="text-xs font-mono text-primary font-bold">{city.iataCode}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export interface TripVibeContextObject {
  origin: CityResult | null
  destination: CityResult | null
  departDate: string
  returnDate: string
  isRoundTrip: boolean
  vibes: string[]
  microContext: string
}

interface TripVibeEngineProps {
  onContextChange?: (context: TripVibeContextObject) => void
}

export function TripVibeEngine({ onContextChange }: TripVibeEngineProps) {
  const [activeVibes, setActiveVibes] = useState<Set<string>>(new Set(["culture", "food"]))
  const [microText, setMicroText] = useState("")
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [origin, setOrigin] = useState<CityResult | null>({ name: "Cochin International", country: "India", iataCode: "COK" })
  const [destination, setDestination] = useState<CityResult | null>({ name: "Tokyo Narita", country: "Japan", iataCode: "NRT" })
  const [departDate, setDepartDate] = useState("2026-02-14")
  const [returnDate, setReturnDate] = useState("2026-02-17")
  const [isRoundTrip, setIsRoundTrip] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [dateError, setDateError] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholderExamples.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isRoundTrip && returnDate && departDate && new Date(returnDate) < new Date(departDate)) {
      setDateError("Return date must be after departure")
    } else {
      setDateError("")
    }
  }, [departDate, returnDate, isRoundTrip])

  useEffect(() => {
    onContextChange?.({
      origin,
      destination,
      departDate,
      returnDate: isRoundTrip ? returnDate : "",
      isRoundTrip,
      vibes: Array.from(activeVibes),
      microContext: microText,
    })
  }, [origin, destination, departDate, returnDate, isRoundTrip, activeVibes, microText, onContextChange])

  const toggleVibe = (id: string) => {
    setActiveVibes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.52, ease }}
      className="mb-8 glass-card rounded-3xl p-6 relative overflow-hidden"
    >
      {/* Frost glow accent */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-foreground font-display">Trip Vibe</h2>
            <p className="text-xs text-muted-foreground">Set the mood for your adventure</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground glass-card glass-card-hover"
        >
          Details
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>

      {/* Macro Vibe Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {vibeTags.map((tag) => {
          const active = activeVibes.has(tag.id)
          return (
            <motion.button
              key={tag.id}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleVibe(tag.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                active ? tag.activeColor : "bg-white/[0.03] border-white/[0.08] text-muted-foreground hover:border-white/[0.15]"
              }`}
              aria-pressed={active}
            >
              <tag.icon className={`w-4 h-4 ${active ? "" : tag.color}`} />
              {tag.label}
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-current"
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Micro Context Textarea */}
      <div className="mb-5">
        <textarea
          value={microText}
          onChange={(e) => setMicroText(e.target.value)}
          placeholder={placeholderExamples[placeholderIdx]}
          rows={2}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/30 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15 transition-all duration-200 resize-none leading-relaxed"
        />
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          Add personal preferences, dietary needs, or special occasions
        </p>
      </div>

      {/* Expandable search details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.33, ease }}
            className="overflow-hidden"
          >
            <div className="pb-5 space-y-4">
              {/* City selectors */}
              <div className="flex flex-col sm:flex-row gap-4">
                <CityAutocomplete label="From" value={origin} onSelect={setOrigin} />
                <CityAutocomplete label="To" value={destination} onSelect={setDestination} />
              </div>

              {/* Date row */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium uppercase tracking-wider">
                    Departure
                  </label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <AnimatePresence>
                  {isRoundTrip && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className="flex-1 overflow-hidden"
                    >
                      <label className="text-xs text-muted-foreground mb-1.5 block font-medium uppercase tracking-wider">
                        Return
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departDate}
                        className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none transition-all duration-200 ${
                          dateError
                            ? "border-destructive/50 focus:border-destructive/70 focus:ring-1 focus:ring-destructive/20"
                            : "border-white/[0.08] focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsRoundTrip(!isRoundTrip)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
                    isRoundTrip
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:border-white/[0.15]"
                  }`}
                >
                  Round Trip
                </motion.button>
              </div>

              {/* Date validation error */}
              <AnimatePresence>
                {dateError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-destructive flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {dateError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active vibes summary */}
      {activeVibes.size > 0 && (
        <motion.div layout className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span>
            Vibes: {Array.from(activeVibes).map((v) => vibeTags.find((t) => t.id === v)?.label).join(", ")}
          </span>
        </motion.div>
      )}
    </motion.section>
  )
}
