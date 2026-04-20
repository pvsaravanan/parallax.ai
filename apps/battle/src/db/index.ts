import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Enable pgcrypto extension for UUID generation
pool.on("connect", async (client) => {
  await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
});

export const db = drizzle(pool, { schema });
export { pool };
