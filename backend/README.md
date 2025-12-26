# AI Code Reviewer — Backend

Express API that accepts source code + language and returns an AI-generated review (issues, improvements, explanation) using OpenRouter via the OpenAI SDK.

## Requirements

- Node.js (v18+ recommended)
- An OpenRouter API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `backend/.env`:

```env
# Server
PORT=8008

# OpenRouter
AIKEY=your_openrouter_api_key

# Optional: override model
AI_MODEL=kwaipilot/kat-coder-pro:free
```

Notes:

- `AIKEY` is required.
- The repo-level `.gitignore` ignores `.env` files; do not commit your key.

## Run

Development (nodemon):

```bash
npm run dev
```

Production:

```bash
npm start
```

Server logs: `The server is running on Port <PORT>`

## API

Base URL: `http://localhost:<PORT>`

### `POST /request/review`

Request headers:

- `Content-Type: application/json`

Request body:

```json
{
  "code": "console.log('hello')",
  "language": "javascript"
}
```

Response body:

```json
{
  "success": true,
  "output": {
    "issues": "...",
    "improvements": "...",
    "explanation": "..."
  }
}
```

Error responses:

- `400` if `code` or `language` is missing
- `400` if malformed JSON is sent
- `500` if the AI request fails

## Implementation Notes

- Entry point: `src/server.js`
- Route: `src/routes/reviewRoute.js`
- Controller: `src/controllers/reviewController.js`
- AI helper: `src/utils/AICode.js`

The AI helper retries once if the model returns invalid JSON, and falls back to a safe object instead of crashing the whole request.
