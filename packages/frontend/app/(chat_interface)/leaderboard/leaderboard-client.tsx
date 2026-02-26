"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

type ModelStats = Record<string, string>

type ModelCard = {
  name: string
  bio: string
  ability: string
  rank: string
  stats: ModelStats
  color: string
  serial: string
}

const models: ModelCard[] = [
  {
    name: "Llama 3.1 8B",
    bio: "Meta's agile powerhouse optimized for Groq speed. A rapid-fire reasoner built for sub-second latency applications.",
    ability: "SPECIAL: INSTANT INFERENCE",
    rank: "12",
    stats: { Debut: "2024", Context: "128K", Logic: "85", Code: "82", Creative: "80", Speed: "99", Safety: "85" },
    color: "#f55036",
    serial: "GRQ-001",
  },
  {
    name: "Llama 3.3 70B",
    bio: "The heavyweight champion of open-source logic. Balancing massive parameter depth with Groq's cutting-edge LPU acceleration.",
    ability: "SPECIAL: DEEP REASONING",
    rank: "5",
    stats: { Debut: "2024", Context: "128K", Logic: "94", Code: "91", Creative: "88", Speed: "92", Safety: "90" },
    color: "#f55036",
    serial: "GRQ-002",
  },
  {
    name: "GPT OSS 120B",
    bio: "A behemoth of open-source knowledge. Wielding 120 billion parameters to solve the world's most complex textual puzzles.",
    ability: "SPECIAL: MASSIVE KNOWLEDGE",
    rank: "3",
    stats: { Debut: "2024", Context: "64K", Logic: "96", Code: "88", Creative: "92", Speed: "75", Safety: "80" },
    color: "#f55036",
    serial: "GRQ-003",
  },
  {
    name: "Llama 4 Maverick",
    bio: "The frontier experimental unit. 120 Experts working in unison to redefine what the Llama architecture is truly capable of.",
    ability: "SPECIAL: EXPERT MIXTURE",
    rank: "1",
    stats: { Debut: "2025", Context: "256K", Logic: "98", Code: "96", Creative: "95", Speed: "88", Safety: "92" },
    color: "#f55036",
    serial: "GRQ-005",
  },
  {
    name: "Liquid LFM 1.2B T",
    bio: "A thinking-centric tiny giant. Proof that neural liquid architecture can out-reason models ten times its physical size.",
    ability: "SPECIAL: LIQUID REASONING",
    rank: "20",
    stats: { Debut: "2024", Context: "32K", Logic: "91", Code: "84", Creative: "75", Speed: "95", Safety: "90" },
    color: "#6d28d9",
    serial: "OPR-001",
  },
  {
    name: "Deepseek R1 0528",
    bio: "The logic specialist from the East. Renowned for its cold, calculated problem solving and unparalleled efficiency in complex chains.",
    ability: "SPECIAL: CHAIN OF THOUGHT",
    rank: "4",
    stats: { Debut: "2024", Context: "128K", Logic: "97", Code: "95", Creative: "82", Speed: "85", Safety: "88" },
    color: "#6d28d9",
    serial: "OPR-008",
  },
  {
    name: "Qwen 3 Coder 480B",
    bio: "The ultimate architect. A massive ensemble dedicated to writing the future of code, from low-level kernels to high-level apps.",
    ability: "SPECIAL: CODE ARCHITECT",
    rank: "2",
    stats: { Debut: "2025", Context: "512K", Logic: "95", Code: "99", Creative: "85", Speed: "70", Safety: "90" },
    color: "#6d28d9",
    serial: "OPR-006",
  },
  {
    name: "Mistral Large 3",
    bio: "The pride of Europe. A sophisticated multilingual master that blends philosophical depth with precise technical execution.",
    ability: "SPECIAL: MULTI-LINGUAL",
    rank: "6",
    stats: { Debut: "2024", Context: "128K", Logic: "93", Code: "90", Creative: "94", Speed: "80", Safety: "92" },
    color: "#fbbf24",
    serial: "MST-002",
  },
  {
    name: "Codestral",
    bio: "The F1 racer of the coding world. Purpose-built for speed and precision in the IDE, turning logic into executable reality.",
    ability: "SPECIAL: IDE INTEGRATION",
    rank: "15",
    stats: { Debut: "2024", Context: "32K", Logic: "88", Code: "96", Creative: "70", Speed: "98", Safety: "85" },
    color: "#fbbf24",
    serial: "MST-008",
  },
  {
    name: "Gem 5",
    bio: "The crown jewel of Z.ai. An all-rounder that shines in every category, providing a brilliant interface between human intent and machine logic.",
    ability: "SPECIAL: ADAPTIVE FLUIDITY",
    rank: "7",
    stats: { Debut: "2025", Context: "256K", Logic: "92", Code: "91", Creative: "93", Speed: "88", Safety: "94" },
    color: "#14b8a6",
    serial: "ZAI-001",
  },
  {
    name: "Gem 4.7 Flash",
    bio: "A streak of lightning in the neural cloud. Optimized for ultra-fast response times without sacrificing the Gem series' signature accuracy.",
    ability: "SPECIAL: INSTANT REPLY",
    rank: "25",
    stats: { Debut: "2024", Context: "128K", Logic: "86", Code: "84", Creative: "88", Speed: "99", Safety: "90" },
    color: "#14b8a6",
    serial: "ZAI-005",
  },
  {
    name: "Deepseek-V3.2",
    bio: "The latest evolution of the Deepseek line, now running locally. High-tier reasoning available on consumer hardware everywhere.",
    ability: "SPECIAL: LOCAL DOMINANCE",
    rank: "10",
    stats: { Debut: "2024", Context: "64K", Logic: "92", Code: "93", Creative: "85", Speed: "85", Safety: "88" },
    color: "#3b82f6",
    serial: "OLM-003",
  },
  {
    name: "Kimi K2 Thinking",
    bio: "A pensive powerhouse that takes its time to get it right. Perfect for long-form planning and complex strategy development.",
    ability: "SPECIAL: DEEP CONTEMPLATION",
    rank: "14",
    stats: { Debut: "2024", Context: "200K", Logic: "95", Code: "88", Creative: "90", Speed: "60", Safety: "92" },
    color: "#3b82f6",
    serial: "OLM-004",
  },
  {
    name: "Gemini 3 Pro",
    bio: "Google's next-gen flagship. A multimodal marvel that perceives the world through a vast, intelligent lens, bridging data and vision.",
    ability: "SPECIAL: WORLD PERCEPTION",
    rank: "1",
    stats: { Debut: "2025", Context: "2M+", Logic: "99", Code: "96", Creative: "98", Speed: "85", Safety: "96" },
    color: "#8b5cf6",
    serial: "GEM-001",
  },
  {
    name: "Gemini 2.5 Flash",
    bio: "The efficiency king. Processing millions of tokens in the blink of an eye, it is the bedrock of modern real-time AI agents.",
    ability: "SPECIAL: MASSIVE THROUGHPUT",
    rank: "18",
    stats: { Debut: "2024", Context: "1M", Logic: "89", Code: "88", Creative: "91", Speed: "99", Safety: "94" },
    color: "#8b5cf6",
    serial: "GEM-002",
  },
  {
    name: "Pixtral 12B",
    bio: "A vision-first entity that sees what others miss. Combining Mistral's logic with advanced pixel-level comprehension.",
    ability: "SPECIAL: IMAGE SYNTHESIS",
    rank: "22",
    stats: { Debut: "2024", Context: "128K", Logic: "87", Code: "82", Creative: "95", Speed: "90", Safety: "88" },
    color: "#8b5cf6",
    serial: "GEM-004",
  },
]

