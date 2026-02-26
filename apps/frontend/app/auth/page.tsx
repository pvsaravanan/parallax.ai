"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  getFirebaseAuth,
  getGoogleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "@/lib/firebase"
import { SplitFlapText, SplitFlapAudioProvider } from "@/components/split-flap-text"

/* ------------------------------------------------------------------ */
/*  Carousel slide data                                               */
/* ------------------------------------------------------------------ */
const SLIDES = [
  {
    title: '1B+ REQUESTS <span class="text-orange-500 text-3xl">⚡</span>',
    desc: "Zero downtime. Deployed globally in under 400ms.",
    tab: "deployment_log.sh",
    type: "terminal" as const,
    lines: [
      { text: "$ parallax deploy --production", cls: "text-gray-400" },
      { text: "[info] Analyzing application structure...", cls: "text-blue-400" },
      { text: "[info] Provisioning edge nodes in 12 regions...", cls: "text-blue-400" },
      { text: "[warn] Optimizing LLM routing for latency.", cls: "text-orange-500" },
      { text: "[success] Deployment complete! (0.84s)", cls: "text-green-500" },
      { text: "$ _", cls: "text-gray-400 mt-4" },
    ],
  },
  {
    title: 'EDGE INFRASTRUCTURE <span class="text-orange-500 text-3xl"></span>',
    desc: "Scale your full-stack apps effortlessly across our global network.",
    tab: "network_topology.viz",
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    alt: "Global Network",
  },
  {
    title: 'LLM BENCHMARKING <span class="text-orange-500 text-3xl"></span>',
    desc: "Test and route between open-source models with zero configuration.",
    tab: "model_metrics.viz",
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop",
    alt: "Code Metrics",
  },
]

