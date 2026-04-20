import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { models, votes, type NewModel } from "./schema.js";

const MODELS_TO_SEED: NewModel[] = [
  // Llama (5)
  { name: "llama-3.3-70b-instruct", version: "3.3", family: "llama", eloScore: 1000, voteCount: 0 },
  { name: "llama-3.1-70b-instruct", version: "3.1", family: "llama", eloScore: 1000, voteCount: 0 },
  { name: "llama-3.1-8b-instruct", version: "3.1", family: "llama", eloScore: 1000, voteCount: 0 },
  { name: "llama-3.2-3b-instruct", version: "3.2", family: "llama", eloScore: 1000, voteCount: 0 },
  { name: "llama-3-8b-instruct", version: "3.0", family: "llama", eloScore: 1000, voteCount: 0 },
  // Mistral (3)
  { name: "mistral-7b-instruct-v0.3", version: "0.3", family: "mistral", eloScore: 1000, voteCount: 0 },
  { name: "mixtral-8x7b-instruct", version: "8x7b", family: "mistral", eloScore: 1000, voteCount: 0 },
  { name: "mistral-small-2409", version: "2409", family: "mistral", eloScore: 1000, voteCount: 0 },
  // Qwen (3)
  { name: "qwen2.5-72b-instruct", version: "2.5", family: "qwen", eloScore: 1000, voteCount: 0 },
  { name: "qwen2.5-7b-instruct", version: "2.5", family: "qwen", eloScore: 1000, voteCount: 0 },
  { name: "qwen2-72b-instruct", version: "2.0", family: "qwen", eloScore: 1000, voteCount: 0 },
  // DeepSeek (2)
  { name: "deepseek-r1-distill-llama-70b", version: "r1", family: "deepseek", eloScore: 1000, voteCount: 0 },
  { name: "deepseek-v2-chat", version: "v2", family: "deepseek", eloScore: 1000, voteCount: 0 },
  // Gemma (2)
  { name: "gemma-2-27b-it", version: "2", family: "gemma", eloScore: 1000, voteCount: 0 },
  { name: "gemma-2-9b-it", version: "2", family: "gemma", eloScore: 1000, voteCount: 0 },
];

const CATEGORIES = ["coding", "reasoning", "creative", "factual_qa", "instruction_following"];
const WINNERS = ["A", "B", "TIE", "BOTH_BAD"] as const;

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    await pool.query("BEGIN");

    // Check if models already exist
    const existing = await db.select().from(models);
    if (existing.length > 0) {
      console.log("Models already seeded, skipping...");
    } else {
      await db.insert(models).values(MODELS_TO_SEED);
      console.log(`Inserted ${MODELS_TO_SEED.length} models`);
    }

    // Generate 500 mock votes if votes table is empty
    const existingVotes = await db.select().from(votes);
    if (existingVotes.length > 0) {
      console.log("Votes already seeded, skipping...");
    } else {
      const allModels = await db.select().from(models);
      if (allModels.length === 0) throw new Error("No models found");

      const mockVotes = [];
      for (let i = 0; i < 500; i++) {
        const modelA = allModels[Math.floor(Math.random() * allModels.length)];
        let modelB = allModels[Math.floor(Math.random() * allModels.length)];
        while (modelB.id === modelA.id) {
          modelB = allModels[Math.floor(Math.random() * allModels.length)];
        }

        mockVotes.push({
          sessionId: crypto.randomUUID(),
          modelAId: modelA.id,
          modelBId: modelB.id,
          winner: WINNERS[Math.floor(Math.random() * WINNERS.length)],
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        });
      }

      // Insert in batches
      const BATCH_SIZE = 100;
      for (let i = 0; i < mockVotes.length; i += BATCH_SIZE) {
        const batch = mockVotes.slice(i, i + BATCH_SIZE);
        await db.insert(votes).values(batch);
      }
      console.log(`Inserted ${mockVotes.length} mock votes`);
    }

    await pool.query("COMMIT");
    console.log("Seed completed successfully");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