type ViewMode = "deck" | "single"

function getProviderKey(serial: string) {
  return serial.split("-")[0] ?? ""
}

const providerLabels: Record<string, string> = {
  GRQ: "Groq",
  OPR: "Open Router",
  MST: "Mistral",
  ZAI: "Z.ai",
  OLM: "Ollama",
  GEM: "Gemini",
}

const bgDotsLight =
  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-43c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20-17c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000' fill-opacity='0.045'/%3E%3C/svg%3E\")"

const bgDotsDark =
  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-43c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20-17c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fff' fill-opacity='0.07'/%3E%3C/svg%3E\")"

const paperGrain =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.65'/%3E%3C/svg%3E\")"

export function LeaderboardClient() {
  const { resolvedTheme, theme, setTheme } = useTheme()
  const isDark = (resolvedTheme ?? theme) === "dark"
  const [view, setView] = useState<ViewMode>("deck")
  const [index, setIndex] = useState(0)
  const [provider, setProvider] = useState<string>("all")

  const sortedModels = useMemo(() => {
    return [...models]
      .sort((a, b) => Number(a.rank) - Number(b.rank))
  }, [])

  const providers = useMemo(() => {
    const keys = new Set(sortedModels.map((m) => getProviderKey(m.serial)).filter(Boolean))
    return Array.from(keys).sort((a, b) => a.localeCompare(b))
  }, [sortedModels])

  const filteredModels = useMemo(() => {
    if (provider === "all") return sortedModels
    return sortedModels.filter((m) => getProviderKey(m.serial) === provider)
  }, [provider, sortedModels])

  const active = filteredModels[index] ?? filteredModels[0]

  const next = () => setIndex((i) => (i + 1) % filteredModels.length)
  const prev = () => setIndex((i) => (i - 1 + filteredModels.length) % filteredModels.length)

  useEffect(() => {
    setIndex(0)
  }, [provider])

  useEffect(() => {
    if (view !== "single") return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "Escape") setView("deck")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [view, filteredModels.length])

  return (
    <div className="leaderboard-comic">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          aria-pressed={isDark}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={cn(
            "px-4 py-2",
            "border-2",
            isDark ? "border-white/80" : "border-black",
            "bg-[#ffde00] text-black",
            "shadow-[3px_3px_0_#1a1a1a]",
            "text-xs tracking-wide",
            "hover:brightness-105 active:brightness-95",
          )}
          style={{ fontFamily: '"Permanent Marker", var(--font-ibm-plex-mono)' }}
        >
          {isDark ? "LIGHT MODE" : "DARK MODE"}
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={() => setView("deck")}
          className={cn(
            "px-8 py-3 bg-transparent border-[3px]",
            isDark ? "border-white/80 text-white" : "border-black text-black",
            "font-[Bangers,var(--font-bebas)] text-lg md:text-xl tracking-widest",
            "transition-all duration-200",
            view === "deck" && "bg-[#ffde00] border-[#ffde00] text-black shadow-[4px_4px_0_#1a1a1a]",
          )}
        >
          THE DECK
        </button>
        <button
          type="button"
          onClick={() => setView("single")}
          className={cn(
            "px-8 py-3 bg-transparent border-[3px]",
            isDark ? "border-white/80 text-white" : "border-black text-black",
            "font-[Bangers,var(--font-bebas)] text-lg md:text-xl tracking-widest",
            "transition-all duration-200",
            view === "single" && "bg-[#ffde00] border-[#ffde00] text-black shadow-[4px_4px_0_#1a1a1a]",
          )}
        >
          INSPECTOR
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setProvider("all")}
          className={cn(
            "px-4 py-2 border-2",
            isDark ? "border-white/80" : "border-black",
            "text-[11px] tracking-wide",
            provider === "all"
              ? "bg-[#ffde00] text-black shadow-[3px_3px_0_#1a1a1a]"
              : isDark
                ? "bg-black/20 text-white hover:bg-black/30"
                : "bg-white/40 text-black hover:bg-white/60",
            "transition-colors duration-200",
          )}
          style={{ fontFamily: '"Permanent Marker", var(--font-ibm-plex-mono)' }}
        >
          All Providers
        </button>
        {providers.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setProvider(k)}
            className={cn(
              "px-4 py-2 border-2",
              isDark ? "border-white/80" : "border-black",
              "text-[11px] tracking-wide",
              provider === k
                ? "bg-[#ffde00] text-black shadow-[3px_3px_0_#1a1a1a]"
                : isDark
                  ? "bg-black/20 text-white hover:bg-black/30"
                  : "bg-white/40 text-black hover:bg-white/60",
              "transition-colors duration-200",
            )}
            style={{ fontFamily: '"Permanent Marker", var(--font-ibm-plex-mono)' }}
          >
            {providerLabels[k] ?? k}
          </button>
        ))}
      </div>

      <div className={cn("mt-12", view === "single" ? "flex flex-col items-center gap-8" : "hidden")}
      >
        <TiltCard model={active} interactive isDark={isDark} />
        <div className="flex gap-4">
          <button
            type="button"
            onClick={prev}
            className={cn(
              "px-8 py-3",
              "border-[3px]",
              isDark ? "border-white/80 text-white bg-black/20 hover:bg-black/30" : "border-black text-black bg-white hover:bg-yellow-400",
              "font-[Bangers,var(--font-bebas)] tracking-widest",
              "transition transform hover:scale-105 active:scale-95",
              "shadow-[4px_4px_0_#1a1a1a]",
            )}
          >
            PREVIOUS
          </button>
          <button
            type="button"
            onClick={next}
            className={cn(
              "px-8 py-3",
              "border-[3px]",
              isDark ? "border-white/80 text-white bg-black/20 hover:bg-black/30" : "border-black text-black bg-white hover:bg-yellow-400",
              "font-[Bangers,var(--font-bebas)] tracking-widest",
              "transition transform hover:scale-105 active:scale-95",
              "shadow-[4px_4px_0_#1a1a1a]",
            )}
          >
            NEXT CARD
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mt-12 grid gap-8 justify-items-center",
          "[grid-template-columns:repeat(auto-fit,minmax(320px,340px))]",
          "sm:justify-items-start sm:[grid-template-columns:repeat(auto-fit,minmax(320px,340px))]",
          view === "deck" ? "grid" : "hidden",
        )}
      >
        {filteredModels.map((m) => (
          <button
            key={m.serial}
            type="button"
            onClick={() => {
              setIndex(Math.max(0, filteredModels.findIndex((x) => x.serial === m.serial)))
              setView("single")
            }}
            className="text-left"
          >
            <TrumpCard model={m} isDark={isDark} />
          </button>
        ))}
      </div>

      <style jsx global>{`
        .leaderboard-comic {
          --card-cream: #f9f1d8;
          --stat-yellow: #ffde00;
          --border-black: #1a1a1a;
          --comic-red: #e63946;
          --comic-blue: #2a6fdb;
        }

        .leaderboard-comic {
          position: relative;
          padding: 28px 22px;
          border: 3px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 17, 26, 0.35);
          backdrop-filter: blur(6px);
        }

        .dark .leaderboard-comic {
          border-color: rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.22);
        }
      `}</style>
    </div>
  )
}

