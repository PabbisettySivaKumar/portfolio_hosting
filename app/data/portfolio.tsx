import {
  Image as ImageIcon,
  MessageSquare,
  Network,
  Workflow,
  Sparkles,
  Server,
  Database,
  Eye,
  LineChart,
  BarChartBig,
  Briefcase,
  GraduationCap
} from "lucide-react";

export type Message = {
  role: string;
  content: string;
  sources: { title: string; snippet: string }[] | null;
  traceId?: string | null;
};

export type AnswerPayload = {
  answer: string;
  sources: { title: string; snippet: string }[];
};

export const suggestions = [
  "What experience does Siva have with LangChain?",
  "Tell me about the AI Powered Reddit Analytics Pipeline",
  "What's Siva's experience with multi-agent systems?",
  "Is Siva available for AI engineer roles?",
];

export const navItems = [
  { label: "Home", href: "/home", sectionId: "home" },
  { label: "Playground", href: "/playground", sectionId: "playground" },
  { label: "Projects", href: "/projects", sectionId: "projects" },
  { label: "Experience", href: "/experience", sectionId: "experience" },
  { label: "About", href: "/about", sectionId: "about" },
  { label: "Contact", href: "/contact", sectionId: "contact" },
];

export const techBadges = [
  "LangChain",
  "LangGraph",
  "FastAPI",
  "Neo4j",
  "Ollama",
  "Gemini",
  "Claude",
];

export const projects = [
  {
    title: "Multimodal Text-to-Image Pipeline",
    description: "Unified provider-agnostic image generation with Gemini and LiteLLM, featuring structured prompt optimization.",
    tech: ["Python", "LiteLLM", "Gemini", "FastAPI"],
    icon: ImageIcon,
    code: "txt2img",
    href: null,
    detailSlug: "txt2img",
  },
  {
    title: "AI-Powered Reddit Analytics Pipeline",
    description: "Automated ingestion and Gemini-powered sentiment + purchase-intent analysis at scale, with smart comment evaluation.",
    tech: ["Python", "Gemini", "MongoDB", "Reddit API"],
    icon: MessageSquare,
    code: "reddit",
    href: null,
    detailSlug: "reddit",
  },
  {
    title: "Agentic RAG System with Neo4j",
    description: "End-to-end multi-step reasoning over PDFs with LangChain, Neo4j Vector DB, and Langfuse observability.",
    tech: ["LangChain", "Neo4j", "FastAPI", "Streamlit", "Langfuse"],
    icon: Network,
    code: "agentic-rag",
    href: "https://github.com/PabbisettySivaKumar/GenAi-End_to_End",
    detailSlug: null,
  },
  {
    title: "Intelligent Analysis System",
    description: "AI-powered data analysis platform that processes CSV files into interactive visualizations, NLP-driven querying, text mining, and one-click report generation.",
    tech: ["Python", "Streamlit", "Pandas", "Plotly", "NLP"],
    icon: BarChartBig,
    code: "analysis",
    href: "https://github.com/PabbisettySivaKumar/IntelligentAnalysisSystem",
    detailSlug: null,
  },
];

export type ArchNode = { id: string; label: string; sublabel?: string };
export type ArchEdge = { from: string; to: string; label?: string };
export type TechItem = { name: string; role: string; why: string };
export type Step = { phase: string; title: string; description: string };

export type ProjectDetail = {
  slug: string;
  title: string;
  tagline: string;
  company: string;
  period: string;
  tags: string[];
  overview: string[];
  archNodes: ArchNode[];
  archEdges: ArchEdge[];
  steps: Step[];
  techStack: TechItem[];
};