/* ------------------------------------------------------------------ */
/*  Auth page                                                         */
/* ------------------------------------------------------------------ */
export default function AuthPage() {
  const router = useRouter()

  /* ---- auth form state ---- */
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  /* ---- carousel state ---- */
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToSlide = useCallback((i: number) => setCurrentSlide(i), [])

  const next = useCallback(
    () => setCurrentSlide((c) => (c + 1) % SLIDES.length),
    [],
  )
  const prev = useCallback(
    () => setCurrentSlide((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    [],
  )

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next])

  /* ---- toggle auth mode ---- */
  function toggleAuthMode() {
    setIsSignUp((v) => !v)
    setError("")
    setName("")
  }

  /* ---- Firebase: Google sign-in ---- */
  async function handleGoogle() {
    setLoading(true)
    setError("")
    try {
      await signInWithPopup(getFirebaseAuth(), getGoogleProvider())
      router.push("/chat")
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---- Firebase: email / password ---- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
        if (name) await updateProfile(cred.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
      }
      router.push("/chat")
    } catch (err: any) {
      const msg =
        err?.code
          ?.replace("auth/", "")
          .replace(/-/g, " ")
          .replace(/^\w/, (c: string) => c.toUpperCase()) ?? "Authentication failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- render ---------- */
  const slide = SLIDES[currentSlide]

  return (
    <>
      {/* inline critical styles that match the original HTML exactly */}
      <style jsx global>{`
        .auth-page-body {
          background-color: #050505;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          color: #d1d5db;
        }

        .cyber-image {
          filter: grayscale(100%) contrast(120%);
          mix-blend-mode: luminosity;
          opacity: 0.5;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #0a0a0a inset !important;
          -webkit-text-fill-color: #d1d5db !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="auth-page-body font-sans h-screen flex flex-col lg:flex-row overflow-hidden selection:bg-orange-500 selection:text-white">
        {/* ====================== LEFT PANEL ====================== */}
        <div className="w-full lg:w-5/12 h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-6 relative z-10 border-b lg:border-b-0 lg:border-r border-[#1a1a1a] bg-[#050505]/95 backdrop-blur-md overflow-hidden">
          <div className="w-full max-w-sm mx-auto">
            {/* ---- Logo ---- */}
            <div className="mb-6 flex items-center gap-2">
              <div style={{ transform: 'scale(0.22)', transformOrigin: 'left center', height: '32px', display: 'flex', alignItems: 'center' }}>
                <SplitFlapAudioProvider>
                  <SplitFlapText text="PARALLAX" speed={80} />
                </SplitFlapAudioProvider>
              </div>
            </div>

            {/* ---- Header ---- */}
            <h1 className="mb-2 text-3xl font-bold text-orange-500">
              {isSignUp ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-gray-400 text-sm mb-5">
              {isSignUp
                ? "Join Parallax.AI to start deploying your applications."
                : "Welcome back. Enter your credentials to access your deployments."}
            </p>

            {/* ---- Error banner ---- */}
            {error && (
              <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400 rounded-md">
                {error}
              </div>
            )}

            {/* ---- Google button ---- */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-2 px-4 flex items-center justify-center gap-3 mb-4 hover:bg-gray-200 transition-colors rounded-md shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* ---- Divider ---- */}
            <div className="flex items-center w-full my-4">
              <hr className="border-gray-800 flex-grow" />
              <span className="px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                or continue with email
              </span>
              <hr className="border-gray-800 flex-grow" />
            </div>

            {/* ---- Form ---- */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Name (sign-up only) */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isSignUp ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ada Lovelace"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 py-2.5 px-4 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-gray-600 font-mono text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 py-2.5 px-4 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-gray-600 font-mono text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 py-2.5 px-4 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-gray-600 font-mono text-sm"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 px-4 transition-all rounded-md flex items-center justify-center gap-2 group shadow-lg shadow-orange-900/20 disabled:opacity-50"
                >
                  <span>{loading ? "Please wait…" : isSignUp ? "Sign Up" : "Sign In"}</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* ---- Toggle link ---- */}
            <div className="mt-5 text-center text-sm text-gray-400">
              <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors ml-1"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </div>
        </div>

        {/* ====================== RIGHT PANEL (carousel) ====================== */}
        <div className="hidden lg:flex w-7/12 h-screen flex-col justify-center items-center p-8 relative bg-transparent font-mono overflow-hidden">
          {/* Status badge */}
          <div className="absolute top-8 right-8 bg-[#111] border border-gray-800 px-3 py-1 flex items-center gap-2 rounded-sm shadow-lg shadow-black z-20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">SYSTEM ONLINE</span>
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Slide title + description */}
            <div className="text-center mb-10 h-24">
              <div
                className="text-white text-5xl font-bold mb-3 flex items-center justify-center gap-3 transition-opacity duration-300 font-sans tracking-tight"
                dangerouslySetInnerHTML={{ __html: slide.title }}
              />
              <p className="text-gray-400 text-sm tracking-wide transition-opacity duration-300">
                {slide.desc}
              </p>
            </div>

            {/* Terminal / image card */}
            <div className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md shadow-[0_0_40px_rgba(255,69,0,0.06)] overflow-hidden relative h-[280px]">
              {/* Title-bar */}
              <div className="absolute top-0 left-0 w-full bg-[#111]/90 backdrop-blur-sm border-b border-gray-800 p-3 flex items-center justify-between z-20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-red-500 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-yellow-500 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-green-500 transition-colors cursor-pointer" />
                </div>
                <div className="text-gray-500 text-xs">{slide.tab}</div>
                <div className="w-10" />
              </div>

              {/* Slides */}
              {SLIDES.map((s, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 pt-12 transition-opacity duration-500 bg-[#0a0a0a] ${
                    i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {s.type === "terminal" ? (
                    <div className="p-6 flex flex-col text-sm space-y-2">
                      {s.lines!.map((line, li) => (
                        <p key={li} className={line.cls}>
                          {line.text}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.src}
                        alt={s.alt}
                        className="w-full h-full object-cover cyber-image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Carousel controls */}
            <div className="mt-6 flex gap-6 items-center text-gray-600 select-none">
              <button
                onClick={prev}
                className="hover:text-white transition-colors text-xl font-bold cursor-pointer p-2"
              >
                &lt;
              </button>
              <div className="flex gap-3">
                {SLIDES.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`cursor-pointer transition-all duration-300 rounded-full h-1.5 ${
                      i === currentSlide
                        ? "w-6 bg-orange-500"
                        : "w-2 bg-gray-700 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="hover:text-white transition-colors text-xl font-bold cursor-pointer p-2"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