function TiltCard({ model, interactive, isDark }: { model: ModelCard; interactive?: boolean; isDark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!interactive) return

    const el = ref.current
    if (!el) return

    let raf = 0
    let lastX = 0
    let lastY = 0

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        const x = (window.innerWidth / 2 - lastX) / 40
        const y = (window.innerHeight / 2 - lastY) / 40
        el.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
        raf = 0
      })
    }

    window.addEventListener("mousemove", onMove)
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (raf) window.cancelAnimationFrame(raf)
      el.style.transform = ""
    }
  }, [interactive])

  return (
    <div ref={ref}>
      <TrumpCard model={model} interactive={interactive} isDark={isDark} />
    </div>
  )
}

function TrumpCard({ model, interactive, isDark }: { model: ModelCard; interactive?: boolean; isDark?: boolean }) {
  const statEntries = useMemo(() => Object.entries(model.stats), [model.stats])

  return (
    <div
      className={cn(
        "w-[340px] h-[540px]",
        "bg-[var(--card-cream)] text-[var(--border-black)]",
        "border-2 border-[#1a1a1a] rounded-[10px]",
        "p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "relative overflow-hidden flex flex-col",
        "transition-transform duration-300 will-change-transform",
        !interactive && "hover:-translate-y-1 hover:rotate-[-0.15deg]",
        interactive && "will-change-transform",
      )}
      style={{ backgroundImage: isDark ? bgDotsDark : bgDotsLight }}
    >
      <div
        className={cn("absolute inset-0 pointer-events-none z-20", isDark ? "opacity-20" : "opacity-25")}
        style={{ backgroundImage: paperGrain }}
      />

      <div className="w-full h-[230px] border-[3px] border-[#1a1a1a] rounded-[18px] relative overflow-hidden" style={{ backgroundColor: model.color }}>
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: "radial-gradient(rgba(0,0,0,0.2) 1px, transparent 0)",
            backgroundSize: "5px 5px",
          }}
        />

        <div
          className="absolute top-2 left-2 bg-[var(--stat-yellow)] border-2 border-black px-2 py-0.5 text-[10px] rotate-[-3deg] z-10 shadow-[2px_2px_0_#1a1a1a]"
          style={{ fontFamily: '"Permanent Marker", var(--font-ibm-plex-mono)' }}
        >
          DATA FILE: {model.serial}
        </div>

        <div
          className="absolute top-2 right-2 w-[50px] h-[50px] bg-[var(--stat-yellow)] border-2 border-black z-10 flex items-center justify-center"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        >
          <span className="font-[Bangers,var(--font-bebas)] text-lg mt-1">{model.rank}</span>
        </div>

        <div className="w-full h-full flex items-center justify-center p-12 relative z-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" className="w-full h-full opacity-80">
            <circle cx="12" cy="12" r="10" stroke="black" fill="white" fillOpacity="0.1" />
            <path d="M12 2v20M2 12h20" strokeOpacity="0.2" />
            <rect x="8" y="8" width="8" height="8" rx="1" fill="black" fillOpacity="0.2" />
            <circle cx="12" cy="12" r="3" fill="black" fillOpacity="0.1" />
          </svg>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-[-2deg] bg-[var(--stat-yellow)] border-[3px] border-black px-4 py-1 w-[85%] text-center z-10 shadow-[4px_4px_0_#1a1a1a] rounded-[18px]">
          <div className="font-[Bangers,var(--font-bebas)] text-2xl leading-none tracking-wide">{model.name}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1.4fr] gap-2 mt-4 flex-grow">
        <div className="flex flex-col gap-2">
          <div className="text-[11px] leading-tight p-2 bg-white/40 border border-dashed border-black relative flex-grow overflow-hidden font-[Kalam,var(--font-ibm-plex-sans)]">
            <div
              className="bg-black text-white text-[8px] px-1 w-fit mb-1"
              style={{ fontFamily: '"Permanent Marker", var(--font-ibm-plex-mono)' }}
            >
              BIO LOG
            </div>
            {model.bio}
          </div>
          <div className="bg-[var(--comic-blue)] text-white p-1 border-2 border-black text-[10px] text-center font-[Bangers,var(--font-bebas)] rotate-[1deg]">
            {model.ability}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {statEntries.map(([key, val]) => (
            <div key={key} className="flex items-center">
              <div
                className={cn(
                  "bg-[#ffde00] border-2 border-black px-2",
                  "text-[11px] font-bold",
                  "w-full h-6 flex justify-between items-center",
                  "rounded-l-[10px]",
                )}
                style={{ clipPath: "polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%)" }}
              >
                <span>{key} ...</span>
              </div>
              <div className="bg-white border-2 border-black border-l-0 px-2 text-[13px] font-black h-6 min-w-[45px] flex items-center justify-center ml-[-6px] font-[Bangers,var(--font-bebas)] rounded-r-[10px]">
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
