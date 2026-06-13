# AI Feedback Server

Lightweight Node.js server for the AI feedback feature. Uses only the native `http` module – no external dependencies.

**Server and testing the api can just be runned locally, because the server should not be hosted.**

## Requirements

- Node.js 18 or newer
- A file located int the root folder (team-04) named ".env" for storing api key as envrironment variable
- The file needs the API Key as env variable. Paste this entry **GEMINI_API_KEY='your_api_key'**

## Run

```bash
cd team-04
node --env-file=.env server/server.js
```

## Testing

**Server must be started before testing to run in the background in its own terminal. After that exectute the testing commands in a second terminal.**

To run the API Test run:

```bash
cd team-04
node app/tests/api-test.js
```


## Endpoints

| Method | Path        | Description                          |
|--------|-------------|--------------------------------------|
| GET    | `/health`   | Liveness check, returns `{ status: "ok" }` |
| POST   | `/feedback` | Returns placeholder feedback |

### POST /feedback

**Response:**

```json
{
  "feedback": "Placeholder response"
}
```
