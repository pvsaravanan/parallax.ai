import { Marquee } from "@/components/ui/marquee"

const logos = [
  { src: "/marquee/openai.svg", alt: "OpenAI", monochrome: true },
  { src: "/marquee/anthropic.svg", alt: "Anthropic", monochrome: true },
  { src: "/marquee/meta-color.svg", alt: "Meta" },
  { src: "/marquee/gemini-color.svg", alt: "Gemini" },
  { src: "/marquee/gemma-color.svg", alt: "Gemma" },
  { src: "/marquee/mistral-color.svg", alt: "Mistral" },
  { src: "/marquee/deepseek-color.svg", alt: "DeepSeek" },
  { src: "/marquee/qwen-color.svg", alt: "Qwen" },
  { src: "/marquee/groq.svg", alt: "Groq", monochrome: true },
  { src: "/marquee/xai.svg", alt: "xAI", monochrome: true },
  { src: "/marquee/kimi-color.svg", alt: "Kimi" },
  { src: "/marquee/moonshot.svg", alt: "Moonshot", monochrome: true },
  { src: "/marquee/openrouter.svg", alt: "OpenRouter", monochrome: true },
  { src: "/marquee/zai.svg", alt: "Z.ai", monochrome: true },
  { src: "/marquee/bfl.svg", alt: "BFL", monochrome: true },
  { src: "/marquee/claude-color.svg", alt: "Claude" },
  { src: "/marquee/longcat-color.svg", alt: "Longcat" },
]

export function ModesMarquee() {
  return (
    <div className="relative w-full">
      <Marquee pauseOnHover speed={28} className="sm:mt-16 mt-10">
        {logos.map((logo) => (
          <div key={logo.src} className="mx-12 flex items-center">
            <img
              src={logo.src}
              alt={logo.alt}
              className={
                "h-5 md:h-6 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200" +
                (logo.monochrome ? " dark:invert" : "")
              }
              draggable={false}
              loading="eager"
            />
          </div>
        ))}
      </Marquee>
    </div>
  )
}
