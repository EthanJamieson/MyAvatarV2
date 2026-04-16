# Welcome to your Lovable project

## Deploy to Vercel

This is a Vite React SPA. A `vercel.json` rewrite is included so client-side routes (for example `/about` or `/blog/...`) resolve correctly on refresh.

### Vercel project settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` (or your preferred package manager equivalent)

### Environment variables (Production and Preview)

Add these in Vercel under **Project Settings -> Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID` (optional for app runtime, but used in local config)

You can copy starter values from `.env.example`.

### Supabase Edge Function secrets

Add these in Supabase under **Project Settings -> Edge Functions -> Secrets**:

- `AI_API_KEY` (required, your own provider API key)
- `AI_BASE_URL` (optional, default `https://api.openai.com/v1/chat/completions`)
- `AI_MODEL` (optional, default `gpt-4o-mini`)
- `SENDGRID_API_KEY` (required for contact emails)
- `PAYSTACK_SECRET_KEY` (required for payments and webhook verification)
