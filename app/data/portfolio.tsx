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
