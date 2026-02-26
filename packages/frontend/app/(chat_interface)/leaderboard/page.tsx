import { LeaderboardClient } from "./leaderboard-client"

export default function Page() {
  return (
    <main className="relative min-h-screen pl-6 md:pl-28 pr-6 md:pr-12 py-24">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-7xl tracking-widest text-yellow-400 drop-shadow-[4px_4px_0_rgba(230,57,70,1)] mb-4"
            style={{ fontFamily: "Bangers, var(--font-bebas)" }}
          >
            PARALLAX.AI CARDS
          </h1>
          <p className="text-sm md:text-base text-slate-400" style={{ fontFamily: '"Permanent Marker", var(--font-ibm-plex-mono)' }}>
            Master Leaderboard - Over 50 Battle Ready Models
          </p>
        </div>

        <LeaderboardClient />
      </div>
    </main>
  )
}
