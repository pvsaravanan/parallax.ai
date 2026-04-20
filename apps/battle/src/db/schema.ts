import { pgTable, serial, text, integer, bigint, timestamp, uuid, real } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  version: text("version").notNull(),
  family: text("family").notNull(),
  eloScore: real("elo_score").default(1000),
  voteCount: integer("vote_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const battleSessions = pgTable("battle_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelAId: integer("model_a_id").notNull(),
  modelBId: integer("model_b_id").notNull(),
  userId: text("user_id").notNull(),
  category: text("category"),
  status: text("status").default("active"),
  turnCount: integer("turn_count").default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

export const votes = pgTable("votes", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  sessionId: uuid("session_id").notNull(),
  modelAId: integer("model_a_id").notNull(),
  modelBId: integer("model_b_id").notNull(),
  winner: text("winner").notNull(), // CHECK winner IN ('A','B','TIE','BOTH_BAD')
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const eloHistory = pgTable("elo_history", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  modelId: integer("model_id").notNull(),
  eloScore: real("elo_score").notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});

export type Model = typeof models.$inferSelect;
export type NewModel = typeof models.$inferInsert;
export type BattleSession = typeof battleSessions.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type EloHistory = typeof eloHistory.$inferSelect;
