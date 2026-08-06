# Portfolio RAG Chatbot Handoff

This document summarizes the current state of the portfolio project so another AI
assistant or developer can continue from here. It reflects the **actual on-disk
layout** as of the latest update.

## Update (2026-08-05) — read this first

The backend has advanced significantly since the bulk of this doc was written.
**`portfolio-rag-api/HANDOFF.md` is now the authoritative reference for the
backend** — this file is kept for the frontend + overall topology. Key changes:

- **Guardrail** is no longer a bare keyword allowlist — it's a keyword fast-path
  plus an LLM scope classifier (natural questions like "who are you?" work).
- **Chunking** is section-aware (structural markdown), not fixed-width.
- **Prompts** are managed in Langfuse (with local fallbacks); seed via
  `scripts/seed_langfuse_prompts.py`.
- **`/chat` is rate-limited** to 20 req/min per IP (`app/rate_limit.py`).
- **CORS cannot be enforced on HF Spaces** — the platform proxy injects
  permissive CORS that overrides `FRONTEND_ORIGIN`. Rate limiting is the actual
  abuse control. (See the CORS note under Backend below.)
- **New admin endpoints** (token-guarded): `POST /admin/ingest?force=true`
  (force re-embed) and `GET /admin/config` (inspect effective config).
- **Neo4j pool hardened** against Aura idle resets (liveness + lifetime).
- **`RAG_MIN_SCORE` tuned to 0.80** (data-driven via `evals/run_eval.py --sweep`).
- **Eval harness** added under `evals/` — local gate, in-process Langfuse dataset
  run, and a black-box run against the deployed Space.
- Model defaults: chat `gemini/gemini-3.1-flash-lite`, fallback
  `gemini/gemini-2.5-flash` (the older listing below had these reversed).
- The backend git remote no longer embeds a token (the security item below is
  resolved).

## Project Goal

Build and deploy a full-stack AI portfolio with:

- Next.js portfolio website hosted on Vercel.
- FastAPI RAG chatbot backend hosted on Hugging Face Spaces.
- Neo4j AuraDB as the external vector database.
- Gemini models accessed through LiteLLM for embeddings and chat generation.

## Current Architecture

```txt
Browser
  -> Vercel frontend (Next.js)
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

> Important: this is **not** a monorepo. The frontend and backend live in two
> sibling folders under `port/`, each with its own independent git history and
> remote. There is no top-level git repo in `port/`.

```txt
port/                              (plain folder, NOT a git repo)
  siva-portfolio/                  (frontend git repo -> GitHub -> Vercel)
    app/
      data/portfolio.tsx
      globals.css
      layout.tsx
      page.tsx
    components/
      Contact.tsx
      Experience.tsx
      Header.tsx
      Hero.tsx
      Playground.tsx
      Projects.tsx
      Skills.tsx
      icons/
    public/
    .github/workflows/keep-neo4j-active.yml
    .env.example
    .env.local                    (gitignored)
    HANDOFF.md                     (this file)
    README.md
    package.json
    next.config.ts

  portfolio-rag-api/              (backend git repo == the Hugging Face Space)
    app/
      main.py
      config.py
      models.py
      rate_limit.py          (per-IP limiter + X-Forwarded-For client IP helper)
      routes/
        chat.py
        health.py
        feedback.py
        admin.py             (/admin/ingest, /admin/config; token-guarded)
      rag/
        cache.py
        chunking.py
        guardrails.py
        ingest.py            (content -> Neo4j sync; run on startup + via CLI)
        llm.py
        neo4j_client.py
        observability.py
        prompts.py
        retrieval.py
    evals/                   (dataset.json + run_eval.py, langfuse_dataset.py, run_eval_http.py)
    content/
      profile.md
      experience.md
      projects.md
      skills.md
      education.md
      contact.md
      README.md
    scripts/
      ingest.py
      seed_langfuse_prompts.py     (push prompt defaults to Langfuse)
    venv/                          (local virtualenv, gitignored)
    Dockerfile
    HANDOFF.md                     (authoritative backend reference)
    README.md                      (Hugging Face Space metadata + description)
    requirements.txt
    .env                           (gitignored)
    .env.example
