# AI Code Reviewer — Frontend

React + Vite UI for submitting code to the backend and viewing the AI review.

## Requirements

- Node.js (v18+ recommended)
- Backend running locally

## Setup

Install dependencies:

```bash
npm install
```

## Run

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

## Configure Backend URL

The frontend currently calls:

- `http://localhost:8008/request/review`

Make sure your backend runs on port `8008` (set `PORT=8008` in `backend/.env`), or update the URL in `src/App.jsx`.

## Features

- Paste code into the left pane
- Select language
- Click **Review Code**
- Errors show via `react-hot-toast`

## Tech

- Vite + React
- Tailwind (via `@tailwindcss/vite`)
- Axios
- `react-hot-toast`
