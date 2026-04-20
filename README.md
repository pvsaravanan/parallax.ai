# parallax.ai

parallax.ai is a unified open-source AI model platform for chatting, comparing models side-by-side, and running battles with an ELO leaderboard backed by a gateway and battle engine.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for Postgres)

## Setup

1. `cp .env.example .env` (and fill in API keys)
2. `docker compose up -d` (starts Postgres, waits for healthcheck)
3. `pnpm install`
4. `pnpm db:migrate` (runs Drizzle migrations in both services)
5. `pnpm db:seed` (seeds 15 models + 500 mock votes)
6. `pnpm dev` (starts all three services concurrently)

## URLs

| app | url |
| --- | --- |
| web | http://localhost:3000 |
| gateway | http://localhost:4000 |
| battle | http://localhost:4001 |

## Module map

- Module 1 → apps/web/components/ui
- Module 2 → apps/web/components/chat + apps/web/app/chat
- Module 3 → apps/web/components/battle + apps/web/app/chat/compare + apps/battle
- Module 4 → apps/web/components/leaderboard + apps/web/app/leaderboard + apps/web/app/models
- Module 5 → apps/web/components/console + apps/web/app/console
- Module 6 → apps/web/app/(auth) + apps/web/lib/auth.ts
- Module 7 → apps/gateway
- Module 8 → apps/battle 
