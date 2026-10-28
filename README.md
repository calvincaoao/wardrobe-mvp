# Wardrobe MVP

AI personal wardrobe app: turn photos of clothes into a searchable wardrobe and get outfit suggestions for any occasion and weather.

## AI layer (Option C)

- **DeepSeek (`deepseek-chat`)** for text-only assistance (suggest item fields from a description, normalize input, write rationale).
- **Deterministic rule engine** for outfit suggestions (no LLM at suggestion time).
- **No vision model.** Photos are stored as-is; the AI never reads images.

## Stack

| Layer | Tech |
|---|---|
| Client | React + TypeScript + Vite + Tailwind CSS (PWA-ready) |
| Server | Node.js + Express + TypeScript |
| DB / Auth / Storage | Supabase (Postgres) |
| AI | DeepSeek API (OpenAI-compatible) |
| Deploy | Vercel (client) + hosted Node server or Vercel serverless (later) |

## Structure

```
wardrobe-mvp/
├── README.md
├── .env.example            # all env vars documented
├── supabase/
│   └── schema.sql          # full Postgres schema + RLS policies
├── client/                 # Vite + React + TS frontend
└── server/                 # Express API (DeepSeek + rule engine)
```

## Prerequisites

- Node.js 18+
- npm
- A free [Supabase](https://supabase.com) project
- A [DeepSeek API key](https://platform.deepseek.com)

## Setup

### 1. Database (Supabase)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. In **Authentication → Providers**, enable **Email** (password).

### 2. Environment variables

Copy `.env.example` → fill in values (see comments).

- `server/.env` — `DEEPSEEK_API_KEY`, `PORT`
- `client/.env` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### 3. Install & run

```bash
# server (port 3001)
cd server
npm install
npm run dev

# client (port 5173)
cd client
npm install
npm run dev
```

Open http://localhost:5173. Sign up, then the wardrobe screen loads.

## Scripts

| Package | Command | What it does |
|---|---|---|
| client | `npm run dev` | Vite dev server (proxies `/api` → `:3001`) |
| client | `npm run build` | Type-check + production build |
| server | `npm run dev` | Express dev server with reload |
| server | `npm run typecheck` | TypeScript check only |

## Milestones

- [x] **M0** — Scaffold, auth, DB schema, deploy pipeline
- [ ] **M1** — Add item (photo upload + DeepSeek-suggested fields + review/edit)
- [ ] **M2** — Wardrobe browse & filters
- [ ] **M3** — Outfit suggestion (rule engine + weather/occasion input)
- [ ] **M4** — Save / reject / rate suggestions
- [ ] **M5** — PWA install, offline caching, data export + delete-all

## Privacy notes

- Photos stay in your Supabase storage; they are **not** sent to any AI provider.
- Only short text (item descriptions, preferences, occasions) goes to DeepSeek.
- Strip EXIF metadata from photos client-side before upload (planned in M1).
- Data export and delete-all are planned (M5).
