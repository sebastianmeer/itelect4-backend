# Orbit API

[![CI](https://github.com/sebastianmeer/itelect4-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/sebastianmeer/itelect4-backend/actions/workflows/ci.yml)

Express/TypeScript API for Orbit. The API owns JWT authentication, MongoDB persistence, public Explore prompts, and owner-scoped Explore responses.

The protected `POST /api/ai` route accepts `{ "prompt": string }` with 20–2000
trimmed characters and returns a schema-validated coaching review. The Gemini
key is server-only.

## Local setup

```bash
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

Set `CORS_ORIGIN` to a comma-separated allowlist of frontend origins. Required
variables are listed in `.env.example`.

Required values are documented in `.env.example`; do not commit `.env`.

## Verification

```bash
npm run typecheck
npm run build
npm test
```

## Routes

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/prompts`, `GET /api/prompts/:id`
- Authenticated owner-scoped response CRUD at `/api/responses`
- Authenticated rate-limited `POST /api/ai`

Response CRUD requires `Authorization: Bearer <token>`. Ownership is derived from the verified JWT and never from request input.

## Deployment

Production API: https://orbit-api-weld-tau.vercel.app

The Vercel entrypoint is `api/index.ts`. Set `MONGODB_URI`, `JWT_SECRET`,
`GEMINI_API_KEY`, and `CORS_ORIGIN` in Vercel environment settings. Never put
those values in GitHub, `.env.example`, or frontend `VITE_` variables.

Frontend companion: https://github.com/sebastianmeer/itelect4-project

AI-use disclosure: AI tools assisted with implementation, tests, debugging,
and documentation; the project author reviewed the resulting changes.