export const projectDetails: Record<string, ProjectDetail> = {
  "txt2img": {
    slug: "txt2img",
    title: "Multimodal Text-to-Image Pipeline",
    tagline: "Provider-agnostic image generation with structured prompt optimization and LiteLLM routing.",
    company: "Dotkonnekt",
    period: "Nov 2025 — Mar 2026",
    tags: ["Python", "LiteLLM", "Gemini", "FastAPI", "Prompt Engineering"],
    overview: [
      "At Dotkonnekt, we needed a scalable image generation service that could work across multiple AI providers without lock-in. The challenge was that each provider — Gemini Imagen, Stability AI, DALL-E — has different API shapes, prompt expectations, and quality characteristics.",
      "I designed and built a provider-agnostic pipeline that abstracts all image generation behind a single FastAPI interface. At its core, a Gemini-powered prompt optimizer enriches raw user inputs into structured, model-optimized prompts before routing them through LiteLLM to the appropriate backend.",
      "The result was a system that could be switched between providers by changing a single config value, with consistent prompt quality and no changes required in downstream services.",
    ],
    archNodes: [
      { id: "input", label: "User Input", sublabel: "Raw text prompt" },
      { id: "optimizer", label: "Prompt Optimizer", sublabel: "Gemini Flash" },
      { id: "router", label: "Provider Router", sublabel: "LiteLLM" },
      { id: "generator", label: "Image Generator", sublabel: "Gemini Imagen / Stability AI" },
      { id: "api", label: "FastAPI Response", sublabel: "Base64 / URL output" },
    ],
    archEdges: [
      { from: "input", to: "optimizer", label: "raw prompt" },
      { from: "optimizer", to: "router", label: "structured prompt" },
      { from: "router", to: "generator", label: "provider call" },
      { from: "generator", to: "api", label: "image bytes" },
    ],
    steps: [
      {
        phase: "01",
        title: "Provider Abstraction with LiteLLM",
        description: "The first step was eliminating provider-specific code. LiteLLM gives a unified completion-style interface for image models. I configured a routing table mapping model aliases (e.g. 'fast', 'quality') to actual provider+model strings, allowing instant provider swaps via environment config.",
      },
      {
        phase: "02",
        title: "Structured Prompt Optimization",
        description: "Raw user prompts like 'a futuristic city' are too vague for image models. I built a Gemini Flash-powered optimizer that expands the prompt into a structured format: subject, style, lighting, camera angle, and negative keywords. This was the single biggest quality improvement — optimized prompts consistently produced sharper, more coherent images.",
      },
      {
        phase: "03",
        title: "FastAPI Service with Async Generation",
        description: "The pipeline is exposed as a REST API built on FastAPI with fully async request handling. Each generation request creates an async task chain: validate → optimize → route → generate → return. This allowed the service to handle concurrent generation requests without blocking.",
      },
      {
        phase: "04",
        title: "Fallback and Error Handling",
        description: "Image generation APIs are notoriously unreliable — rate limits, content policy rejections, and provider outages are common. I implemented a fallback chain: if the primary provider fails, LiteLLM automatically retries with the secondary. Content policy rejections are caught and returned as structured error objects with a reason field.",
      },
    ],
    techStack: [
      {
        name: "LiteLLM",
        role: "Provider router and unified API layer",
        why: "It gave us a single interface for all image providers, reducing provider-specific code to zero. Switching from Gemini Imagen to Stability AI became a one-line config change.",
      },
      {
        name: "Gemini Flash",
        role: "Prompt optimizer",
        why: "Fast, cheap, and excellent at following structured output instructions. Used specifically for the prompt enrichment step — latency matters here since it's a pre-generation step.",
      },
      {
        name: "FastAPI",
        role: "API framework",
        why: "Native async support and Pydantic-based request validation made it ideal for a pipeline where every step is an async I/O call.",
      },
      {
        name: "Python",
        role: "Pipeline orchestration",
        why: "The ecosystem for AI/ML tooling is unmatched in Python. All major model SDKs, LiteLLM, and async libraries are first-class.",
      },
    ],
  },

  "reddit": {
    slug: "reddit",
    title: "AI-Powered Reddit Analytics Pipeline",
    tagline: "Automated Reddit ingestion with Gemini-powered sentiment and purchase-intent analysis at scale.",
    company: "Dotkonnekt",
    period: "Nov 2025 — Mar 2026",
    tags: ["Python", "Gemini", "MongoDB", "Reddit API", "Sentiment Analysis", "NLP"],
    overview: [
      "Dotkonnekt needed a way to monitor Reddit at scale for brand signals — specifically, understanding how people feel about products and when they express purchase intent. Manual monitoring was impossible at the volume of posts across relevant subreddits.",
      "I built a fully automated pipeline that continuously ingests Reddit posts and comments, runs them through a Gemini-powered analysis layer for sentiment scoring and purchase-intent classification, and stores structured results in MongoDB for downstream querying.",
      "The system processes thousands of posts per day and surfaces actionable signals: which subreddits mention specific topics positively, which comments indicate a user is ready to buy, and which discussions should be flagged for a human response.",
    ],
    archNodes: [
      { id: "reddit", label: "Reddit API", sublabel: "PRAW / OAuth2" },
      { id: "ingestion", label: "Ingestion Worker", sublabel: "Async Python scheduler" },
      { id: "gemini", label: "Gemini Analysis Engine", sublabel: "Sentiment + Intent classification" },
      { id: "mongo", label: "MongoDB", sublabel: "Structured result store" },
      { id: "reports", label: "Reports & Alerts", sublabel: "Aggregated insights" },
    ],
    archEdges: [
      { from: "reddit", to: "ingestion", label: "raw posts/comments" },
      { from: "ingestion", to: "gemini", label: "batched text" },
      { from: "gemini", to: "mongo", label: "scored documents" },
      { from: "mongo", to: "reports", label: "aggregation queries" },
    ],
    steps: [
      {
        phase: "01",
        title: "Reddit Ingestion with PRAW",
        description: "Used PRAW (Python Reddit API Wrapper) with OAuth2 to authenticate and stream posts from a configured list of subreddits. An async scheduler polls on configurable intervals and deduplicates by post ID before queuing for analysis. The ingestion layer is completely decoupled from analysis — it just writes raw text + metadata to a processing queue.",
      },
      {
        phase: "02",
        title: "Batched Gemini Analysis",
        description: "Sending each post to Gemini individually would be slow and expensive. I implemented a batching layer that groups posts into chunks and sends them in a single structured prompt requesting JSON output: one analysis object per post. Gemini returns a list of objects with sentiment (positive/neutral/negative + score), purchase_intent (boolean + confidence), and a brief reasoning field.",
      },
      {
        phase: "03",
        title: "Smart Comment Evaluation",
        description: "Not all comments are equal — a top-level comment with 500 upvotes carries more signal than a buried reply. I built a scoring formula that weighs Gemini's analysis score against comment karma, post recency, and subreddit authority. This composite score determines which items surface in reports.",
      },
      {
        phase: "04",
        title: "MongoDB Storage and Aggregation",
        description: "Analysis results are stored in MongoDB with compound indexes on (subreddit, date, sentiment, intent). This enables fast aggregation queries: 'top positive mentions this week', 'purchase-intent comments by subreddit', and 'sentiment trend over 30 days'. The schema was designed to support both real-time lookups and batch report generation.",
      },
    ],
    techStack: [
      {
        name: "PRAW (Reddit API)",
        role: "Data ingestion and stream access",
        why: "PRAW handles OAuth2, rate limiting, and pagination out of the box. The async-compatible wrapper meant ingestion could run continuously without blocking the analysis pipeline.",
      },
      {
        name: "Gemini",
        role: "Sentiment and purchase-intent classifier",
        why: "Gemini's instruction-following and structured JSON output capabilities made it ideal for multi-label classification. A single prompt handles both sentiment scoring and intent detection, reducing API calls by 50% vs separate classifiers.",
      },
      {
        name: "MongoDB",
        role: "Result store and aggregation engine",
        why: "The schema-flexible nature of MongoDB was key — analysis outputs varied slightly depending on Gemini's response. Compound indexes made the time-series aggregation queries fast enough for real-time dashboards.",
      },
      {
        name: "Python asyncio",
        role: "Pipeline orchestration",
        why: "The pipeline is almost entirely I/O-bound (API calls + DB writes). Asyncio allowed us to run ingestion, analysis, and storage concurrently without threading complexity.",
      },
    ],
  },
};

