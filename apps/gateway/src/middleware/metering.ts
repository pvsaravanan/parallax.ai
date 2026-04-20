import type { Request, Response, NextFunction } from "express";
import { pool } from "../db/index.js";

export async function meteringMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", async () => {
    const latencyMs = Date.now() - start;
    const apiKeyId = (req as any).apiKeyId ?? null;
    const modelId = (req as any).modelId ?? "unknown";
    const promptTokens = (req as any).promptTokens ?? 0;
    const completionTokens = (req as any).completionTokens ?? 0;

    if (!apiKeyId) return;

    try {
      await pool.query(
        `INSERT INTO usage_logs (api_key_id, model_id, prompt_tokens, completion_tokens, latency_ms, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [apiKeyId, modelId, promptTokens, completionTokens, latencyMs]
      );
    } catch (err) {
      // Fire-and-forget: log error but don't break the request
      console.error("Metering insert failed:", err);
    }
  });

  next();
}
