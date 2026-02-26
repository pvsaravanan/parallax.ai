import { promises as fs } from "fs"
import path from "path"

const repoRoot = path.resolve(process.cwd())
const srcDir = path.join(repoRoot, "apps", "frontend", "assets")
const destDir = path.join(repoRoot, "apps", "frontend", "public", "marquee")

async function main() {
  await fs.mkdir(destDir, { recursive: true })

  try {
    await fs.access(srcDir)
  } catch {
    process.stdout.write(`No marquee SVGs copied (missing src dir): ${srcDir}\n`)
    return
  }

  const entries = await fs.readdir(srcDir, { withFileTypes: true })
  const svgs = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".svg"))

  await Promise.all(
    svgs.map(async (e) => {
      const from = path.join(srcDir, e.name)
      const to = path.join(destDir, e.name)
      await fs.copyFile(from, to)
    }),
  )

  process.stdout.write(`Copied ${svgs.length} SVG(s) from ${srcDir} to ${destDir}\n`)
}

main().catch((err) => {
  process.stderr.write(`${err?.stack ?? err}\n`)
  process.exit(1)
})
