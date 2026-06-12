# AI Feedback Server

Lightweight Node.js server for the AI feedback feature. Uses only the native `http` module – no external dependencies.

## Requirements

- Node.js 18 or newer

## Run

```bash
cd server
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The server listens on port **3000** by default. Override with the `PORT` environment variable:

```bash
PORT=4000 npm start
```

## Endpoints

| Method | Path        | Description                          |
|--------|-------------|--------------------------------------|
| GET    | `/health`   | Liveness check, returns `{ status: "ok" }` |
| POST   | `/feedback` | Returns placeholder feedback (no request body yet) |

### POST /feedback

No request body required for now.

**Response (placeholder):**

```json
{
  "feedback": "Placeholder response – AI API not yet connected."
}
```
