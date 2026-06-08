---
name: EDH Website Setup
description: Key decisions and quirks for the EDH Technology agency website project
---

## Workflow Setup
- Two workflows required: "API Server" (PORT=8080) and "EDH Website" (PORT=8081, BASE_PATH=/)
- API Server command: `PORT=8080 DATABASE_URL=$DATABASE_URL pnpm --filter @workspace/api-server dev`
- Website command: `PORT=8081 BASE_PATH=/ pnpm --filter @workspace/edh-website dev`
- Vite proxies `/api` to `http://localhost:8080` — this is critical for chatbot and all API calls

## OpenAI Integration — Critical Fix
- All three OpenAI integration client files (client.ts, image/client.ts, audio/client.ts) threw at MODULE INIT time when OPENAI_API_KEY was missing — this crashed the API server before handling any request
- Fix: replaced throw-at-init with lazy `getOpenAIClient()` getter that returns null if key missing
- The openai route uses `getOpenAIClient()` and falls back to smart EDH-specific responses when key is null
- **Why:** The original pattern is not suitable for production where key may not always be set

## Database
- Must run `pnpm --filter @workspace/db push` to create tables before API server works
- Services table starts empty — must seed all 10 EDH services via POST /api/services
- The 10 official services are: NOC Support, Custom Software, AI Chatbot, ChatGPT Integration, Big Data Analytics, UI/UX Design, DevOps & Deployment, QA Testing, Digital Marketing, Creative Design

## Email Notifications
- nodemailer installed in api-server; lib/email.ts handles contact form emails to cengmansoor@gmail.com
- Requires GMAIL_USER and GMAIL_APP_PASSWORD env vars (Gmail app password, not regular password)
- Gracefully degrades — if not configured, contact is still saved to DB, just no email notification
- **How to enable:** User sets GMAIL_USER=cengmansoor@gmail.com and GMAIL_APP_PASSWORD=<16-char-app-password>

## Identity — Important
- EDH Technology is a REMOTE FREELANCING AGENCY, NOT a company with physical offices
- All text saying "offices" was changed to "freelancing presence" / "remote freelancing teams"
- Countries: Afghanistan (Kandahar), Egypt (Dakahlia), Indonesia (Remote), Thailand (Bangkok)
