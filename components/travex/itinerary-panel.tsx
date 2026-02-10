"use client"

import { motion, AnimatePresence, Reorder } from "framer-motion"
import { CalendarDays, GripVertical, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

interface Activity {
  id: number
  time: string
  title: string
  description: string
  color: string
  duration?: string
  tag?: { label: string; color: string }
  warning?: string
}

const day1Activities: Activity[] = [
  { id: 1, time: "09:00 AM", title: "Tokyo Metropolitan Government Building", description: "Panoramic views of the city", color: "bg-sky-500", duration: "1.5 hrs" },
  { id: 2, time: "11:00 AM", title: "Kabukicho District", description: "Street food & neon lights", color: "bg-primary", duration: "2 hrs", tag: { label: "Photography", color: "bg-primary/10 text-primary" } },
  { id: 3, time: "03:00 PM", title: "Ghibli Museum", description: "Anime magic & exhibits", color: "bg-emerald-500", warning: "Book tickets in advance" },
  { id: 4, time: "07:00 PM", title: "Shinjuku Night Lights", description: "Neon district exploration", color: "bg-sky-400", tag: { label: "Night mode", color: "bg-white/[0.04] text-muted-foreground" } },
]

const dayTitles = [
  { title: "Neon and Pop Culture", date: "Monday, February 14" },
  { title: "Traditional Tokyo & Temples", date: "Tuesday, February 15" },
  { title: "Modern Architecture & Shopping", date: "Wednesday, February 16" },
]

function ActivityCard({ activity, completed, onToggle }: { activity: Activity; completed: boolean; onToggle: () => void }) {
  return (
    <Reorder.Item
      value={activity}
      className="cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.03, boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5)", zIndex: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div
        layout
        className={`glass-card glass-card-hover rounded-xl p-4 group ${completed ? "opacity-50" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1">
            <motion.div whileHover={{ scale: 1.3 }} className={`w-3 h-3 rounded-full ${activity.color} transition-transform`} />
            <div className="w-0.5 flex-1 bg-white/[0.06]" />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex justify-between items-start mb-1">
              <span className={`text-xs font-medium ${activity.color.replace("bg-", "text-").replace("500", "400")}`}>
                {activity.time}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>
            <h4 className={`font-semibold text-foreground mb-1 text-sm ${completed ? "line-through" : ""}`}>
              {activity.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
            {activity.warning && (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-2">
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {activity.warning}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              {activity.tag && <span className={`px-2 py-0.5 rounded text-xs ${activity.tag.color}`}>{activity.tag.label}</span>}
              {activity.duration && <span className="px-2 py-0.5 rounded bg-white/[0.04] text-xs text-muted-foreground">{activity.duration}</span>}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onToggle() }}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  completed ? "bg-primary border-primary" : "border-white/20 hover:border-primary"
                }`}>
                {completed && (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-primary-foreground"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </Reorder.Item>
  )
}

export function ItineraryPanel() {
  const [activeDay, setActiveDay] = useState(0)
  const [items, setItems] = useState<Activity[]>(day1Activities)
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())

  const toggleComplete = (id: number) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.65, ease }}
        className="glass-card rounded-3xl p-6 h-[calc(100vh-8rem)] overflow-hidden flex flex-col shadow-2xl shadow-black/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-primary flex items-center justify-center shadow-lg shadow-sky-500/20"
            >
              <CalendarDays className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-foreground font-display">Your Plan</h2>
              <p className="text-xs text-muted-foreground">Drag to reorder</p>
            </div>
          </div>
          <div className="flex bg-white/[0.04] rounded-lg p-1">
            {[1, 2, 3].map((day) => (
              <motion.button key={day} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDay(day - 1)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeDay === day - 1 ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}>
                Day {day}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeDay} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">{dayTitles[activeDay].title}</h3>
            <p className="text-sm text-muted-foreground">{dayTitles[activeDay].date} {"\u2022"} {items.length} activities</p>
          </motion.div>
        </AnimatePresence>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
          <AnimatePresence>
            {items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} completed={completedIds.has(activity.id)} onToggle={() => toggleComplete(activity.id)} />
            ))}
          </AnimatePresence>
        </Reorder.Group>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="mt-3 w-full py-3 rounded-xl border-2 border-dashed border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/[0.15] transition-all duration-200 flex items-center justify-center gap-2 group">
          <motion.div className="group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-5 h-5" />
          </motion.div>
          Add Activity
        </motion.button>

        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "12.5", label: "km walking" },
              { value: "\u00A58,500", label: "estimated" },
              { value: "6", label: "activities" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}>
                <div className="text-lg font-bold text-foreground tabular-nums">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
