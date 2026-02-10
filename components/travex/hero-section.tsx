"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, Banknote, Users, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg font-display font-bold text-xl tabular-nums text-foreground"
      >
        {value}
      </motion.div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export function HeroSection() {
  const [tokyoTime, setTokyoTime] = useState("")
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", mins: "00" })
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

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
    { icon: Calendar, label: "2026-02-14", color: "text-cyan-400" },
    { icon: Banknote, label: "$2,000", color: "text-emerald-400" },
    { icon: Users, label: "2 Travelers", color: "text-blue-400" },
  ]

  return (
    <motion.header
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10 relative rounded-3xl overflow-hidden h-[420px] group"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&auto=format&fit=crop&q=80')",
          scale: imageScale,
          opacity: imageOpacity,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
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

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-bold text-foreground mb-4 font-display tracking-tight"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.15)" }}
            >
              Tokyo
            </motion.h1>

            <div className="flex flex-wrap gap-2">
              {pills.map((pill, i) => (
                <motion.span
                  key={pill.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/[0.06] text-sm text-foreground/80 hover:bg-white/10 hover:border-white/10 transition-all duration-300 cursor-default"
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
            transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
            className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 min-w-[200px] border border-white/[0.06]"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="text-4xl"
            >
              {"🌙"}
            </motion.div>
            <div>
              <div className="text-3xl font-bold text-foreground tabular-nums">{"12\u00B0C"}</div>
              <div className="text-sm text-muted-foreground">Clear Night</div>
              <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground/70">
                <span>{"💧"} 65%</span>
                <span>{"💨"} 12km/h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="absolute top-6 right-6 bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 hidden md:block border border-white/[0.06]"
      >
        <div className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider">Departure in</div>
        <div className="flex gap-2">
          <CountdownUnit value={countdown.days} label="Days" />
          <CountdownUnit value={countdown.hours} label="Hrs" />
          <CountdownUnit value={countdown.mins} label="Min" />
        </div>
      </motion.div>
    </motion.header>
  )
}
