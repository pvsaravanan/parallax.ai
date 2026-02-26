"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type ChatMode = "direct" | "side_by_side" | "battle"

type ModelOption = {
  id: string
  label: string
}

type DirectMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

type PairTurn = {
  id: string
  user: { content: string; createdAt: number }
  a: { content: string; createdAt: number }
  b: { content: string; createdAt: number }
  picked?: "A" | "B"
}

const SEED_TS = 1735689600000

function formatTime(ts: number) {
  return new Date(ts).toISOString().slice(11, 16)
}

export default function Page() {
  const [mode, setMode] = useState<ChatMode>("direct")
  const [input, setInput] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const models = useMemo<ModelOption[]>(
    () => [
      { id: "gpt-4.1", label: "GPT 4.1" },
      { id: "gpt-4.1-mini", label: "GPT 4.1 Mini" },
      { id: "claude", label: "Claude" },
      { id: "gemini", label: "Gemini" },
      { id: "llama", label: "Llama" },
    ],
    [],
  )

  const [directModel, setDirectModel] = useState<string>(models[0]?.id ?? "")
  const [sideA, setSideA] = useState<string>(models[0]?.id ?? "")
  const [sideB, setSideB] = useState<string>(models[1]?.id ?? models[0]?.id ?? "")

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => [
    {
      id: "seed-1",
      role: "assistant",
      content:
        "Direct Chat (local demo). Connect this to your backend to run interactive studies and record structured outcomes.",
      createdAt: SEED_TS,
    },
  ])

  const [pairTurns, setPairTurns] = useState<PairTurn[]>(() => [
    {
      id: "seed-pair-1",
      user: { content: "Give me a concise explanation of preference-based evaluation.", createdAt: SEED_TS },
      a: {
        content:
          "Model A: Preference-based evaluation uses human (or proxy) choices between outputs to estimate which system better matches user intent.",
        createdAt: SEED_TS,
      },
      b: {
        content:
          "Model B: It measures quality by collecting pairwise judgments, then aggregating them into rankings or calibrated scores under a protocol.",
        createdAt: SEED_TS,
      },
    },
  ])

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !isReplying, [input, isReplying])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [directMessages.length, pairTurns.length, mode])

  const resetInputFocus = () => requestAnimationFrame(() => inputRef.current?.focus())

  const send = async () => {
    const content = input.trim()
    if (!content || isReplying) return

    setInput("")
    setIsReplying(true)

    const now = Date.now()

    if (mode === "direct") {
      setDirectMessages((prev) => [
        ...prev,
        {
          id: `u-${now}`,
          role: "user",
          content,
          createdAt: now,
        },
      ])

      await new Promise((r) => setTimeout(r, 450))

      const replyAt = Date.now()
      setDirectMessages((prev) => [
        ...prev,
        {
          id: `a-${replyAt}`,
          role: "assistant",
          content:
            `(Placeholder response from ${models.find((m) => m.id === directModel)?.label ?? "Model"})\n\nWire this to your model gateway and log: prompt_id, policy_id, model_id, transcript, and evaluator outcomes.`,
          createdAt: replyAt,
        },
      ])
      setIsReplying(false)
      resetInputFocus()
      return
    }

    setPairTurns((prev) => [
      ...prev,
      {
        id: `t-${now}`,
        user: { content, createdAt: now },
        a: { content: "…", createdAt: now },
        b: { content: "…", createdAt: now },
      },
    ])

    await new Promise((r) => setTimeout(r, 500))

    const replyAt = Date.now()
    setPairTurns((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      if (!last) return prev

      const aLabel = mode === "battle" ? "A" : models.find((m) => m.id === sideA)?.label ?? "Model A"
      const bLabel = mode === "battle" ? "B" : models.find((m) => m.id === sideB)?.label ?? "Model B"

      last.a = {
        content: `${aLabel}: (Placeholder response)\n\nConnect this panel to a selectable model id.`,
        createdAt: replyAt,
      }
      last.b = {
        content: `${bLabel}: (Placeholder response)\n\nSide-by-side is best for controlled comparisons and ablations.`,
        createdAt: replyAt,
      }
      return next
    })

    setIsReplying(false)
    resetInputFocus()
  }

  const pickBlindWinner = (turnId: string, picked: "A" | "B") => {
    setPairTurns((prev) => prev.map((t) => (t.id === turnId ? { ...t, picked } : t)))
  }

  const modeMeta = useMemo(() => {
    if (mode === "direct") {
      return {
        label: "Direct Chat",
        tagline: "Chat with one selected model.",
      }
    }
    if (mode === "side_by_side") {
      return {
        label: "Side-by-Side",
        tagline: "Pick two models explicitly and compare outputs.",
      }
    }
    return {
      label: "Battle",
      tagline: "Two anonymous models. Vote A or B.",
    }
  }, [mode])

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 min-h-screen flex">
        <aside className="w-[260px] shrink-0 border-r border-border/40 bg-background/60 backdrop-blur-sm">
          <div className="h-14 px-5 flex items-center justify-between border-b border-border/30">
            <div className="flex items-center gap-2">
              <span className="text-lg font-[var(--font-bebas)] tracking-tight">Arena</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Parallax</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">v0</span>
          </div>

          <nav className="px-3 py-4 space-y-1">
            <SidebarLink href="/chat" label="New Chat" active />
            <SidebarLink href="/leaderboard" label="Leaderboard" />
            <SidebarLink href="/rankings" label="Search" />
          </nav>

          <div className="mt-auto px-5 py-4 border-t border-border/30">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Shortcuts</div>
            <div className="mt-3 space-y-2">
              <a href="/" className="block font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                Home
              </a>
              <a href="/direct" className="block font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                Read Mode
              </a>
            </div>
          </div>
        </aside>

        <section className="flex-1 min-w-0">
          <header className="h-14 px-6 flex items-center justify-between border-b border-border/30 bg-background/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Mode</div>
              <div className="flex items-center gap-2">
                <ModePill label="Battle" active={mode === "battle"} onClick={() => setMode("battle")} />
                <ModePill label="Direct" active={mode === "direct"} onClick={() => setMode("direct")} />
                <ModePill label="Side-by-Side" active={mode === "side_by_side"} onClick={() => setMode("side_by_side")} />
              </div>
            </div>

            <button
              type="button"
              className="border border-border/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-200"
            >
              Login
            </button>
          </header>

          <div className="p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col gap-6">
                <div className="text-center pt-10 pb-2">
                  <div className="font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight leading-none">Experience the</div>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-accent text-accent-foreground font-[var(--font-bebas)] text-4xl md:text-6xl leading-none">
                      frontier
                    </span>
                  </div>
                  <p className="mt-6 font-mono text-sm text-muted-foreground">{modeMeta.tagline}</p>
                </div>

                <div className="border border-border/40 bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="border-b border-border/30 px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Session</div>
                      <div className="font-mono text-xs text-foreground/80">Local demo</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {isReplying ? "Generating" : "Idle"}
                      </div>
                    </div>

                    {mode === "direct" ? (
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Model</div>
                        <select
                          value={directModel}
                          onChange={(e) => setDirectModel(e.target.value)}
                          className="bg-background/40 border border-border/40 px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
                        >
                          {models.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : mode === "side_by_side" ? (
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">A</div>
                          <select
                            value={sideA}
                            onChange={(e) => setSideA(e.target.value)}
                            className="bg-background/40 border border-border/40 px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
                          >
                            {models.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">B</div>
                          <select
                            value={sideB}
                            onChange={(e) => setSideB(e.target.value)}
                            className="bg-background/40 border border-border/40 px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
                          >
                            {models.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Anonymous A/B</div>
                    )}
                  </div>

                  <div
                    ref={listRef}
                    className="h-[48vh] md:h-[56vh] overflow-y-auto px-6 py-6 space-y-4 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_55%)]"
                  >
                    {mode === "direct" ? (
                      directMessages.map((m) => (
                        <MessageBubble
                          key={m.id}
                          side={m.role === "user" ? "right" : "left"}
                          label={m.role === "assistant" ? "Model" : "You"}
                          timestamp={formatTime(m.createdAt)}
                          content={m.content}
                        />
                      ))
                    ) : (
                      pairTurns.map((t) => (
                        <article key={t.id} className="space-y-4">
                          <MessageBubble
                            side="right"
                            label="You"
                            timestamp={formatTime(t.user.createdAt)}
                            content={t.user.content}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MessageBubble
                              side="left"
                              label={
                                mode === "battle"
                                  ? "Response A"
                                  : models.find((m) => m.id === sideA)?.label ?? "Model A"
                              }
                              timestamp={formatTime(t.a.createdAt)}
                              content={t.a.content}
                              compact
                            />
                            <MessageBubble
                              side="left"
                              label={
                                mode === "battle"
                                  ? "Response B"
                                  : models.find((m) => m.id === sideB)?.label ?? "Model B"
                              }
                              timestamp={formatTime(t.b.createdAt)}
                              content={t.b.content}
                              compact
                            />
                          </div>

                          {mode === "battle" ? (
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Vote winner</span>
                              <button
                                type="button"
                                onClick={() => pickBlindWinner(t.id, "A")}
                                className={cn(
                                  "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
                                  "rounded-full",
                                  t.picked === "A"
                                    ? "border-accent/60 text-accent"
                                    : "border-border/40 text-muted-foreground hover:text-accent hover:border-accent/60",
                                )}
                              >
                                A
                              </button>
                              <button
                                type="button"
                                onClick={() => pickBlindWinner(t.id, "B")}
                                className={cn(
                                  "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
                                  "rounded-full",
                                  t.picked === "B"
                                    ? "border-accent/60 text-accent"
                                    : "border-border/40 text-muted-foreground hover:text-accent hover:border-accent/60",
                                )}
                              >
                                B
                              </button>
                              <span className="font-mono text-[10px] text-muted-foreground/60">
                                {t.picked ? `Recorded: ${t.picked}` : "Unselected"}
                              </span>
                            </div>
                          ) : null}
                        </article>
                      ))
                    )}
                  </div>

                  <div className="border-t border-border/30 px-6 py-4 bg-background/40">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Ask anything</div>
                    <div className="mt-3 flex items-end gap-3">
                      <div className="flex-1">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                              e.preventDefault()
                              void send()
                            }
                          }}
                          placeholder="Ask anything…"
                          className={cn(
                            "w-full min-h-[56px] max-h-[160px] resize-y",
                            "rounded-2xl",
                            "bg-background/60 border border-border/40",
                            "px-4 py-3",
                            "font-mono text-xs md:text-sm text-foreground",
                            "placeholder:text-muted-foreground/60",
                            "focus:outline-none focus:ring-1 focus:ring-accent/60",
                          )}
                        />
                        <div className="mt-2 font-mono text-[10px] text-muted-foreground/60">
                          {mode === "battle"
                            ? "Battle mode: models are anonymous. Vote A/B after replies."
                            : mode === "side_by_side"
                              ? "Side-by-Side: select two models to compare responses."
                              : "Direct: select a model and chat."}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void send()}
                        disabled={!canSend}
                        className={cn(
                          "h-[56px] px-5",
                          "rounded-2xl",
                          "border",
                          "font-mono text-[10px] uppercase tracking-[0.3em]",
                          "transition-colors duration-200",
                          canSend
                            ? "border-foreground/20 text-foreground bg-background/60 hover:border-accent hover:text-accent"
                            : "border-border/30 text-muted-foreground/50 cursor-not-allowed bg-background/40",
                        )}
                      >
                        {isReplying ? "Sending" : "Send"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ModePill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
        active
          ? "border-foreground/20 text-foreground bg-background/40"
          : "border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20",
      )}
    >
      {label}
    </button>
  )
}

function SidebarLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active?: boolean
}) {
  return (
    <a
      href={href}
      className={cn(
        "block border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
        active
          ? "border-accent/60 text-accent bg-accent/5"
          : "border-border/0 text-muted-foreground hover:text-foreground hover:border-foreground/10",
      )}
    >
      {label}
    </a>
  )
}

function MessageBubble({
  side,
  label,
  timestamp,
  content,
  compact,
}: {
  side: "left" | "right"
  label: string
  timestamp: string
  content: string
  compact?: boolean
}) {
  const isRight = side === "right"
  return (
    <div className={cn("flex", isRight ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(720px,92%)]",
          compact ? "w-full" : "",
          isRight ? "ml-auto" : "mr-auto",
        )}
      >
        <div className={cn("flex items-baseline gap-3", isRight ? "justify-end" : "justify-start")}>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
          <time className="font-mono text-[10px] text-muted-foreground/60">{timestamp}</time>
        </div>
        <div
          className={cn(
            "mt-2 rounded-2xl border",
            "px-4 py-3",
            isRight
              ? "bg-accent/10 border-accent/25"
              : "bg-background/70 border-border/40",
          )}
        >
          <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-foreground/90">
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
        active
          ? "border-accent/60 text-accent bg-accent/5"
          : "border-border/40 text-muted-foreground hover:text-accent hover:border-accent/60",
      )}
    >
      {label}
    </button>
  )
}
