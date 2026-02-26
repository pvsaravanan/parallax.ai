"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, KeyRound, Mail, ShieldCheck, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AuthMode = "sign_in" | "sign_up"

type FormState = {
  email: string
  password: string
  name?: string
}

export default function Page() {
  const [mode, setMode] = useState<AuthMode>("sign_in")
  const [form, setForm] = useState<FormState>({ email: "", password: "", name: "" })
  const [submitting, setSubmitting] = useState(false)

  const meta = useMemo(() => {
    if (mode === "sign_up") {
      return {
        eyebrow: "AUTH / SIGN UP",
        title: "CREATE ACCESS",
        description: "Provision an evaluator identity and start capturing preference data.",
        icon: <UserPlus className="h-4 w-4" />,
      }
    }

    return {
      eyebrow: "AUTH / SIGN IN",
      title: "VERIFY ACCESS",
      description: "Return to your evaluation sessions and rankings dashboard.",
      icon: <ShieldCheck className="h-4 w-4" />,
    }
  }, [mode])

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      alert("Auth is UI-only for now. Wire this to your auth provider/backend.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen pl-6 md:pl-28 pr-6 md:pr-12 py-20">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{meta.eyebrow}</span>
            <h1 className="mt-4 font-[var(--font-bebas)] text-6xl md:text-8xl tracking-tight leading-none">{meta.title}</h1>
            <p className="mt-6 font-mono text-sm text-muted-foreground leading-relaxed">{meta.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 border border-border/40 bg-card/20 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              <ArrowLeft className="h-3 w-3" />
              Home
            </a>
            <a
              href="/chat"
              className="border border-border/40 bg-card/20 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              Go to Chat
            </a>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm rounded-none">
            <CardHeader>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <CardTitle className="font-[var(--font-bebas)] text-4xl tracking-tight">{mode === "sign_in" ? "Sign in" : "Create account"}</CardTitle>
                  <CardDescription className="font-mono text-xs mt-2">
                    {mode === "sign_in" ? "Use your credentials." : "Create an identity for evaluation."}
                  </CardDescription>
                </div>

                <div className="border border-border/40 bg-background/40 p-3 text-accent">{meta.icon}</div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={mode} onValueChange={(v) => setMode(v as AuthMode)} className="gap-6">
                <TabsList className="w-full justify-between rounded-none">
                  <TabsTrigger value="sign_in" className="rounded-none">
                    Sign in
                  </TabsTrigger>
                  <TabsTrigger value="sign_up" className="rounded-none">
                    Sign up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sign_in" className="mt-2">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          className="pl-10 rounded-none bg-background/20 border-border/40"
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                        <Input
                          id="password"
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                          className="pl-10 rounded-none bg-background/20 border-border/40"
                          placeholder="••••••••"
                          autoComplete="current-password"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                      <Button
                        type="button"
                        onClick={() => void onSubmit()}
                        disabled={submitting || !form.email || !form.password}
                        className="rounded-none font-mono text-[10px] uppercase tracking-[0.3em]"
                      >
                        {submitting ? "Signing in" : "Sign in"}
                      </Button>

                      <a
                        href="#"
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors duration-200",
                        )}
                      >
                        Reset password
                      </a>
                    </div>

                    <div className="pt-4 border-t border-border/20">
                      <button
                        type="button"
                        onClick={() => setMode("sign_up")}
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors duration-200"
                      >
                        No account? Sign up
                      </button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sign_up" className="mt-2">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={form.name ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="rounded-none bg-background/20 border-border/40"
                        placeholder="Evaluator"
                        autoComplete="name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email2" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                        <Input
                          id="email2"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          className="pl-10 rounded-none bg-background/20 border-border/40"
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password2" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                        <Input
                          id="password2"
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                          className="pl-10 rounded-none bg-background/20 border-border/40"
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => void onSubmit()}
                        disabled={submitting || !form.email || !form.password}
                        className="rounded-none font-mono text-[10px] uppercase tracking-[0.3em]"
                      >
                        {submitting ? "Creating" : "Create account"}
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-border/20">
                      <button
                        type="button"
                        onClick={() => setMode("sign_in")}
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors duration-200"
                      >
                        Already have an account? Sign in
                      </button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <aside className="border border-border/40 bg-card/20 backdrop-blur-sm p-8 rounded-none">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Notes</div>
                <div className="mt-4 font-[var(--font-bebas)] text-4xl tracking-tight">Evaluation access</div>
              </div>
              <div className="border border-border/40 bg-background/40 p-3 text-accent">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="border border-border/30 p-4 bg-background/20">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">What to capture</div>
                <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                  Session id, prompt version, model ids, transcript, and preference outcomes.
                </p>
              </div>

              <div className="border border-border/30 p-4 bg-background/20">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Security posture</div>
                <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                  Use short-lived tokens and minimal scopes for evaluators.
                </p>
              </div>

              <div className="border border-border/30 p-4 bg-background/20">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Integrations</div>
                <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                  This page is UI-only. Tell me if you want Clerk, NextAuth, Supabase Auth, or a custom backend.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-border/20 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            By continuing you agree to evaluation policy and data handling.
          </p>
        </div>
      </div>
    </main>
  )
}
