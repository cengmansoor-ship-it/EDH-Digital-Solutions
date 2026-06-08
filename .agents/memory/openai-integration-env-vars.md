---
name: OpenAI integration env vars patch
description: AI integration lib templates use AI_INTEGRATIONS_OPENAI_* vars; must patch to OPENAI_API_KEY
---

The `lib/integrations-openai-ai-server/` template files (`src/client.ts`, `src/image/client.ts`, `src/audio/client.ts`) all originally throw at startup if `AI_INTEGRATIONS_OPENAI_BASE_URL` is not set.

**Rule:** After copying the AI integration templates, patch ALL three client files to use `OPENAI_API_KEY` directly (no `baseURL` needed for standard OpenAI API).

**Why:** This project uses a direct `OPENAI_API_KEY` secret, not the Replit AI Integrations proxy (which requires a paid account). The template files assume the proxy setup and crash the API server at boot if not patched.

**How to apply:**
Replace:
```ts
if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) { throw ... }
if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) { throw ... }
export const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY, baseURL: ... });
```
With:
```ts
if (!process.env.OPENAI_API_KEY) { throw new Error("OPENAI_API_KEY must be set.") }
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```
Files to patch: `src/client.ts`, `src/image/client.ts`, `src/audio/client.ts`.
