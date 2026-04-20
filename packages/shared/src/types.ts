export type ModelFamily = "llama" | "mistral" | "qwen" | "deepseek" | "gemma";

export type ApiTier = "free" | "pro" | "team" | "enterprise";

export type PromptCategory =
  | "coding"
  | "reasoning"
  | "creative"
  | "factual_qa"
  | "instruction_following";

export type VoteOption = "A" | "B" | "TIE" | "BOTH_BAD";

export interface ModelInfo {
  id: number;
  name: string;
  version: string;
  family: ModelFamily;
  eloScore: number;
  voteCount: number;
  contextWindow?: number;
  quantization?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface BattleSession {
  id: string;
  modelAId: number;
  modelBId: number;
  userId: string;
  category?: PromptCategory;
  status: "active" | "completed";
  turnCount: number;
  startedAt: Date;
}

export interface Vote {
  id: number;
  sessionId: string;
  modelAId: number;
  modelBId: number;
  winner: VoteOption;
  category?: PromptCategory;
  createdAt: Date;
}

export interface EloEntry {
  modelId: number;
  modelName: string;
  family: ModelFamily;
  eloScore: number;
  voteCount: number;
  confidenceInterval: number;
  eloDelta7d: number;
}
