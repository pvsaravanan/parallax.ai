"use client"

import { useEffect, useRef } from "react"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical labels */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          PARALLAX.AI
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        <SplitFlapAudioProvider>
          <div className="relative">
            <SplitFlapText text="PARALLAX" speed={80} />
            <div className="mt-4">
              <SplitFlapMuteToggle />
            </div>
          </div>
        </SplitFlapAudioProvider>

        <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide">
          Human-Preference Evaluation for LLMs
        </h2>

        <p className="mt-12 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
          Battle anonymous models, run direct chat studies, or compare side-by-side. Aggregate human judgments into public rankings.
        </p>

        {/* Get started terminal prompt */}
        <div className="mt-12 flex items-center gap-6">
          <a
            href="/auth"
            className="group relative flex items-center gap-3 border border-accent/70 bg-card/30 backdrop-blur-sm px-6 py-4 w-full max-w-md hover:border-accent hover:shadow-[0_0_16px_rgba(var(--accent-rgb,249,115,22),0.15)] transition-all duration-300"
          >
            <span className="font-mono text-sm text-accent font-bold select-none">{">_"}</span>
            <span className="font-mono text-sm text-muted-foreground tracking-wide group-hover:text-foreground transition-colors duration-200">
              Get started...
            </span>
            <span className="ml-auto w-2.5 h-5 bg-accent animate-pulse" />
          </a>
          <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 whitespace-nowrap select-none">
            Press Enter ↵
          </span>
        </div>
      </div>

      {/* Floating info tag */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Beta / Research Instrument
        </div>
      </div>
    </section>
  )
}
