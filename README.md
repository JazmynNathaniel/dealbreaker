# DEALBREAKER

The dating app that knows nothing about love and too much about your screen brightness.

The first visit includes a five-step profile creation interrogation. Profile details and the recommendation sabotage level are saved locally in the browser; use the avatar to edit or restart the process. The feed contains seven fake profiles, and the sabotage control intentionally inverts and degrades their compatibility scores.

Messaging is intentionally hostile to free expression. The server offers three rotating canned responses and three curated GIFs; arbitrary text is rejected by the API. Conversations and messages persist in PostgreSQL when `DATABASE_URL` is configured. Without it, the same API uses an in-memory sandbox for local development.

## Run it

Install dependencies and run the Node service:

```powershell
npm install
npm start
```

Then visit `http://localhost:10000`.

## Test it

```powershell
npm test
```

## Render

The included `render.yaml` defines a Node Web Service and a free Render Postgres database. For an existing manually-created service, use:

- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment variable: `DATABASE_URL` set to the database's internal connection URL

Keep the web service and database in the same Render region.
