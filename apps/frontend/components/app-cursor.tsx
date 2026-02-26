"use client"

import { useEffect, useState } from "react"
import { SmoothCursor } from "@/components/ui/smooth-cursor"

export function AppCursor() {
  const [enabled, setEnabled] = useState(false)
  const [inModesSection, setInModesSection] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const compute = () => setEnabled(finePointer.matches && !reducedMotion.matches)

    compute()
    finePointer.addEventListener("change", compute)
    reducedMotion.addEventListener("change", compute)

    return () => {
      finePointer.removeEventListener("change", compute)
      reducedMotion.removeEventListener("change", compute)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement

    if (enabled) {
      root.classList.add("smooth-cursor-enabled")
      return () => {
        root.classList.remove("smooth-cursor-enabled")
      }
    }

    root.classList.remove("smooth-cursor-enabled")
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setInModesSection(false)
      return
    }

    const el = document.getElementById("signals")
    if (!el) {
      setInModesSection(false)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setInModesSection(!!entry?.isIntersecting)
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled])

  if (!enabled) return null

  if (inModesSection) return null

  return <SmoothCursor />
}
