# AI Code Reviewer

Full-stack AI code review app:

- **Backend:** Express API that calls OpenRouter (via the OpenAI SDK) and returns a structured review.
- **Frontend:** React + Vite UI with a split editor/response layout and toast errors.

## Repo Structure

- `backend/` — Express server + AI integration
- `frontend/ai-code-review-frontend/` — React (Vite) app

For more details:

- Backend docs: `backend/README.md`
- Frontend docs: `frontend/ai-code-review-frontend/README.md`

## Quick Start (Local)

### 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8008
AIKEY=your_openrouter_api_key
# optional
AI_MODEL=kwaipilot/kat-coder-pro:free
```

Run:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend/ai-code-review-frontend
npm install
npm run dev
```

The frontend calls:

- `http://localhost:8008/request/review`

So keep the backend running on port **8008** (or update the URL in `frontend/ai-code-review-frontend/src/App.jsx`).

## API

### `POST /request/review`

`http://localhost:8008/request/review`

Body:

```json
{
  "code": "console.log('hello')",
  "language": "javascript"
}
```

## Security

- Do **not** commit `.env` files or API keys.
- The repo-level `.gitignore` is configured to ignore `.env`.
