import { promises as fs } from "fs"
import path from "path"

const pkgRoot = path.resolve(process.cwd())
const srcDir = path.join(pkgRoot, "assets")
const destDir = path.join(pkgRoot, "public", "marquee")

async function main() {
  await fs.mkdir(destDir, { recursive: true })

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
