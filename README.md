# Epiderm Web App

AI-powered tele-dermatology frontend (Next.js App Router).

## Stack

- **Next.js 16** (App Router, SSR / SEO)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (design-system tokens — Gold & White)
- **Auth** — backend-issued opaque tokens (httpOnly cookies + 401 refresh interceptor)

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth

Login / signup / refresh proxy to **epiderm-user-service** (`USER_SERVICE_HOST`).
Tokens are opaque httpOnly cookies — the web app does **not** verify JWTs.
When a backend call returns `401`, `apiFetch` / `backendFetch` refresh the session and retry.

| Cookie                   | Purpose                          |
|--------------------------|----------------------------------|
| `epiderm_access_token`   | Opaque access token              |
| `epiderm_refresh_token`  | Opaque refresh token             |
| `epiderm_user`           | Cached user profile for SSR/UI   |

Required env (see `.env.example`):

- `USER_SERVICE_HOST` — e.g. `http://127.0.0.1:8001/`
- `CLINIC_SERVICE_HOST` — e.g. `http://127.0.0.1:8001/`

## Theme

Gold & White semantic tokens live in `src/lib/design/tokens.ts` and `src/app/globals.css`.
Toggle light/dark from the header; preference is stored in `localStorage`.

## Scripts

- `npm run dev` — development server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
