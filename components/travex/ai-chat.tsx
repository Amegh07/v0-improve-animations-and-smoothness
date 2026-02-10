"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Bot, Sparkles, X, Send, Lock, Compass, Calculator, MapPin, ShieldCheck } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const ease: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

type AgentType = "concierge" | "architect" | "cfo" | "local-guide"

interface AgentConfig {
  id: AgentType
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
}

const agents: Record<AgentType, AgentConfig> = {
  concierge: { id: "concierge", name: "Concierge", icon: Sparkles, color: "text-sky-400", bgColor: "bg-sky-500/20" },
  architect: { id: "architect", name: "Architect", icon: Compass, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  cfo: { id: "cfo", name: "CFO", icon: Calculator, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  "local-guide": { id: "local-guide", name: "Local Guide", icon: MapPin, color: "text-rose-400", bgColor: "bg-rose-500/20" },
}

interface Message {
  id: number
  role: "user" | "ai"
  content: string
  agent?: AgentType
}

const agentResponses: Record<AgentType, string[]> = {
  concierge: [
    "I'd recommend visiting Tsukiji Outer Market for the freshest sushi in Tokyo! It's about 20 minutes from your hotel by subway.",
    "For hidden gems, try the Golden Gai district - it's a maze of tiny bars with incredible atmosphere. Best visited after 8 PM.",
  ],
  architect: [
    "| Time | Activity | Transit | Duration |\n|------|----------|---------|----------|\n| 09:00 | Tokyo Metropolitan Gov | Walk | 1.5h |\n| 11:00 | Kabukicho District | Subway 5m | 2h |\n| 14:00 | Ghibli Museum | Train 25m | 3h |\n| 18:00 | Shinjuku Night Lights | Walk | 2h |",
    "Optimized route saves you 45 minutes of transit time vs. your current plan. I've reordered activities by geographical proximity.",
  ],
  cfo: [
    "**Daily Budget Breakdown:**\n- Transit: $15 (Suica card)\n- Food: $45 (mix of street food + one sit-down)\n- Activities: $30\n- Buffer: $10\n**Total: $100/day, $300 for 3 days** -- well within your $2,000 budget.",
    "The Japan Airlines flight at 265EUR saves you 47EUR per person vs. Singapore Airlines. Over 2 travelers, that's 94EUR saved for activities.",
  ],
  "local-guide": [
    "**Safety tip:** Shinjuku station has 200+ exits. Use the South Exit for Kabukicho. Download the Japan Transit app - it works offline!\n\n**Vibe note:** February is off-peak, so you'll avoid crowds at most attractions.",
    "**Must-know:** Carry cash in Tokyo - many small restaurants and bars are cash-only. 7-Eleven ATMs accept international cards with no fee.",
  ],
}

function AgentBadge({ agent }: { agent: AgentConfig }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${agent.bgColor} ${agent.color}`}>
      <agent.icon className="w-2.5 h-2.5" />
      {agent.name}
    </span>
  )
}

interface AIChatProps {
  isUnlocked: boolean
}

export function AIChat({ isUnlocked }: AIChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content: "Hi! I'm your multi-agent travel assistant. Ask me about routes, budget, local tips, or let me plan your perfect day!",
      agent: "concierge",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open && inputRef.current && isUnlocked) {
      inputRef.current.focus()
    }
  }, [open, isUnlocked])

  const sendMessage = () => {
    if (!input.trim() || !isUnlocked) return
    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Determine which agent responds based on keywords
    const text = input.toLowerCase()
    let agentKey: AgentType = "concierge"
    if (text.includes("budget") || text.includes("cost") || text.includes("money") || text.includes("price")) {
      agentKey = "cfo"
    } else if (text.includes("route") || text.includes("plan") || text.includes("schedule") || text.includes("itinerary")) {
      agentKey = "architect"
    } else if (text.includes("safe") || text.includes("tip") || text.includes("local") || text.includes("vibe")) {
      agentKey = "local-guide"
    }

    setTimeout(() => {
      const responses = agentResponses[agentKey]
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: responses[Math.floor(Math.random() * responses.length)],
        agent: agentKey,
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 600 + Math.random() * 400)
  }

  return (
    <>
      {/* Floating Orb */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center z-50 cursor-pointer ${
          isUnlocked
            ? "bg-gradient-to-br from-primary to-sky-400 shadow-lg shadow-primary/30"
            : "bg-secondary border border-white/[0.08]"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          !open && isUnlocked
            ? {
                boxShadow: [
                  "0 10px 40px -10px rgba(106,166,255,0.3)",
                  "0 10px 50px -5px rgba(106,166,255,0.5)",
                  "0 10px 40px -10px rgba(106,166,255,0.3)",
                ],
              }
            : {}
        }
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          ) : isUnlocked ? (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="locked" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Lock className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse ring */}
      {!open && isUnlocked && (
        <motion.div
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-sky-400 z-40 pointer-events-none"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-8 w-[420px] max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-semibold text-foreground text-sm">Travel Assistant</span>
                  <div className="flex items-center gap-1">
                    {isUnlocked ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-muted-foreground">4 agents online</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Select flight + hotel to unlock</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Agent bar */}
            {isUnlocked && (
              <div className="px-4 py-2 border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {Object.values(agents).map((agent) => (
                  <AgentBadge key={agent.id} agent={agent} />
                ))}
              </div>
            )}

            {/* Lock overlay */}
            {!isUnlocked && (
              <div className="relative">
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-16 h-16 rounded-full bg-secondary border border-white/[0.08] flex items-center justify-center mb-4"
                  >
                    <Lock className="w-7 h-7 text-muted-foreground" />
                  </motion.div>
                  <p className="text-foreground font-semibold text-center mb-2">AI Assistant Locked</p>
                  <p className="text-muted-foreground text-sm text-center leading-relaxed">
                    Select both a flight and hotel from Your Journey to unlock the full AI assistant experience.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] text-xs text-muted-foreground border border-white/[0.06] flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Flight
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] text-xs text-muted-foreground border border-white/[0.06] flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Hotel
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 h-72 opacity-20 pointer-events-none" aria-hidden="true">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
                    <div className="px-3 py-2 bg-white/5 rounded-2xl rounded-tl-sm text-sm text-muted-foreground max-w-[80%]">
                      Waiting for your selections...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {isUnlocked && (
              <div ref={scrollRef} className="p-4 space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "ai" && msg.agent && (
                        <div className={`w-6 h-6 rounded-full ${agents[msg.agent].bgColor} flex-shrink-0 flex items-center justify-center`}>
                          {(() => {
                            const AgentIcon = agents[msg.agent].icon
                            return <AgentIcon className={`w-3 h-3 ${agents[msg.agent].color}`} />
                          })()}
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.role === "user" ? "" : ""}`}>
                        {msg.role === "ai" && msg.agent && (
                          <div className="mb-1">
                            <AgentBadge agent={agents[msg.agent]} />
                          </div>
                        )}
                        <div
                          className={`px-3 py-2 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-primary rounded-2xl rounded-tr-sm text-primary-foreground"
                              : "bg-white/[0.04] rounded-2xl rounded-tl-sm text-foreground/80"
                          }`}
                        >
                          {msg.content.split("\n").map((line, i) => (
                            <span key={i}>
                              {line.startsWith("**") && line.endsWith("**")
                                ? <strong>{line.slice(2, -2)}</strong>
                                : line.startsWith("- ")
                                ? <span className="block pl-2">{line}</span>
                                : line.startsWith("|")
                                ? <span className="block font-mono text-xs">{line}</span>
                                : line}
                              {i < msg.content.split("\n").length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isUnlocked ? "Ask about budget, routes, local tips..." : "Unlock to start chatting..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={!isUnlocked}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  whileTap={isUnlocked ? { scale: 0.9 } : {}}
                  onClick={sendMessage}
                  disabled={!isUnlocked}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-primary-foreground" />
                </motion.button>
              </div>
              {isUnlocked && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground/50">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Responses are AI-generated. Verify details before booking.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
