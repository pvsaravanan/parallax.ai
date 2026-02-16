"use client"

import { useCallback, useRef } from "react"

export function Footer() {
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!glowRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const xPercent = (x / rect.width) * 100

    glowRef.current.style.left = `${xPercent}%`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!glowRef.current) return
    glowRef.current.style.left = "50%"
  }, [])

  return (
    <footer className="glow-footer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={glowRef} className="glow-overlay" />
    </footer>
  )
}