```

### Git remotes

```txt
siva-portfolio    origin -> https://github.com/PabbisettySivaKumar/portfolio_hosting.git
portfolio-rag-api origin -> https://huggingface.co/spaces/psk95/portfolio-rag-api
```

Note: the `portfolio-rag-api` folder **is** the Hugging Face Space clone. Earlier
handoff notes referred to a nested `backend/portfolio-rag-api` clone; that no
longer exists — the backend and the Space repo are now the same directory.

## Completed Work

### 1. Frontend (siva-portfolio)

The Next.js app is a single-page portfolio (`app/page.tsx`) composed of section
components: `Header`, `Hero`, `Playground`, `Projects`, `Skills`, `Experience`,
`Contact`. Static content lives in `app/data/portfolio.tsx`.

`AGENTS.md` warns that this Next.js version (16.x) has breaking changes vs. older
knowledge — check `node_modules/next/dist/docs/` before writing Next code.

Key file:

```txt
siva-portfolio/components/Playground.tsx
```

The chatbot UI calls the real backend and consumes a **streaming NDJSON**
response:

```ts
fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat`, ...)
```

Fallback local backend URL when the env var is unset:

```txt
http://127.0.0.1:8000
```

The client reads the response body as a stream, splits on newlines, and parses
per-line events (see the Chat Endpoint section for the event shape). It supports
stop/abort via `AbortController`, renders Markdown, and shows collapsible
retrieved-source cards. Old mock answers were removed from
`app/data/portfolio.tsx`.

Frontend env example (`siva-portfolio/.env.example`):

```env
NEXT_PUBLIC_CHAT_API_URL=http://127.0.0.1:8000
```

Frontend validation:

```bash
cd siva-portfolio
npm run lint
npm run build
```

### 2. Backend FastAPI app (portfolio-rag-api)

Main app:

```txt
portfolio-rag-api/app/main.py
```

CORS is configured from `FRONTEND_ORIGIN` (single value or comma-separated
list), **but note: on Hugging Face Spaces the platform's edge proxy injects its
own permissive CORS headers that override the app config** — so the origin
allowlist is not actually enforced in production. This is a platform limitation,
not a bug; the config is correct and would apply on a host that owns the edge.
Abuse is instead capped by per-IP rate limiting on `/chat`. The Neo4j driver is
closed on shutdown via the lifespan handler.

Routes:

```txt
GET  /              -> service status
GET  /health        -> {"status": "ok"}
POST /health/neo4j  -> token-authed, rate-limited Neo4j keepalive
POST /chat          -> streaming RAG chat (NDJSON), rate-limited 20/min per IP
POST /feedback      -> record a thumbs up/down Langfuse score for a trace
POST /admin/ingest  -> token-authed content re-ingest (?force=true re-embeds all)
GET  /admin/config  -> token-authed; returns non-sensitive effective config
```

### 3. Gemini through LiteLLM

Model helper:

```txt
portfolio-rag-api/app/rag/llm.py
```

Functions:

```py
embed_text(text: str) -> list[float]
generate_answer(messages) -> str                # used for question condensing
generate_answer_stream(messages) -> async gen   # used for streaming answers
```

Both generation helpers fall back to a secondary model if the primary fails.
Relevant env vars (see `app/config.py` for defaults):

```env
GEMINI_API_KEY=
LITELLM_EMBEDDING_MODEL=gemini/gemini-embedding-001
LITELLM_CHAT_MODEL=gemini/gemini-3.1-flash-lite     # primary
LITELLM_FALLBACK_MODEL=gemini/gemini-2.5-flash      # fallback
```

### 4. Neo4j AuraDB integration

Neo4j helper:

```txt
portfolio-rag-api/app/rag/neo4j_client.py
```

Uses an async driver with a lazy singleton. Vector index name:

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

Retrieval (`app/rag/retrieval.py`) runs a vector search, returns the top
`RAG_TOP_K` chunks, and filters out anything below `RAG_MIN_SCORE`.

### 5. Knowledge base content

Content files generated from resume and GitHub profile:

```txt
portfolio-rag-api/content/profile.md
portfolio-rag-api/content/experience.md
portfolio-rag-api/content/projects.md
portfolio-rag-api/content/skills.md
portfolio-rag-api/content/education.md
portfolio-rag-api/content/contact.md
```

