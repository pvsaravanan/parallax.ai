import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        foreground: "var(--color-text-primary)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
        "accent-hover": "var(--color-accent)",
        // Claude-style chat input tokens
        "bg-0": "var(--bg-0)",
        "bg-000": "var(--bg-000)",
        "bg-100": "var(--bg-100)",
        "bg-200": "var(--bg-200)",
        "bg-300": "var(--bg-300)",
        "text-100": "var(--text-100)",
        "text-200": "var(--text-200)",
        "text-300": "var(--text-300)",
        "text-400": "var(--text-400)",
        "text-500": "var(--text-500)",
      },
      fontFamily: {
        sans: ["var(--font-anthropic-sans)"],
        mono: ["var(--font-anthropic-mono)"],
        serif: ["var(--font-anthropic-serif)"],
        ui: ["var(--font-anthropic-sans)"],
        dyslexic: ["var(--font-open-dyslexic)"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s cubic-bezier(0.2, 0, 0, 1) both",
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(8px) scale(0.98)",
            filter: "blur(4px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
