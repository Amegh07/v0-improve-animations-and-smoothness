"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap } from "lucide-react"
import { useRef, useState } from "react"
import { useInView } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

export function AIAssistant() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set())
  const [dismissed, setDismissed] = useState(false)

  const suggestions = ["Leave 30 mins earlier", "Book airport taxi"]

  const handleApply = (index: number) => {
    setAppliedSuggestions((prev) => new Set(prev).add(index))
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.section
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.52, ease }}
          className="glass-card rounded-3xl p-6 border-amber-500/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(245,158,11,0)",
                  "0 0 20px 5px rgba(245,158,11,0.12)",
                  "0 0 0 0 rgba(245,158,11,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-foreground">AI Travel Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs">Insight</span>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                I noticed heavy traffic to COK airport on Feb 14. Would you like me to suggest an earlier departure time or alternative transport?
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApply(i)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                      appliedSuggestions.has(i)
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-foreground border-white/[0.08] hover:border-amber-500/30"
                    }`}
                  >
                    {appliedSuggestions.has(i) ? "Applied" : suggestion}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDismissed(true)}
                  className="px-4 py-2 rounded-full bg-white/[0.04] text-sm text-muted-foreground border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-200"
                >
                  Dismiss
                </motion.button>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-400">
                <Zap className="w-3 h-3" />
                <span>Based on real-time traffic analysis</span>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
