# EDH Technology Website

A professional animated marketing website for EDH Technology — a multi-national software consultancy with offices in Afghanistan, Egypt, Indonesia, and Thailand.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied to /api)
- `pnpm --filter @workspace/edh-website run dev` — run the React frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `OPENAI_API_KEY` — OpenAI key for the SSE chatbot
- Required env: `SESSION_SECRET` — Express session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite, Tailwind CSS v4, Framer Motion, Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Chatbot: OpenAI GPT-4o-mini via SSE streaming

## Where things live

- `artifacts/edh-website/` — React frontend (routes: /, /projects, /services, /contact, /admin)
- `artifacts/api-server/` — Express API backend
- `lib/db/src/schema/` — DB schema (projects, services, contacts, conversations, messages)
- `lib/api-client-react/src/generated/` — Orval-generated hooks
- `artifacts/api-server/src/routes/` — API route handlers
- `attached_assets/` — EDH logo PNG

## Architecture decisions

- Dark navy + cyan brand theme set as default (no dark-mode toggle needed)
- OpenAI streaming uses SSE (`text/event-stream`) — chatbot in bottom-right corner
- Admin portal is client-side password protected (`edh-admin-2024`), no server auth
- react-icons v5 dropped `SiLinkedin` — use lucide-react `Linkedin`, `Github`, `Twitter`, `Facebook` instead
- Social icon references: always use lucide-react, NOT react-icons/si for LinkedIn/Twitter

## Product

- **Home** — animated hero "Let's Build Your Digital Solution", services preview, featured projects, 4-office global presence map, inline contact form, CTA banner
- **Projects** — filterable portfolio grid with search and category tabs, live deploy links
- **Services** — 8 service cards (Web, Mobile, AI, Cloud, Design, QA, Digital Transformation, API), Plan•Build•Test•Launch process section
- **Contact** — full contact form, office locations, social links
- **Admin** — password-protected portal to manage projects, services, view contact submissions, save social links
- **Chatbot** — floating SSE-streaming AI assistant (bottom-right), powered by GPT-4o-mini

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- react-icons v5 (`^5.4.0`) does NOT export `SiLinkedin` — use lucide-react `Linkedin` instead
- `lib/integrations-openai-ai-server/src/audio/client.ts` and `image/client.ts` originally used `AI_INTEGRATIONS_OPENAI_*` env vars — both have been updated to use `OPENAI_API_KEY` directly
- DB seeding happens in `artifacts/api-server/src/seed.ts` — run manually if needed
- Admin password is hardcoded client-side: `edh-admin-2024`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
