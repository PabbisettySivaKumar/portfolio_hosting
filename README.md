# Siva Kumar — Portfolio

Personal portfolio site with a built-in **AI chatbot** that answers questions
about Siva's experience, projects, and skills using RAG. Built with Next.js and
deployed on Vercel at **[sivakumar.dev](https://www.sivakumar.dev)**.

## Architecture

```
Browser (sivakumar.dev, Next.js on Vercel)
   └─ Playground component → streams NDJSON from the RAG backend
        └─ portfolio-rag-api (FastAPI on a Hugging Face Space)
             └─ LiteLLM → Gemini  +  Neo4j Aura vector search
```

The frontend is a single-page portfolio (`app/page.tsx`) composed of section
components (`Hero`, `Projects`, `Skills`, `Experience`, `Contact`, and the
`Playground` chatbot). The chatbot (`components/Playground.tsx`) calls the backend
at `NEXT_PUBLIC_CHAT_API_URL` and renders the streamed answer with source cards
and thumbs up/down feedback.

The backend lives in the sibling `portfolio-rag-api/` repo (its own git remote =
a Hugging Face Space). This is **not** a monorepo.

## Development
```bash
cp .env.example .env.local     # set NEXT_PUBLIC_CHAT_API_URL
npm install
npm run dev                    # http://localhost:3000
```
Validate before pushing:
```bash
npm run lint
npm run build
```

## Environment
```env
# .env.local — the RAG backend the chatbot calls
NEXT_PUBLIC_CHAT_API_URL=http://127.0.0.1:8000        # local
# production (Vercel): https://psk95-portfolio-rag-api.hf.space
```
Only this public var is needed — never put Gemini/Neo4j/Langfuse secrets in the
frontend; those live on the backend.

## Deployment
Pushed to GitHub → auto-deployed by **Vercel**. Set `NEXT_PUBLIC_CHAT_API_URL`
to the Hugging Face Space URL in the Vercel project env.

> **Note:** this uses a non-standard Next.js version with breaking changes — see
> [`AGENTS.md`](AGENTS.md) before writing any Next.js code.

See **[HANDOFF.md](HANDOFF.md)** for full project detail (frontend + backend
topology, deployment, and operations).
