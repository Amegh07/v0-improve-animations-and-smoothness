"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, Banknote, Users, Clock, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

const ease = [0.22, 0.61, 0.36, 1]

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-card px-3 py-2 rounded-lg font-display font-bold text-xl tabular-nums text-foreground"
      >
        {value}
      </motion.div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export function HeroSection() {
  const [tokyoTime, setTokyoTime] = useState("")
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", mins: "00" })
  const { scrollY } = useScroll()
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.15])
  const imageOpacity = useTransform(scrollY, [0, 400], [1, 0.3])
  const contentY = useTransform(scrollY, [0, 500], [0, 60])

  useEffect(() => {
    function update() {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
      }
      setTokyoTime(`${now.toLocaleTimeString("en-US", options)} JST`)

      const departure = new Date("2026-02-14T05:30:00")
      const diff = departure.getTime() - now.getTime()
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24))
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setCountdown({
          days: String(d).padStart(2, "0"),
          hours: String(h).padStart(2, "0"),
          mins: String(m).padStart(2, "0"),
        })
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const pills = [
    { icon: Calendar, label: "Feb 14 - 16, 2026", color: "text-sky-400" },
    { icon: Banknote, label: "$2,000 Budget", color: "text-emerald-400" },
    { icon: Users, label: "2 Travelers", color: "text-sky-300" },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease }}
      className="mb-10 relative rounded-3xl overflow-hidden h-[420px] group"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&auto=format&fit=crop&q=80')",
          scale: imageScale,
          opacity: imageOpacity,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

      <motion.div className="absolute bottom-0 left-0 right-0 p-8" style={{ y: contentY }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.52, ease }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Live Weather
              </span>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {tokyoTime}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease }}
              className="flex items-baseline gap-3 mb-4"
            >
              <h1
                className="text-6xl md:text-8xl font-bold text-foreground font-display tracking-tight"
                style={{ textShadow: "0 0 60px rgba(106,166,255,0.15)" }}
              >
                Tokyo
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground/60">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Japan</span>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-2">
              {pills.map((pill, i) => (
                <motion.span
                  key={pill.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, duration: 0.45, ease }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-foreground/80 hover:bg-white/[0.08] transition-all duration-300 cursor-default"
                >
                  <pill.icon className={`w-4 h-4 ${pill.color}`} />
                  {pill.label}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Weather widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 150, damping: 20 }}
            className="glass-card rounded-2xl p-4 flex items-center gap-4 min-w-[200px]"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="text-4xl"
            >
              {"🌙"}
            </motion.div>
            <div>
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {"12\u00B0C"}
              </div>
              <div className="text-sm text-muted-foreground">Clear Night</div>
              <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground/70">
                <span>{"💧"} 65%</span>
                <span>{"💨"} 12km/h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", damping: 20 }}
        className="absolute top-6 right-6 glass-card rounded-2xl p-4 hidden md:block"
      >
        <div className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider">
          Departure in
        </div>
        <div className="flex gap-2">
          <CountdownUnit value={countdown.days} label="Days" />
          <CountdownUnit value={countdown.hours} label="Hrs" />
          <CountdownUnit value={countdown.mins} label="Min" />
        </div>
      </motion.div>
    </motion.header>
  )
}
