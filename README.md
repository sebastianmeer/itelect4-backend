# Orbit API

Express/TypeScript API for Orbit. The API owns JWT authentication, MongoDB persistence, public Explore prompts, and owner-scoped Explore responses.

## Local setup

```bash
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

Required values are documented in `.env.example`; do not commit `.env`.

## Verification

```bash
npm run typecheck
npm run build
npm test
```

Response CRUD requires `Authorization: Bearer <token>`. Ownership is derived from the verified JWT and never from request input.
