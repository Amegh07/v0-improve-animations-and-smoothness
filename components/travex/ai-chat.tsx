"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bot, Sparkles, X, Send } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: number
  role: "user" | "ai"
  content: string
}

const aiResponses = [
  "I'd recommend visiting Tsukiji Outer Market for the freshest sushi in Tokyo! It's about 20 minutes from your hotel.",
  "For hidden gems, try the Golden Gai district - it's a maze of tiny bars with incredible atmosphere.",
  "The best ramen near Shinjuku is at Fuunji - expect a 15 minute wait but it's absolutely worth it!",
  "I'd suggest getting a Suica card at the airport - it makes transit incredibly easy and works at convenience stores too.",
]

export function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content: "Hi! I can help you plan your Tokyo trip. Try asking me to find restaurants, optimize your route, or suggest hidden gems!",
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
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 800 + Math.random() * 400)
  }

  return (
    <>
      {/* Floating Orb */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center z-50 shadow-lg shadow-blue-500/30 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          open
            ? {}
            : {
                boxShadow: [
                  "0 10px 40px -10px rgba(59,130,246,0.4)",
                  "0 10px 50px -5px rgba(59,130,246,0.6)",
                  "0 10px 40px -10px rgba(59,130,246,0.4)",
                ],
              }
        }
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse ring */}
      {!open && (
        <motion.div
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 z-40 pointer-events-none"
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-8 w-96 max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-foreground text-sm">Travel Assistant</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="p-4 space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-3 py-2 text-sm max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-blue-600 rounded-2xl rounded-tr-sm text-white"
                          : "bg-white/5 rounded-2xl rounded-tl-sm text-muted-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
