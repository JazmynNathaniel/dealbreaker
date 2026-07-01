# DEALBREAKER

The dating app that knows nothing about love and too much about your screen brightness.

The first visit includes a five-step profile creation interrogation. Profile details and the recommendation sabotage level are saved locally in the browser; use the avatar to edit or restart the process. The feed contains seven fake profiles, and the sabotage control intentionally inverts and degrades their compatibility scores.

Users can upload a profile photo during onboarding. JPEG, PNG, WebP, and GIF files up to 4 MB are magic-byte validated and stored in Neon Postgres under the browser's anonymous visitor ID; local development uses the in-memory adapter.

Messaging is intentionally hostile to free expression. The server offers three rotating canned responses plus GIPHY search; arbitrary text is rejected by the API, and submitted GIPHY IDs are resolved server-side before persistence. Conversations and messages persist in Neon Postgres when `DATABASE_URL` is configured. Without it, the same API uses an in-memory sandbox for local development.

## Run it

Install dependencies and run the Node service:

```powershell
npm install
npm start
```

Then visit `http://localhost:10000`.

## Frontend structure

The browser entry point is `js/main.js`. It composes small ES modules instead of sharing behavior through one application script:

- `state.js` owns the single mutable runtime state object and profile persistence.
- `dom.js` caches stable DOM references.
- `api.js` owns authenticated API requests.
- `feed.js`, `onboarding.js`, and `messaging.js` own their feature behavior and event wiring.
- `overlays.js` owns modals, toasts, and their delegated actions.
- `utils.js` contains side-effect-free shared helpers.

## Test it

```powershell
npm test
```

## Render + Neon

The included `render.yaml` defines a Node Web Service and prompts for an external `DATABASE_URL`. For an existing manually-created service, use:

- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment variable: `DATABASE_URL` set to Neon's pooled connection string
- Environment variable: `GIPHY_API_KEY` set to a GIPHY Web API key

In Neon, open **Connect**, enable **Connection pooling**, and copy the URL containing `-pooler` and `sslmode=require`. Do not commit that URL; add it as a secret in Render and redeploy.
