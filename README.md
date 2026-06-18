# Portfolio Hosting

Full-stack AI portfolio project split into a Next.js frontend and a Python FastAPI backend.

## Structure

```txt
frontend/  Next.js portfolio UI
backend/   FastAPI RAG chatbot backend
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

For Vercel, set the project root directory to `frontend`.

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will own the RAG chatbot flow: guardrails, LiteLLM/Gemini calls, Neo4j vector retrieval, and answer generation.