export const skills = [
  {
    title: "Agentic AI / Orchestration",
    icon: Workflow,
    items: [
      "LangChain",
      "LangGraph",
      "AutoGen",
      "Multi-agent workflows",
      "Tool calling",
      "State management",
    ],
  },
  {
    title: "LLM & RAG",
    icon: Sparkles,
    items: [
      "RAG pipelines",
      "Embeddings",
      "Vector search",
      "Prompt engineering",
      "Memory management",
      "Ollama",
    ],
  },
  {
    title: "Backend & APIs",
    icon: Server,
    items: ["FastAPI", "RESTful APIs", "Async workflows", "Python", "SQL"],
  },
  {
    title: "Databases",
    icon: Database,
    items: ["Neo4j (Vector DB)", "MySQL", "MongoDB"],
  },
  {
    title: "AI Observability",
    icon: Eye,
    items: ["Langfuse (prompt tracking, pipeline monitoring)"],
  },
  {
    title: "Data & ML",
    icon: LineChart,
    items: ["Pandas", "NumPy", "Matplotlib", "scikit-learn", "NLP"],
  },
];

export const education = [
  {
    degree: "M.Tech in Computer Science",
    institution: "Manipal Institute of Technology",
    period: "2018 — 2020",
    icon: GraduationCap,
  },
  {
    degree: "B.Tech in Information Technology",
    institution: "Pondicherry Engineering College",
    period: "2013 — 2017",
    icon: GraduationCap,
  },
];

export const experience = [
  {
    role: "AI Engineer Intern",
    company: "Dotkonnekt",
    period: "Nov 2025 — Mar 2026",
    description: "Building production agentic AI systems: RAG pipelines, multi-agent orchestration with LangChain/LangGraph, and observability with Langfuse.",
    icon: Briefcase,
    current: false,
  },
  {
    role: "Generative AI Engineer, Workshop",
    company: "Dotkonnekt",
    period: "Aug 2025 — Nov 2025",
    description: "Hands-on workshop program: LLM fundamentals, prompt engineering, and shipping first agentic prototypes.",
    icon: GraduationCap,
    current: false,
  },
  {
    role: "Automation Test Engineer Intern",
    company: "Mast Global / Victoria's Secret",
    period: "Jun 2019 — Jun 2020",
    description: "Built automated test suites for retail systems — where the engineering instincts started.",
    icon: Briefcase,
    current: false,
  },
];
