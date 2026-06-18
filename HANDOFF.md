# Portfolio RAG Chatbot Handoff

This document summarizes the current state of the `siva-portfolio` project and the work completed so another AI assistant or developer can continue from here.

## Project Goal

Build and deploy a full-stack AI portfolio with:

- `frontend/`: Next.js portfolio website hosted on Vercel.
- `backend/`: FastAPI RAG chatbot backend hosted on Hugging Face Spaces.
- Neo4j AuraDB as the external vector database.
- Gemini models accessed through LiteLLM for embeddings and chat generation.

## Current Architecture

```txt
Browser
  -> Vercel frontend
  -> Hugging Face FastAPI backend
  -> LiteLLM
  -> Gemini embeddings/chat
  -> Neo4j AuraDB vector search
```

Local development architecture:

```txt
frontend dev server: http://localhost:3000
backend API: http://127.0.0.1:8000
Neo4j AuraDB: remote cloud DB
```

## Repository Structure

```txt
siva-portfolio/
  frontend/
    app/
    components/
    package.json
    .env.example

  backend/
    app/
      main.py
      config.py
      models.py
      routes/
        chat.py
        health.py
      rag/
        chunking.py
        guardrails.py
        llm.py
        neo4j_client.py
        prompts.py
        retrieval.py
    content/
      profile.md
      experience.md
      projects.md
      skills.md
      education.md
      contact.md
    scripts/
      ingest.py
    Dockerfile
    README.md
    requirements.txt
    .env.example

  HANDOFF.md
  README.md
```

## Completed Work

### 1. Repo Restructure

The original Next.js app was moved into:

```txt
frontend/
```

A Python FastAPI backend was added under:

```txt
backend/
```

The root `.gitignore` was updated for nested Node/Python artifacts and to ignore the local Hugging Face clone:

```txt
backend/portfolio-rag-api/
```

### 2. Frontend Changes

File:

```txt
frontend/components/Playground.tsx
```

The chatbot UI was changed from mock responses to a real API call:

