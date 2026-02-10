"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

export function CursorGlow() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - 200)
      mouseY.set(e.clientY - 200)
    }
    window.addEventListener("mousemove", handleMouse, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-[1] opacity-[0.07] hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
        filter: "blur(40px)",
        x: springX,
        y: springY,
      }}
    />
  )
}
