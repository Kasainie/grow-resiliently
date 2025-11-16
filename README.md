# Grow Resiliently — Web UI

Lightweight React + TypeScript frontend for the Grow Resiliently project. The app includes farm/crop analysis UIs, integrations with Supabase (database + auth + functions), and several Supabase Edge Functions for AI-based analysis and recommendations.

Live demo (Vercel): [https://grow-resiliently.vercel.app](https://grow-resiliently.vercel.app)  
[![Live on Vercel](https://img.shields.io/badge/demo-vercel-black?logo=vercel)](https://grow-resiliently.vercel.app)

This README covers local setup, environment variables, dev/build scripts, and notes about the Supabase integration so you can run and develop the project locally.

## Quick start (short)

1. Clone the repo:

```sh
git clone https://github.com/Kasainie/grow-resiliently.git
```

2. Install dependencies and start dev server:

```sh
npm install
npm run dev
```

3. Open the app in your browser at the Vite URL (usually http://localhost:5173).

--

## Requirements

- Node.js 18+ recommended
- npm (comes with Node) or any compatible package manager
- (Optional) nvm to manage Node versions: https://github.com/nvm-sh/nvm

This repository includes a `bun.lockb` but the project uses npm scripts defined in `package.json` and is tested with Node/npm.

## Scripts (from package.json)

- npm run dev        — start Vite dev server
- npm run build      — build for production (vite build)
- npm run build:dev  — build with development mode
- npm run preview    — preview built app locally (vite preview)
- npm run lint       — run ESLint

Use these from the project root.

## Environment variables

Create a file named `.env` (or `.env.local`) in the project root and add the following required variables for Supabase:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

Notes:
- The client expects Vite-style variables prefixed with `VITE_` because they are embedded into the build and accessible via `import.meta.env`.
- For local development you can use values from your Supabase project settings (Project URL and anon/public key). For production use secure secrets and server-side storage for private keys.

## Supabase integration notes

- The Supabase client is created in `src/integrations/supabase/client.ts` and reads the two environment variables above.
- The repository contains a `supabase/` folder with Edge Functions and SQL migrations. See `supabase/functions/` for serverless functions such as crop analysis and AI alerts. Those functions run in Supabase Edge environment and are separate from this frontend. To work with them locally, use the Supabase CLI or the Supabase dashboard.

## Run locally (recommended flow)

1. Ensure `.env` contains the Supabase variables.
2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

4. Open http://localhost:5173 (or the address printed by Vite).

## Build & preview

Build for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Linting

Run ESLint over the project:

```sh
npm run lint
```

## Supabase Edge Functions & Migrations

This repo includes Supabase Edge Functions and SQL migrations under the `supabase/` directory:

- `supabase/functions/analyze-crop` — function that performs crop image analysis (server-side)
- `supabase/functions/generate-ai-alerts` — function to create AI alerts
- `supabase/functions/generate-recommendations` — function for recommendations
- `supabase/migrations` — SQL migration files

To use and test those functions locally, follow Supabase's docs and CLI workflow: https://supabase.com/docs/guides/functions/local-development

## Deployment

- This frontend can be deployed to any static-hosting platform that supports Vite-built assets (Netlify, Vercel, Cloudflare Pages, etc.).
- Supabase functions should be deployed from the `supabase/functions/` folder using the Supabase CLI or through the Supabase dashboard.
- This frontend can be deployed to any static-hosting platform that supports Vite-built assets (Netlify, Vercel, Cloudflare Pages, etc.).
- Live demo (Vercel): [https://grow-resiliently.vercel.app](https://grow-resiliently.vercel.app) — replace with your actual Vercel URL if different.
- Supabase functions should be deployed from the `supabase/functions/` folder using the Supabase CLI or through the Supabase dashboard.
- Optionally: follow your hosting provider's or platform's deployment docs to publish the frontend (for example, Vercel, Netlify, Cloudflare Pages, etc.).

## Project structure (high level)

- `src/` — React source code
	- `components/` — UI components and pages
	- `integrations/supabase/` — Supabase client and types
	- `pages/` — route pages (Dashboard, API, Farm flows, etc.)
- `supabase/` — functions, migrations, and Supabase config

## Troubleshooting

- If you see errors about missing environment variables, confirm your `.env` is present and Vite has been restarted after changes.
- If Supabase requests fail, confirm the URL and publishable key are correct and that your Supabase project's CORS or allowed origins permit your local dev origin.

## Contributing

- Clone, run, create a branch, and open a PR with your changes.
- Follow existing code style and run `npm run lint` before creating a PR.

## Additional links & resources

- Supabase docs: https://supabase.com/docs
- Vite docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com

---

If you want, I can also:

- Add a sample `.env.example` file with variable names
- Add a short developer checklist or PR template
- Add a quick CONTRIBUTING.md

Tell me which of those you'd like and I'll add them.
