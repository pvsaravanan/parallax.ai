import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db/index.js";
import { meteringMiddleware } from "./middleware/metering.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(meteringMiddleware);

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "gateway", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", service: "gateway", db: "disconnected" });
  }
});

async function start() {
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  app.listen(port, () => {
    console.log(`Gateway listening on http://localhost:${port}`);
  });
}

start();