Included public contact details:

```txt
Email: pabbisettyssivakumar@gmail.com
Phone: +91-7702999095
Alternate phone: +91-8971197666
LinkedIn: https://linkedin.com/in/sivakumar644
GitHub: https://github.com/PabbisettySivaKumar
```

### 6. Ingestion (auto on startup + manual CLI)

Files:

```txt
portfolio-rag-api/app/rag/ingest.py    # core logic (driver-safe, importable)
portfolio-rag-api/scripts/ingest.py    # thin CLI wrapper around the core
```

The core lives in `app/rag/ingest.py` as `ingest_content()` so it can run both
from the CLI and from inside the running app. `scripts/ingest.py` is just a CLI
wrapper that calls it and then closes the driver.

What `ingest_content()` does:

- Reads `portfolio-rag-api/content/*.md` (skips `README.md`)
- Chunks markdown text (`app/rag/chunking.py`)
- **Incremental / hash-based**: hashes each file and compares against the
  `file_hash` stored on `DocumentChunk` nodes in Neo4j:
  - new file → embed + insert
  - modified file (hash changed) → delete its old chunks + re-embed
  - deleted file → remove its chunks
  - unchanged → **skipped** (a single Neo4j read, no embedding calls)
- Ensures the vector index exists (`CREATE VECTOR INDEX ... IF NOT EXISTS`)
- Writes new `DocumentChunk` nodes (with `file_hash` + `ingested_at`)
- Uses the shared app Neo4j driver and **never closes it** (safe in-app)

**Auto-ingest on startup:** `app/main.py`'s lifespan fires `ingest_content()`
as a **background task** (`asyncio.create_task`) so uvicorn starts serving
immediately, then syncs content → Neo4j a moment later. Any failure is
**logged and swallowed** (`_startup_ingest`) — ingestion never crashes the app.
Because it's hash-based, cold starts with no content change cost ~nothing.

So the normal flow is now: **edit `content/*.md` → push → Space rebuilds →
auto-syncs on boot.** No manual step required.

Caveat: this is safe on the **single-replica free Space**. If the Space is ever
scaled to >1 replica, concurrent boots could race on the delete/create — revisit
then (e.g. a lock or move ingestion to a one-shot job).

Manual run (still available, e.g. to sync from your laptop without a redeploy):

```bash
cd portfolio-rag-api
source venv/bin/activate
python scripts/ingest.py
```

The user confirmed nodes were created successfully in Neo4j AuraDB.

### 7. Chat endpoint (streaming RAG)

File:

```txt
portfolio-rag-api/app/routes/chat.py
```

Flow:

```txt
receive {message, history}
  -> rate-limit per client IP (429 before any LLM work; app/rate_limit.py)
  -> condense question using history (falls back to raw question on failure)
  -> check in-memory query cache on the normalized condensed question
  -> guardrail check on the condensed question (app/rag/guardrails.py)
  -> embed condensed question
  -> vector search Neo4j (top_k, filtered by RAG_MIN_SCORE)
  -> stream sources, then answer tokens generated by Gemini via LiteLLM
  -> cache the completed answer + sources
```

(History is capped to the most recent turns before condensing/answering.)

The response is a streamed **NDJSON** body (`application/x-ndjson`), one JSON
object per line. Event types:

```json
{"type": "trace",   "trace_id": "..."}
{"type": "sources", "sources": [{"title": "...", "snippet": "..."}]}
{"type": "token",   "content": "..."}
{"type": "error",   "content": "..."}
```

The `trace` event is emitted first (only when Langfuse is enabled) so the client
can reference the trace id when submitting feedback.

The frontend also still tolerates a legacy non-streaming
`{"answer": "...", "sources": [...]}` shape for backward compatibility.

Guardrails (`app/rag/guardrails.py`) keep the bot on-topic (Siva's profile,
projects, skills, education, contact, experience, availability). A keyword
fast-path accepts obvious matches immediately; anything else is sent to an LLM
scope classifier (fails open), so natural phrasings like "who are you?" are
handled instead of being wrongly rejected.

### 8. Neo4j keepalive (anti-cold-start)

To keep the free-tier AuraDB from pausing, there is:

