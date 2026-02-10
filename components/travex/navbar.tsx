"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Share2, Users } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const [rate, setRate] = useState(149.2)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRate((prev) => {
        const newRate = prev + (Math.random() - 0.5) * 0.1
        return Number.parseFloat(newRate.toFixed(2))
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Back</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs font-mono"
          >
            <span className="text-muted-foreground">USD</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground/60" />
            <motion.span
              key={rate}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 tabular-nums"
            >
              {"\u00A5"}{rate.toFixed(2)}
            </motion.span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors relative"
          >
            <Users className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
