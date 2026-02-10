"use client"

import { motion } from "framer-motion"

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Soft winter blue orb */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-20 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(106,166,255,0.35) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "-250px",
          left: "-250px",
        }}
        animate={{ x: [0, 25, -15, 0], y: [0, -25, 15, 0], scale: [1, 1.06, 0.94, 1] }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
      />
      {/* Deep frost orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(106,166,255,0.25) 0%, transparent 70%)",
          filter: "blur(100px)",
          bottom: "-150px",
          right: "-150px",
        }}
        animate={{ x: [0, -15, 25, 0], y: [0, 15, -25, 0], scale: [1, 0.94, 1.06, 1] }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 8 }}
      />
      {/* Subtle accent orb */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full opacity-10 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(154,167,178,0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "40%",
          left: "45%",
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -15, 30, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 14 }}
      />
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