- A token-authed, rate-limited `POST /health/neo4j` endpoint
  (`portfolio-rag-api/app/routes/health.py`) that runs `RETURN 1`.
- A scheduled GitHub Action in the **frontend** repo that pings it:

```txt
siva-portfolio/.github/workflows/keep-neo4j-active.yml
```

This requires the `KEEPALIVE_TOKEN` env var on the backend (must be >= 32 chars,
enforced in `app/config.py`) and a matching secret for the workflow.

> [!NOTE]
> **Troubleshooting 401 Unauthorized errors:**
> If the keepalive GitHub Actions workflow fails with a `401` error, it means the `NEO4J_KEEPALIVE_TOKEN` secret in the frontend repository settings does not match the `KEEPALIVE_TOKEN` environment variable on the Hugging Face Space backend. Both must match exactly (e.g. `aGZt4lRbKeMyfA6dQ7forI1QfDVS81Aw6kdDtpVK6UnRtiLKtLxMASCTv1qKqipE`). Note that the backend expects a `Bearer` token format, which the GitHub Action's curl command handles automatically by prepending `Bearer ` before the token.

### 9. Observability (Langfuse)

LLM tracing is provided by **Langfuse Cloud** (not self-hosted). All wiring lives
in:

```txt
portfolio-rag-api/app/rag/observability.py
```

Two integration levels run together:

- **Level A - LiteLLM callback:** every LiteLLM completion/embedding call is
  reported to Langfuse automatically (model, tokens, cost, latency, errors).
  Registered by appending `"langfuse"` to `litellm.success_callback` /
  `litellm.failure_callback`.
- **Level B - manual pipeline tracing:** each `/chat` request is grouped into a
  single Langfuse trace with child spans:
  `cache_lookup -> condense_question -> guardrail -> embed -> neo4j_retrieval ->
  generate`. The `neo4j_retrieval` span records chunk count, titles, scores, and
  the active `top_k` / `min_score`. The Level A generations nest under this trace
  because `app/rag/llm.py` forwards a LiteLLM `metadata` payload
  (`existing_trace_id`, `generation_name`, `session_id`) built by
  `observability.llm_metadata(...)`.

Lifecycle (`app/main.py` lifespan):

- Startup: `init_langfuse()` — sets callbacks + builds the SDK client.
- Shutdown: `flush_langfuse()` — flushes buffered events so nothing is lost.

**Enable / disable:** everything is a no-op unless `LANGFUSE_ENABLED=true` **and**
both keys are set. With no keys or the flag off, the app runs unchanged.

**PII masking:** traces would otherwise contain Siva's email/phone (from the
contact content) and visitor questions. Redaction is on by default when Langfuse
is enabled:

- Level B: the Langfuse client is built with `mask=mask_pii`, which recursively
  redacts emails -> `[redacted-email]` and phone numbers -> `[redacted-phone]`
  from all trace/span inputs and outputs.
- Level A: LiteLLM builds its own Langfuse client that the mask can't reach, so
  `litellm.turn_off_message_logging = True` redacts message content on that path
  (token/cost/latency are still captured). Trade-off: raw prompt/answer text is
  not visible on the generation view; the masked Level B spans cover content.

The regex-based masker deliberately does **not** flag `2018 - 2020` (dates),
`7.0` (GPA), or GitHub URLs. It only knows email + `+country-code`/10+ digit
phone patterns — extend `_EMAIL_RE` / `_PHONE_RE` in `observability.py` for more.

**Config** (`app/config.py`, all optional): `LANGFUSE_ENABLED`,
`LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, and the host, which accepts either
`LANGFUSE_HOST` or `LANGFUSE_BASE_URL` (default `https://cloud.langfuse.com`; use
`https://us.cloud.langfuse.com` for the US region). `Settings` uses
`extra = "ignore"` so unknown `.env` keys no longer crash startup.

Dependency: `langfuse>=2.53.0,<3.0.0` in `requirements.txt` (the code targets the
Langfuse **v2** SDK API — `client.trace()/.span()/.update()`; the v2->v3 SDK
change is breaking, so keep the pin unless you also update `observability.py`).

`app/models.py` gained an optional `session_id` on `ChatRequest` for grouping
multi-turn conversations in Langfuse. The frontend (`Playground.tsx`) generates a
per-tab id (`crypto.randomUUID()`, persisted in `sessionStorage` under
`chat_session_id`) and sends it on every `/chat` request.