```ts
fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat`, ...)
```

Fallback local backend URL:

```txt
http://127.0.0.1:8000
```

Frontend env example:

```txt
frontend/.env.example
```

contains:

```env
NEXT_PUBLIC_CHAT_API_URL=http://127.0.0.1:8000
```

Removed old mock answers from:

```txt
frontend/app/data/portfolio.tsx
```

Frontend validation passed:

```bash
cd frontend
npm run lint
npm run build
```

### 3. Backend FastAPI Scaffold

Main app:

```txt
backend/app/main.py
```

Routes:

```txt
GET /health
POST /chat
```

Health route returns:

```json
{"status":"ok"}
```

### 4. Gemini Through LiteLLM

Model helper:

```txt
backend/app/rag/llm.py
```

Functions:

```py
embed_text(text: str) -> list[float]
generate_answer(messages: list[dict[str, str]]) -> str
```

The backend uses these env vars:

```env
GEMINI_API_KEY=
LITELLM_EMBEDDING_MODEL=gemini/gemini-embedding-001
LITELLM_CHAT_MODEL=gemini/gemini-2.5-flash
```

### 5. Neo4j AuraDB Integration

Neo4j helper:

```txt
backend/app/rag/neo4j_client.py
```

Vector index name:

```txt
portfolio_chunk_embedding
```

Node label:

```txt
DocumentChunk
```

Required Neo4j env vars:

```env
NEO4J_URI=
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=
```

### 6. Knowledge Base Content

Content files generated from resume and GitHub profile:

```txt
backend/content/profile.md
backend/content/experience.md
backend/content/projects.md
backend/content/skills.md
backend/content/education.md
backend/content/contact.md
```

Included public contact details:

```txt
Email: pabbisettyssivakumar@gmail.com
Phone: +91-7702999095
Alternate phone: +91-8971197666
LinkedIn: https://linkedin.com/in/sivakumar644
GitHub: https://github.com/PabbisettySivaKumar
```

### 7. Ingestion Script

File:

```txt
backend/scripts/ingest.py
```

What it does:

- Reads `backend/content/*.md`
- Skips `README.md`
- Chunks markdown text
- Embeds chunks using LiteLLM/Gemini
- Drops and recreates Neo4j vector index
- Deletes old `DocumentChunk` nodes
- Writes new chunk nodes into Neo4j

Run locally:

```bash
cd backend
source venv/bin/activate
python scripts/ingest.py
```

The user confirmed nodes were created successfully in Neo4j AuraDB.

### 8. Real Chat Endpoint

File:

```txt
backend/app/routes/chat.py
```

Flow:

```txt
receive question
  -> guardrail check
  -> embed question
  -> vector search Neo4j
  -> apply RAG_MIN_SCORE
  -> build context prompt
  -> generate Gemini answer through LiteLLM
  -> return answer + sources
```

Response shape:

```json
{
  "answer": "...",
  "sources": [
    {
      "title": "...",
      "snippet": "..."
    }
  ]
}
```

Guardrail file:

```txt
backend/app/rag/guardrails.py
```

The chatbot should only answer questions about Siva's profile, projects, skills, education, contact, experience, and availability.

### 9. Hugging Face Space Deployment Files

Backend Dockerfile:

```txt
backend/Dockerfile
```

Correct content:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY content ./content
COPY scripts ./scripts

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

Backend Hugging Face README:

```txt
backend/README.md
```

Important metadata:

```yaml
---
title: Siva Portfolio RAG API
emoji: 🤖
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---
```

Note: Hugging Face rejected `colorFrom: amber`; `yellow` is valid.

## Local Backend Setup

The user has a virtualenv named:

```txt
backend/venv
```

Install dependencies:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Test:

```bash
curl http://127.0.0.1:8000/health
```

Expected:

```json
{"status":"ok"}
```

Test chat:

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What experience does Siva have with LangChain?","history":[]}'
```

## Local Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Local frontend env:

```env
NEXT_PUBLIC_CHAT_API_URL=http://127.0.0.1:8000
```

## Production Env Vars

### Hugging Face Space Backend

Add these as secrets:

```env
GEMINI_API_KEY=
NEO4J_URI=
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=
```

Add these as variables or secrets:

```env
LITELLM_EMBEDDING_MODEL=gemini/gemini-embedding-001
LITELLM_CHAT_MODEL=gemini/gemini-2.5-flash
RAG_TOP_K=5
RAG_MIN_SCORE=0.72
FRONTEND_ORIGIN=https://your-vercel-domain.vercel.app
```

During local testing, `FRONTEND_ORIGIN` can be:

```env
FRONTEND_ORIGIN=http://localhost:3000
```

### Vercel Frontend

Set only:

```env
NEXT_PUBLIC_CHAT_API_URL=https://psk95-portfolio-rag-api.hf.space
```

Do not put Gemini or Neo4j secrets in Vercel frontend env vars.

## Hugging Face Space Status

Space repo cloned locally at:

```txt
backend/portfolio-rag-api
```

Remote:

```txt
https://huggingface.co/spaces/psk95/portfolio-rag-api
```

Space URL should be:

```txt
https://psk95-portfolio-rag-api.hf.space
```

The user pushed once, but the build failed because the Space Dockerfile had `requirements.txt` lines inside the Dockerfile:

```txt
fastapi
uvicorn[standard]
neo4j
...
```

That has been fixed locally in both:

```txt
backend/Dockerfile
backend/portfolio-rag-api/Dockerfile
```

Need to push the fixed Space repo again.

## Important Security Note

The user pasted a Hugging Face token in terminal/chat. The token must be revoked/rotated:

```txt
https://huggingface.co/settings/tokens
```

Create a new token with write access, then push with:

```bash
cd backend/portfolio-rag-api
git push --force-with-lease https://psk95:NEW_HF_TOKEN@huggingface.co/spaces/psk95/portfolio-rag-api main
```

Do not store the token in `origin`.

Current clean remote should remain:

```bash
git remote set-url origin https://huggingface.co/spaces/psk95/portfolio-rag-api
```

## Next Steps

1. Rotate/revoke the exposed Hugging Face token.
2. Push the fixed Hugging Face Space repo with a new token.
3. Add Hugging Face Space secrets and variables.
4. Wait for Space build.
5. Test:

```bash
curl https://psk95-portfolio-rag-api.hf.space/health
```

6. Test chat:

```bash
curl -X POST https://psk95-portfolio-rag-api.hf.space/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What projects has Siva built?","history":[]}'
```

7. In Vercel frontend, set:

```env
NEXT_PUBLIC_CHAT_API_URL=https://psk95-portfolio-rag-api.hf.space
```

8. Set Hugging Face backend `FRONTEND_ORIGIN` to the final Vercel URL.
9. Redeploy both if needed.
10. Commit and push the main GitHub repo changes.

## Validation Already Done

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend syntax:

```bash
python3 -m compileall backend/app backend/scripts
```

Patch checks:

```bash
git diff --cached --check
```

## Files To Watch

Main backend files:

```txt
backend/app/routes/chat.py
backend/app/rag/retrieval.py
backend/app/rag/llm.py
backend/scripts/ingest.py
backend/Dockerfile
backend/README.md
```

Main frontend files:

```txt
frontend/components/Playground.tsx
frontend/.env.example
```

Main content files:

```txt
backend/content/*.md
```
