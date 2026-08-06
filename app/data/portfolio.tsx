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
export type Step = { phase: string; title: string; description: string; icon?: string };

export type ProjectDetail = {
  slug: string;
  title: string;
  tagline: string;
  company: string;
  period: string;
  tags: string[];
  overview: string[];
  archNodes?: ArchNode[];
  archEdges?: ArchEdge[];
  archImage?: string;
  steps: Step[];
  techStack: TechItem[];
};

export const projectDetails: Record<string, ProjectDetail> = {
  "txt2img": {
    slug: "txt2img",
    title: "Multimodal Text-to-Image Pipeline",
    tagline: "Background isolation and automated dynamic banner generation using in-memory processing.",
    company: "Dotkonnekt",
    period: "Nov 2025 — Mar 2026",
    tags: ["Python", "rembg", "Google GenAI", "AWS S3", "Langfuse"],
    overview: [
      "At Dotkonnekt, we built an automated graphic banner generation system for campaign promotion. The main goal was to allow merchants to provide a subject image and a prompt, automatically isolating the subject from its original background, and then dynamically embedding it on a formatted canvas surrounded by a high-quality AI-generated setting.",
      "I designed and built the complete backend pipeline in Python. When a client submits a multipart request containing the raw image and prompt, a controller parses and validates the input. The orchestrator calls Langfuse to retrieve the optimized model configuration and prompt template, ensuring dynamic tuning without redeploying code.",
      "The core processing occurs in an in-memory image pipeline (BytesIO): the subject background is stripped using the rembg library, placed onto a 16:9 2048px blank canvas using dynamic scaling algorithms, and passed to a Google GenAI model (e.g. Imagen) to generate the surrounding background. The output is stored on AWS S3 and its key is returned to the client.",
    ],
    archImage: "/projects/txt2img-architecture.png",
    steps: [
      {
        phase: "01",
        title: "Request Parsing and Validation",
        description: "The controller authenticates the client, parses the multipart/form-data payload containing the subject image and the text prompt, and prepares the image bytes for processing in memory using BytesIO.",
        icon: "terminal",
      },
      {
        phase: "02",
        title: "Dynamic Config via Langfuse",
        description: "To avoid baking model configs and prompts in code, the orchestrator pulls live prompt template configurations and model hyperparameters directly from Langfuse at runtime.",
        icon: "settings",
      },
      {
        phase: "03",
        title: "Background Removal & Canvas Placement",
        description: "The pipeline uses the rembg library to isolate the subject from the input image. It then initializes a 16:9 canvas (2048px width) and places the isolated subject onto it, dynamically scaling and centering the subject to leave natural margins.",
        icon: "crop",
      },
      {
        phase: "04",
        title: "Inpainting with Google GenAI",
        description: "The composite canvas along with the text prompt is passed to Google's GenAI model. The model runs inpainting/outpainting to fill the blank areas of the canvas, blending the subject seamlessly into the newly generated background.",
        icon: "wand",
      },
      {
        phase: "05",
        title: "AWS S3 Storage",
        description: "The generated high-resolution banner image is saved to AWS S3 using a tenancy-structured folder structure (`env/tenant/dir/gen_uuid.png`), and the S3 key is returned to the client.",
        icon: "database",
      },
    ],
    techStack: [
      {
        name: "rembg",
        role: "Background isolation",
        why: "A lightweight, Python-based U2Net library that runs locally to isolate subjects from original image backgrounds efficiently.",
      },
      {
        name: "Google GenAI (Imagen)",
        role: "Outpainting & banner generation",
        why: "Provides state-of-the-art outpainting capabilities, accurately blending the custom canvas structure with high-resolution generated background scenes.",
      },
      {
        name: "Langfuse",
        role: "Prompt and model configuration management",
        why: "Enables instant tweaking of the base generation prompt and model hyper-parameters without code redeploys, keeping operations highly agile.",
      },
      {
        name: "AWS S3",
        role: "Asset storage",
        why: "Secure, durable, and highly available storage for the final generated image banners, keeping filenames clean with unique UUID structures.",
      },
    ],
  },
  "reddit": {
    slug: "reddit",
    title: "AI-Powered Reddit Analytics Pipeline",
    tagline: "Automated keyword-driven Reddit ingestion with LLM-based post insights, comment evaluations, and Excel reports.",
    company: "Dotkonnekt",
    period: "Nov 2025 — Mar 2026",
    tags: ["FastAPI", "Python", "LLM API", "MongoDB", "Pandas", "REST API"],
    overview: [
      "The Reddit Brand Monitor Service is a backend analytics pipeline built on FastAPI. It allows brands to track mentions, measure public sentiment, detect high-intent buying signals, and evaluate community discussions in real time.",
      "The system handles data ingestion by scanning subreddits for specific keywords using a rate-limit-aware HTTP fetch client with retries and exponential backoff. It can retrieve both main posts and comment trees down to several nesting levels. Raw data is cached in MongoDB, which stores collections for raw posts, raw comments, post insights, overall summaries, and comment evaluations.",
      "The analysis engine batches text feeds and calls an LLM completion service (using LiteLLM or direct endpoints with JSON Schema formats). It extracts sentiment scoring, category classification (e.g. comparison, complaint, recommendation), and intent indicators. For comments, the engine analyzes whether they accurately answer the parent post and suggest custom rewrites if the post's relevance is weak. Analysts can stream multi-sheet Excel reports containing full evaluations directly from the service.",
    ],
    archNodes: [
      { id: "trigger", label: "FastAPI Routes", sublabel: "/monitor, /analyze, /export" },
      { id: "fetcher", label: "Reddit Client", sublabel: "HTTP + Retry & Backoff" },
      { id: "mongo", label: "MongoDB Cache", sublabel: "Raw + Insights Collections" },
      { id: "llm", label: "LLM Processor", sublabel: "JSON Mode Batch Analysis" },
      { id: "pandas", label: "Excel Exporter", sublabel: "Pandas Streaming Response" },
    ],
    archEdges: [
      { from: "trigger", to: "fetcher", label: "keywords" },
      { from: "fetcher", to: "mongo", label: "cached posts & comments" },
      { from: "mongo", to: "llm", label: "batched texts" },
      { from: "llm", to: "mongo", label: "save insights" },
      { from: "mongo", to: "pandas", label: "export query" },
      { from: "pandas", to: "trigger", label: "xlsx stream" },
    ],
    steps: [
      {
        phase: "01",
        title: "Robust Reddit Ingestion",
        description: "An ingestion layer queries Reddit search endpoints for keywords. It features custom rate-limit prevention, retry limits, and exponential backoff to handle Reddit's API limits. De-duplicated posts and recursively parsed comment trees are mapped by keyword and indexed directly in MongoDB.",
        icon: "download-cloud",
      },
      {
        phase: "02",
        title: "JSON Schema Post Classification",
        description: "The pipeline groups posts into batches and uses structured LLM calls with JSON Mode to analyze brand intent. It evaluates sentiment, intent categories (complaint, comparison, purchase intent), and marks posts as 'high-intent questions' using key trigger phrases.",
        icon: "file-json",
      },
      {
        phase: "03",
        title: "Comment Quality & Relevance Audits",
        description: "The system matches parent posts against comment trees to verify comment relevance and evaluate answer quality. If a comment is marked as irrelevant, the LLM generates a suggested relevant comment rewrite, enabling automated moderation or response templates.",
        icon: "check-square",
      },
      {
        phase: "04",
        title: "Multi-Sheet Excel Reporting",
        description: "FastAPI generates a StreamingResponse using Pandas ExcelWriter and BytesIO, enabling the client to download a formatted, multi-sheet spreadsheet (`_analysis.xlsx`) matching the target keywords instantly.",
        icon: "file-spreadsheet",
      },
    ],
    techStack: [
      {
        name: "FastAPI",
        role: "API Endpoint Engine",
        why: "Provides highly efficient async API paths, automatic documentation, and request schema modeling via Pydantic.",
      },
      {
        name: "MongoDB",
        role: "Document Cache & Metrics Store",
        why: "Allows flexible storage of unstructured Reddit JSON feeds and structured LLM analytics metrics under compound database indexes.",
      },
      {
        name: "LiteLLM / Custom JSON API",
        role: "Structured LLM Orchestration",
        why: "Enables uniform model routing, structured JSON outputs, and safe retry chains for classification and text generation.",
      },
      {
        name: "Pandas",
        role: "Data Export Processing",
        why: "Simplifies aggregation logic and outputs complex multi-sheet Excel files directly from memory without writing physical files to disk.",
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