**User feedback / scoring:**

- `POST /feedback` (`app/routes/feedback.py`) accepts
  `{ "trace_id": "...", "value": "up" | "down", "comment": "..."? }` and records a
  `user-feedback` Langfuse score on that trace (up -> 1.0, down -> 0.0) via
  `observability.score_feedback(...)`. It returns 503 when Langfuse is disabled,
  is IP rate-limited (20/min, reuses the health limiter), and 502 if the score
  call fails.
- The `/chat` stream emits a `trace` event up front carrying the `trace_id`
  (only when Langfuse is enabled). `Playground.tsx` stores it on the assistant
  message and renders thumbs up/down buttons; clicking `POST`s to `/feedback`.
  When Langfuse is off there is no `trace_id`, so the buttons never render.

### 10. Hugging Face Space deployment files

Backend Dockerfile (`portfolio-rag-api/Dockerfile`) — installs
`requirements.txt`, copies `app`, `content`, `scripts`, exposes `7860`, runs
uvicorn. The earlier build failure (requirements listed inside the Dockerfile)
has been fixed.

Hugging Face Space metadata lives in `portfolio-rag-api/README.md`:

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

Virtualenv lives at `portfolio-rag-api/venv`.

```bash
cd portfolio-rag-api
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in secrets
uvicorn app.main:app --reload
```

Test:

```bash
curl http://127.0.0.1:8000/health
# {"status":"ok"}

curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What experience does Siva have with LangChain?","history":[]}'
# streams NDJSON lines
```

## Local Frontend Setup

```bash
cd siva-portfolio
cp .env.example .env.local
npm install
npm run dev
```

Local frontend env (`.env.local`):

```env
NEXT_PUBLIC_CHAT_API_URL=http://127.0.0.1:8000
```

## Production Env Vars

### Hugging Face Space backend

Add as secrets:

```env
GEMINI_API_KEY=
NEO4J_URI=
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=
KEEPALIVE_TOKEN=            # >= 32 chars; must match the GitHub Action secret
LANGFUSE_PUBLIC_KEY=        # from your Langfuse Cloud project
LANGFUSE_SECRET_KEY=        # from your Langfuse Cloud project
```

Add as variables or secrets:

Tuning knobs have safe code defaults in `app/config.py` — prefer leaving them
unset in the Space so code stays the single source of truth:

```env
LITELLM_EMBEDDING_MODEL=gemini/gemini-embedding-001
LITELLM_CHAT_MODEL=gemini/gemini-3.1-flash-lite      # primary (code default)
LITELLM_FALLBACK_MODEL=gemini/gemini-2.5-flash       # fallback (code default)
RAG_TOP_K=10                # code default
RAG_MIN_SCORE=0.80          # code default (tuned via evals --sweep)
FRONTEND_ORIGIN=https://sivakumar.dev,https://www.sivakumar.dev
LANGFUSE_ENABLED=true       # false (or unset) disables all tracing
LANGFUSE_HOST=https://cloud.langfuse.com   # or https://us.cloud.langfuse.com
```

Notes:
- `FRONTEND_ORIGIN` accepts a comma-separated list. Both the apex and `www`
  serve the site (`pabbisettysivakumar.in` 301-redirects to `www`). **But** see
  the CORS caveat above — HF Spaces overrides this, so it's not enforced in prod.
