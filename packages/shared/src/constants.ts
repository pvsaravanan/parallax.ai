import type { ModelFamily, PromptCategory, ApiTier } from "./types.js";

export const MODEL_FAMILIES: { id: ModelFamily; label: string; color: string }[] = [
  { id: "llama", label: "Llama", color: "#6EE7FF" },
  { id: "mistral", label: "Mistral", color: "#FF6B9D" },
  { id: "qwen", label: "Qwen", color: "#4ADE80" },
  { id: "deepseek", label: "DeepSeek", color: "#F472B6" },
  { id: "gemma", label: "Gemma", color: "#FBBF24" },
];

export const PROMPT_CATEGORIES: { id: PromptCategory; label: string }[] = [
  { id: "coding", label: "Coding" },
  { id: "reasoning", label: "Reasoning" },
  { id: "creative", label: "Creative" },
  { id: "factual_qa", label: "Factual QA" },
  { id: "instruction_following", label: "Instruction Following" },
];

export const API_TIER_LIMITS: Record<
  ApiTier,
  { tokensPerMonth: number; rateLimit: number }
> = {
  free: { tokensPerMonth: 100_000, rateLimit: 10 },
  pro: { tokensPerMonth: 5_000_000, rateLimit: 60 },
  team: { tokensPerMonth: 20_000_000, rateLimit: 200 },
  enterprise: { tokensPerMonth: Infinity, rateLimit: 1000 },
};
