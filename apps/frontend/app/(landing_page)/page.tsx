import { HeroSection } from "@/components/hero-section"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import { PrinciplesSection } from "@/components/principles-section"
import { ColophonSection } from "@/components/colophon-section"
import { SideNav } from "@/components/side-nav"
import { promises as fs } from "fs"
import path from "path"

export default async function Page() {
  const marqueeDir = path.join(process.cwd(), "apps", "frontend", "public", "marquee")
  const entries = await fs.readdir(marqueeDir, { withFileTypes: true })
  const logos = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".svg"))
    .map((e) => {
      const name = e.name.replace(/\.svg$/i, "")
      const alt = name.replace(/[-_]+/g, " ")

      return {
        src: `/marquee/${e.name}`,
        alt,
        monochrome: !name.toLowerCase().includes("color"),
      }
    })
    .sort((a, b) => a.alt.localeCompare(b.alt))

  return (
    <main className="relative min-h-screen">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <SignalsSection logos={logos} />
        <WorkSection />
        <PrinciplesSection />
        <ColophonSection />
      </div>
    </main>
  )
}