- Env-var changes on the Space require a **Factory reboot** to take effect (a
  plain restart doesn't reliably re-inject them). Verify with `GET /admin/config`.
- During local testing, `FRONTEND_ORIGIN` can be `http://localhost:3000`.

### Vercel frontend

Set the following in Vercel:

```env
NEXT_PUBLIC_CHAT_API_URL=https://psk95-portfolio-rag-api.hf.space
RESEND_API_KEY=re_...         # from https://resend.com — get a free API key
NOTIFY_EMAIL=pabbisettyssivakumar@gmail.com  # where notifications go
```

Do not put Gemini or Neo4j secrets in the Vercel frontend env vars.

### GitHub Actions (keep-neo4j-active)

The keepalive workflow needs a secret matching the backend `KEEPALIVE_TOKEN`.

## Hugging Face Space Status

Space repo: `portfolio-rag-api/` (this directory).

Remote:

```txt
https://huggingface.co/spaces/psk95/portfolio-rag-api
```

Space URL:

```txt
https://psk95-portfolio-rag-api.hf.space
```

The Dockerfile build issue has been fixed. Push updates with:

```bash
cd portfolio-rag-api
git push origin main
```

## SECURITY: exposed Hugging Face token (RESOLVED)

The `portfolio-rag-api` git `origin` no longer embeds a token — it is now the
clean URL `https://huggingface.co/spaces/psk95/portfolio-rag-api` (verified via
`git remote -v`). Pushes authenticate via a credential helper / one-off token
rather than a token baked into the remote. If you ever need to re-auth:

```bash
git push https://psk95:NEW_HF_TOKEN@huggingface.co/spaces/psk95/portfolio-rag-api main
```

If a token was previously committed anywhere, rotate it at
https://huggingface.co/settings/tokens as a precaution.

## Status & optional next steps

Both services are **deployed and verified live**: backend on the HF Space,
frontend on Vercel at `sivakumar.dev`/`www.sivakumar.dev`, Space secrets set
(incl. `KEEPALIVE_TOKEN` and `FRONTEND_ORIGIN`), keepalive cron active, and the
eval harness passing against both local and the deployed Space.

Smoke-test the deployed backend anytime:

```bash
curl https://psk95-portfolio-rag-api.hf.space/health

curl -X POST https://psk95-portfolio-rag-api.hf.space/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What projects has Siva built?","history":[]}'
```

Deferred / optional (not needed at current single-container scale):

- Redis-backed cache + rate limiter (only if the Space scales to >1 replica).
- Inline answer citations (map shown sources to specific claims).
- Batched embedding in ingest (negligible at the current corpus size).

### 11. Visitor Email Notifications

Every time someone visits the portfolio, a silent email is sent to `pabbisettyssivakumar@gmail.com`.

Key files:

```txt
siva-portfolio/app/api/visit/route.ts  ← API route that sends the email
siva-portfolio/app/page.tsx            ← fires a fire-and-forget POST on mount
```

How it works:
- `page.tsx` fires `POST /api/visit` invisibly on first mount (`useEffect`, `[]`). The
  visitor never sees anything.
- The API route reads the `X-Forwarded-For` header to get the client IP, calls
  `https://ipapi.co/{ip}/json/` for geolocation (city, country), and parses
  `User-Agent` with `ua-parser-js` for browser/OS/device.
- Sends a formatted HTML email via **Resend** (`resend` npm package).
- **De-duplication:** one email per IP per 10 minutes (in-memory Map). Page
  refreshes within that window are silently skipped.
- All errors are swallowed — this never blocks page load.

Required Vercel env vars:

```env
RESEND_API_KEY=re_...         # https://resend.com → free 100 emails/day
NOTIFY_EMAIL=pabbisettyssivakumar@gmail.com
```

If `RESEND_API_KEY` is not set, the route returns `200 OK` immediately (no-op).
This means local dev works fine without the key — just no emails.

## Validation Already Done

Frontend:

```bash
cd siva-portfolio
npm run lint
npm run build
```

Backend syntax:

```bash
python3 -m compileall portfolio-rag-api/app portfolio-rag-api/scripts
```

## Files To Watch

Backend:

```txt
portfolio-rag-api/app/routes/chat.py
portfolio-rag-api/app/routes/health.py
portfolio-rag-api/app/routes/feedback.py
portfolio-rag-api/app/rag/retrieval.py
portfolio-rag-api/app/rag/llm.py
portfolio-rag-api/app/rag/cache.py
portfolio-rag-api/app/rag/observability.py
portfolio-rag-api/app/rag/ingest.py
portfolio-rag-api/app/main.py
portfolio-rag-api/scripts/ingest.py
portfolio-rag-api/Dockerfile
portfolio-rag-api/README.md
```

Frontend:

```txt
siva-portfolio/components/Playground.tsx
siva-portfolio/.github/workflows/keep-neo4j-active.yml
siva-portfolio/.env.example
```

Content:

```txt
portfolio-rag-api/content/*.md
```
