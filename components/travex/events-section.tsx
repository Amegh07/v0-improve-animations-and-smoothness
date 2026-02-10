"use client"

import React from "react"
import { motion, useInView } from "framer-motion"
import { Ticket, ChevronLeft, ChevronRight, Check, Clock, Users, Star, AlertTriangle } from "lucide-react"
import { useRef, useState } from "react"

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

interface EventCardProps {
  index: number
  category: string
  categoryColor: string
  title: string
  location: string
  badge?: string
  badgeType?: "live" | "normal"
  stat: React.ReactNode
  backTitle: string
  backContent: React.ReactNode
  buttonLabel: string
  buttonColor: string
}

function EventCard({
  index, category, categoryColor, title, location, badge, badgeType,
  stat, backTitle, backContent, buttonLabel, buttonColor,
}: EventCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease }}
      className="flex-shrink-0 w-80 h-64 cursor-pointer snap-center"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.52, type: "spring", stiffness: 100, damping: 15 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-card glass-card-hover rounded-2xl p-5 flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColor}`}>{category}</span>
            {badge && (badgeType === "live" ? (
              <span className="relative flex items-center gap-1.5 text-xs text-red-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                {badge}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-white/[0.06] text-xs text-muted-foreground">{badge}</span>
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="font-bold text-foreground text-xl mb-2 text-balance">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{location}</p>
            {stat}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Click to flip</span>
            <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
              <div className="w-3.5 h-3.5 border border-muted-foreground/30 rounded-sm" />
            </motion.div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass-card rounded-2xl p-5 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <h3 className="font-bold text-foreground mb-3">{backTitle}</h3>
            {backContent}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full py-3 rounded-xl ${buttonColor} text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg`}
          >
            {buttonLabel}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function EventsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" })
  }

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.52 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20"
          >
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground font-display">{"Events & Festivals"}</h2>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => scroll("left")}
            className="p-2 rounded-lg glass-card glass-card-hover">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => scroll("right")}
            className="p-2 rounded-lg glass-card glass-card-hover">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        <EventCard
          index={0}
          category="Festival"
          categoryColor="bg-rose-500/10 text-rose-400 border-rose-500/20"
          title="Tokyo Cherry Blossom Festival"
          location="Ueno Park - Until Feb 25"
          badge="Happening Now" badgeType="live"
          stat={<div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="w-3 h-3" /><span>12k attending</span></div>}
          backTitle="Event Details"
          backContent={
            <div>
              <p className="text-sm text-muted-foreground mb-4">Experience the magic of early cherry blossoms with traditional tea ceremonies, live performances, and food stalls.</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Entry:</span><span className="text-foreground">Free</span></div>
                <div className="flex justify-between"><span>Duration:</span><span className="text-foreground">4-6 hours</span></div>
                <div className="flex justify-between"><span>Distance:</span><span className="text-foreground">2.5 km from hotel</span></div>
              </div>
            </div>
          }
          buttonLabel="Add to Itinerary"
          buttonColor="bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-rose-500/25"
        />
        <EventCard
          index={1}
          category="Entertainment"
          categoryColor="bg-sky-500/10 text-sky-400 border-sky-500/20"
          title="Disney Sea 10th Anniversary"
          location="Disney Sea Tokyo - Daily"
          badge="Popular" badgeType="normal"
          stat={<div className="flex items-center gap-2 text-xs text-muted-foreground"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span>4.8 (15k reviews)</span></div>}
          backTitle="Special Attractions"
          backContent={
            <div>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> New nighttime spectacular</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Limited edition merchandise</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-400" /> Special character meet & greets</li>
              </ul>
              <div className="text-2xl font-bold text-foreground">{"\u00A58,200"}</div>
            </div>
          }
          buttonLabel="Add to Day 3"
          buttonColor="bg-gradient-to-r from-sky-500 to-primary hover:shadow-sky-500/25"
        />
        <EventCard
          index={2}
          category="Arts"
          categoryColor="bg-sky-500/10 text-sky-400 border-sky-500/20"
          title="TeamLab Digital Art"
          location="Toyosu - Permanent"
          stat={<div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" /><span>10:00 - 19:00</span></div>}
          backTitle="Exhibition Info"
          backContent={
            <div>
              <p className="text-sm text-muted-foreground mb-4">Immersive digital art museum where boundaries between art and visitor dissolve.</p>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Tickets must be booked 1 month in advance
                </p>
              </div>
            </div>
          }
          buttonLabel="Check Availability"
          buttonColor="bg-gradient-to-r from-primary to-sky-500 hover:shadow-primary/25"
        />
      </div>
    </motion.section>
  )
}
