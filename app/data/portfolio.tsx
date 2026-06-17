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
};

export type AnswerPayload = {
  answer: string;
  sources: { title: string; snippet: string }[];
};

export const suggestions = [
  "What experience does Siva have with LangChain?",
  "Tell me about the Reddit Analytics Pipeline",
  "What's Siva's experience with multi-agent systems?",
  "Is Siva available for AI engineer roles?",
];

export const mockAnswers: Record<string, AnswerPayload> = {
  "What experience does Siva have with LangChain?": {
    answer:
      "Siva has deep, hands-on experience with LangChain and LangGraph, using them to build production agentic systems. At Dotkonnekt he architected an Agentic RAG pipeline over PDFs using LangChain with Neo4j as a vector store, orchestrated multi-step reasoning with LangGraph state machines, and integrated Langfuse for prompt-level observability. He's comfortable with tool calling, memory management, and building custom retrievers.",
    sources: [
      {
        title: "projects/agentic-rag-neo4j.md",
        snippet: "End-to-end multi-step reasoning over PDFs with LangChain retrieval chains, Neo4j Vector DB, and Langfuse tracing for every agent step."
      },
      {
        title: "experience/dotkonnekt-intern.md",
        snippet: "Building RAG pipelines and multi-agent orchestration in production with LangChain + LangGraph."
      }
    ],
  },
  "Tell me about the Reddit Analytics Pipeline": {
    answer:
      "The AI-Powered Reddit Analytics Pipeline automates ingestion of posts and comments from Reddit, then routes them through a Gemini-powered analysis stage that scores sentiment and purchase intent at scale. It uses smart comment evaluation to skip low-signal threads, persists structured results to MongoDB for downstream dashboards, and is built in Python with the Reddit API. Designed to surface high-intent market signals without human triage.",
    sources: [
      {
        title: "projects/reddit-analytics.md",
        snippet: "Automated ingestion + Gemini sentiment & purchase-intent scoring with smart comment filtering. Stack: Python, Gemini, MongoDB, Reddit API."
      },
      {
        title: "case-studies/purchase-intent.md",
        snippet: "Smart evaluator skips low-signal comments before LLM scoring, cutting token cost by ~60%."
      }
    ],
  },
  "What's Siva's experience with multi-agent systems?": {
    answer:
      "Siva designs multi-agent workflows where specialized agents handle distinct sub-tasks — retrieval, reasoning, tool use, and synthesis — coordinated through LangGraph state graphs. He's shipped agentic RAG systems with planner + retriever + critic patterns, integrated tool calling against internal APIs, and added Langfuse tracing so every agent hop is observable. He favors explicit state machines over free-form agent loops for reliability.",
    sources: [
      {
        title: "projects/agentic-rag-neo4j.md",
        snippet: "Planner → Retriever → Critic agent graph in LangGraph, with Neo4j vector retrieval and Langfuse tracing per node."
      },
      {
        title: "notes/agent-design-principles.md",
        snippet: "Prefers explicit state graphs over ReAct loops — better observability, easier to debug, more predictable in production."
      }
    ],
  },
  "Is Siva available for AI engineer roles?": {
    answer:
      "Yes — Siva is open to AI Engineer and Applied ML roles, particularly those involving agentic systems, RAG, and LLM orchestration. He's based in Bangalore, comfortable with remote or hybrid, and currently interning at Dotkonnekt. The fastest way to reach him is pabbisettyssivakumar@gmail.com, or via the LinkedIn and GitHub links in the footer.",
    sources: [
      {
        title: "about/availability.md",
        snippet: "Open to AI Engineer / Applied ML roles. Bangalore-based, remote or hybrid. Strong preference for agentic AI, RAG, LLM infra."
      }
    ],
  },
};

export const defaultAnswer: AnswerPayload = {
  answer:
    "Great question — this is a visual prototype, so I'm replying from a small set of canned answers. In the real build this hits a FastAPI endpoint running a LangChain retriever over embeddings of Siva's resume, projects, and blog posts. Try one of the suggested questions above, or reach out directly at pabbisettyssivakumar@gmail.com.",
  sources: [
    {
      title: "system/prototype-notice.md",
      snippet: "Mock responses in the portfolio demo. Production version uses LangChain + Neo4j Vector DB + Gemini, traced with Langfuse."
    }
  ],
};

export const navItems = [
  { label: "Home", href: "/home", sectionId: "home" },
  { label: "Projects", href: "/projects", sectionId: "projects" },
  { label: "Playground", href: "/playground", sectionId: "playground" },
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
  },
  {
    title: "AI-Powered Reddit Analytics Pipeline",
    description: "Automated ingestion and Gemini-powered sentiment + purchase-intent analysis at scale, with smart comment evaluation.",
    tech: ["Python", "Gemini", "MongoDB", "Reddit API"],
    icon: MessageSquare,
    code: "reddit",
    href: null,
  },
  {
    title: "Agentic RAG System with Neo4j",
    description: "End-to-end multi-step reasoning over PDFs with LangChain, Neo4j Vector DB, and Langfuse observability.",
    tech: ["LangChain", "Neo4j", "FastAPI", "Streamlit", "Langfuse"],
    icon: Network,
    code: "agentic-rag",
    href: "https://github.com/PabbisettySivaKumar/GenAi-End_to_End",
  },
  {
    title: "Intelligent Analysis System",
    description: "AI-powered data analysis platform that processes CSV files into interactive visualizations, NLP-driven querying, text mining, and one-click report generation.",
    tech: ["Python", "Streamlit", "Pandas", "Plotly", "NLP"],
    icon: BarChartBig,
    code: "analysis",
    href: "https://github.com/PabbisettySivaKumar/IntelligentAnalysisSystem",
  },
];

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
    period: "Nov 2025 — Present",
    description: "Building production agentic AI systems: RAG pipelines, multi-agent orchestration with LangChain/LangGraph, and observability with Langfuse.",
    icon: Briefcase,
    current: true,
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
