import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db/index.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "battle", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", service: "battle", db: "disconnected" });
  }
});

async function start() {
  const port = process.env.PORT ? Number(process.env.PORT) : 4001;
  app.listen(port, () => {
    console.log(`Battle engine listening on http://localhost:${port}`);
  });
}

start();
