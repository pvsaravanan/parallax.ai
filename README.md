# parallax.ai

> One platform. Every open-source model. Real community intelligence.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)](CHANGELOG.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![API Status](https://img.shields.io/badge/API-OpenAI--compatible-orange)](docs/api.md)

**parallax.ai** is a unified open-source AI model platform that brings together the world's leading open-source language models — Llama, Mistral, Qwen, DeepSeek, Gemma, and more — under a single, elegant interface. It is simultaneously a consumer product, a developer tool, and a community-driven research instrument.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Module Structure](#module-structure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

The open-source AI ecosystem is rich but fragmented. Users and developers face compounding challenges: no single place to explore and compare models, no community-validated signal for which model suits a given task, and unnecessary overhead managing multiple API keys, SDKs, and rate limits across providers.

parallax.ai solves this with three core pillars:

| Pillar | Description |
|--------|-------------|
| **Chat** | Three distinct modes — Direct, Side-by-Side, and Battle — serving different user intentions |
| **API** | A single unified API key granting access to all hosted models, OpenAI-compatible |
| **Research** | Live benchmarks, model statistics, and a community-powered ELO leaderboard |

---

## Features

### Chat Modes

**Direct Chat** — The focused, single-model experience. Select any model from the full catalog and converse in a clean, distraction-free interface with streaming output, session history, system prompt support, and conversation export.

**Side-by-Side Chat** — Send the same prompt to two models simultaneously and watch responses stream in parallel. Built for developers evaluating models for a production use case and researchers comparing voice, depth, and accuracy.

**Battle Mode** *(Signature Feature)* — Two anonymous models respond to your prompts. Vote on which response you prefer. Model identities are revealed only after you vote, eliminating identity bias. Every completed battle contributes to the platform's live ELO leaderboard.

Vote options: `Model A is better` · `Model B is better` · `Tie` · `Both are bad`

---

### Unified API

A single API key. Every model. OpenAI-compatible.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.parallax.ai/v1",
    api_key="your-parallax-api-key"
)

response = client.chat.completions.create(
    model="meta/llama-3.3-70b-instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

Drop-in replacement for `openai` — change the `base_url` and `model` name. No new SDK required.

---

### Research & Leaderboard

- **ELO Leaderboard** — Continuously updated human-preference rankings driven by Battle votes. Filterable by category (Coding, Reasoning, Creative, Factual QA, Instruction Following) and time window (all-time, 30 days, 7 days).
- **Per-Model Statistics** — Standard benchmark scores (MMLU, HumanEval, MATH, MT-Bench, GSM8K), live latency metrics (TTFT, tokens/sec), architecture details, and usage popularity.
- **Version Tracking** — ELO is tracked per model version to capture regressions and improvements across releases.
- **Public Dataset** — Aggregated, anonymized battle results exported weekly as a public dataset for the research community.

---

## Architecture

<img width="17964" height="9198" alt="parallax ai technical architecture" src="https://github.com/user-attachments/assets/b7de6df5-ed06-4277-9933-0e537feeb035" />

<br>

The system is composed of four layers, with a dedicated analytics surface for the leaderboard pipeline:

**Client Layer** — The four frontend surfaces (Direct Chat, Side-by-Side Chat, Battle Mode, Developer Console) communicate exclusively through the API Gateway.

**API Gateway Layer** — Handles auth & API key validation, rate limiting, model routing, usage metering, and SSE streaming. This is the single choke point through which all client traffic passes.

**Core Services Layer** — The Battle Engine randomly pairs models and enforces server-side anonymity. The ELO Engine processes vote events and recalculates rankings. The Vote Service writes to an append-only event log. The Benchmark Service and Anonymization Service support the research and privacy surfaces respectively.

**Inference & Data Layer** — Model inference routes to Together AI, Groq, Fireworks AI, or self-hosted GPU infrastructure depending on model and load. Persistent state lives in PostgreSQL (relational) and a TimeSeries DB (latency metrics).

**Leaderboard & Analytics Surface** — Decoupled from the request path. The Vote Event Log feeds an ELO Batch Job (runs every 5 minutes) that refreshes a Materialized View powering the leaderboard. Category filters, confidence intervals, per-version ELO tracking, live latency stats, and the weekly public dataset export all derive from this pipeline. Anti-manipulation controls (rate limiting + session validation) are enforced at the vote ingestion boundary.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 15
- Redis ≥ 7

### Local Development

```bash
# Clone the repository
git clone https://github.com/pvsaravanan/parallax.ai.git
cd parallax.ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your provider API keys and database credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `TOGETHER_API_KEY` | Together AI API key for model inference | Yes |
| `GROQ_API_KEY` | Groq API key for model inference | Yes |
| `FIREWORKS_API_KEY` | Fireworks AI API key for model inference | Yes |
| `JWT_SECRET` | Secret for signing session tokens | Yes |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL | Yes |

See `.env.example` for the complete list.

---

## API Reference

The parallax.ai API is fully OpenAI-compatible. Existing integrations can be migrated by changing two lines.

### Authentication

All API requests require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer prlx_your_api_key_here
```

### Chat Completions

```
POST https://api.parallax.ai/v1/chat/completions
```

```json
{
  "model": "meta/llama-3.3-70b-instruct",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Explain the difference between RAG and fine-tuning." }
  ],
  "stream": true
}
```

### Supported Models

Models are specified in the format `{provider}/{model-name}`. The full catalog is available at `GET /v1/models`.

Examples:
- `meta/llama-3.3-70b-instruct`
- `mistralai/mistral-large-2`
- `qwen/qwen2.5-72b-instruct`
- `deepseek-ai/deepseek-r1`
- `google/gemma-3-27b-it`

Full API documentation is available in [`docs/api.md`](docs/api.md).

---

## Module Structure

```
src/
├── modules/
│   ├── design-system/        # Tokens, components, layout primitives
│   ├── direct-chat/          # Single-model chat interface
│   ├── comparison/           # Side-by-Side and Battle Mode
│   ├── leaderboard/          # ELO leaderboard and model stats pages
│   ├── developer-console/    # API key management and usage dashboard
│   ├── auth/                 # Authentication and session management
│   ├── api-gateway/          # Model routing, streaming, usage metering
│   └── battle-engine/        # ELO pipeline, vote ingestion, analytics
├── lib/                      # Shared utilities
└── tests/                    # Test suites per module
```

---

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting a pull request.

### Development Principles

- **Module isolation** — each module has clearly defined dependencies (see architecture above). Avoid cross-module imports outside the defined dependency chain.
- **Anti-manipulation first** — any changes to the vote or ELO pipeline must include tests for the rate limiting, minimum-turn, and anomaly detection invariants. ELO integrity is the leaderboard's core value proposition.
- **Version-aware ELO** — ELO scores are always tracked per model version, never aggregated across versions. Do not conflate model releases.
- **OpenAI compatibility** — the `/v1/chat/completions` endpoint must remain a drop-in replacement. Breaking changes require a major version bump and a migration guide.

### Reporting Issues

Please use [GitHub Issues](https://github.com/parallax-ai/parallax/issues) for bug reports and feature requests. For security vulnerabilities, see [`SECURITY.md`](SECURITY.md).

---

## License

parallax.ai is released under the [MIT License](LICENSE).

---

<p align="center">
  Built by <strong>Saravanan P V · Musfira Mahjabeen · Oswald Shilo</strong>
</p>
