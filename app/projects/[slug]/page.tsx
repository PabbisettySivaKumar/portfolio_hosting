import * as Lucide from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectDetails } from "@/app/data/portfolio";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(projectDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectDetails[slug];
  if (!project) return {};
  return {
    title: `${project.title} — Siva Kumar`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projectDetails[slug];
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#0b0b0a] text-stone-300 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-50 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 inset-x-0 h-[600px] grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-50 border-b border-stone-800/60 bg-[#0b0b0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-100 transition-colors"
          >
            <Lucide.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to portfolio
          </Link>
          <span className="hidden sm:block font-mono text-xs text-stone-600">
            /{slug}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24 space-y-24 relative">

        {/* ── Hero ── */}
        <section className="relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-stone-600 mb-6">
            <span>portfolio</span>
            <Lucide.ChevronRight className="w-3 h-3" />
            <span>projects</span>
            <Lucide.ChevronRight className="w-3 h-3" />
            <span className="text-amber-500">{slug}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-100 leading-tight mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl leading-relaxed mb-10">
            {project.tagline}
          </p>

          {/* Quick Specs Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-stone-800/80 rounded-xl p-5 bg-[#111110]/50 backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Company</span>
              <span className="text-sm font-semibold text-stone-200 flex items-center gap-1.5">
                <Lucide.Briefcase className="w-4 h-4 text-amber-500/80" />
                {project.company}
              </span>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-800/80 pt-4 sm:pt-0 sm:pl-6">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Timeline</span>
              <span className="text-sm font-semibold text-stone-200 flex items-center gap-1.5">
                <Lucide.Calendar className="w-4 h-4 text-amber-500/80" />
                {project.period}
              </span>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-800/80 pt-4 sm:pt-0 sm:pl-6">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Focus Area</span>
              <span className="text-sm font-semibold text-stone-200">
                {slug === "txt2img" ? "Generative Media & Pipelines" : "NLP & Real-Time Aggregations"}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono text-stone-400 rounded-full border border-stone-800 bg-black/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ── Overview ── */}
        <section>
          <SectionLabel>Overview</SectionLabel>
          <div className="space-y-4">
            {project.overview.map((para, i) => (
              <p key={i} className="text-stone-300 leading-relaxed text-base sm:text-[17px]">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── Architecture ── */}
        <section>
          <SectionLabel>Architecture</SectionLabel>
          <p className="text-stone-500 text-sm mb-8">
            End-to-end data flow through the pipeline.
          </p>
          {project.archImage ? (
            <div className="rounded-xl border border-stone-800 bg-[#111110] p-4 sm:p-6 flex items-center justify-center">
              <div className="relative w-full max-w-2xl group rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.archImage}
                  alt={`${project.title} Architecture`}
                  className="w-full h-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          ) : (
            project.archNodes && project.archEdges && (
              <ArchDiagram nodes={project.archNodes} edges={project.archEdges} />
            )
          )}
        </section>

        {/* ── Implementation Walkthrough ── */}
        <section>
          <SectionLabel>Implementation Walkthrough</SectionLabel>
          <div className="space-y-5 mt-8">
            {project.steps.map((step, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-stone-800 bg-[#111110] p-6 overflow-hidden group hover:border-amber-500/30 transition-colors"
              >
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:border-amber-500/40 group-hover:bg-amber-500/5 transition-colors">
                      <StepIcon name={step.icon} />
                    </div>
                    <span className="font-mono text-[10px] text-stone-500 tracking-wider">
                      PHASE {step.phase}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-stone-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-stone-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack Deep-Dive ── */}
        <section>
          <SectionLabel>Tech Stack Deep-Dive</SectionLabel>
          <p className="text-stone-500 text-sm mb-8">Why each tool was chosen.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {project.techStack.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-stone-800 bg-[#111110] p-6 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-stone-100">{item.name}</span>
                </div>
                <p className="text-xs font-mono text-amber-500/80 mb-3">{item.role}</p>
                <p className="text-sm text-stone-400 leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer nav ── */}
        <div className="border-t border-stone-800 pt-10 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-100 transition-colors"
          >
            <Lucide.ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </Link>
          <span className="text-xs font-mono text-stone-700">sivakumar.dev</span>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-6">
      <span className="w-6 h-px bg-amber-500/70" />
      {children}
    </div>
  );
}

function StepIcon({ name }: { name?: string }) {
  switch (name) {
    case "terminal":
      return <Lucide.Terminal className="w-5 h-5 text-amber-400" />;
    case "settings":
      return <Lucide.Settings className="w-5 h-5 text-amber-400" />;
    case "crop":
      return <Lucide.Crop className="w-5 h-5 text-amber-400" />;
    case "wand":
      return <Lucide.Wand2 className="w-5 h-5 text-amber-400" />;
    case "database":
      return <Lucide.Database className="w-5 h-5 text-amber-400" />;
    case "download-cloud":
      return <Lucide.Download className="w-5 h-5 text-amber-400" />;
    case "file-json":
      return <Lucide.FileJson className="w-5 h-5 text-amber-400" />;
    case "check-square":
      return <Lucide.CheckSquare className="w-5 h-5 text-amber-400" />;
    case "file-spreadsheet":
      return <Lucide.FileSpreadsheet className="w-5 h-5 text-amber-400" />;
    default:
      return <Lucide.Code className="w-5 h-5 text-amber-400" />;
  }
}

function ArchDiagram({
  nodes,
  edges: _edges,
}: {
  nodes: { id: string; label: string; sublabel?: string }[];
  edges: { from: string; to: string; label?: string }[];
}) {
  return (
    <div className="rounded-xl border border-stone-800 bg-[#111110] p-6 sm:p-8 overflow-x-auto">
      {/* Mobile: vertical stack */}
      <div className="flex flex-col sm:hidden items-center gap-0">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-col items-center w-full">
            <div className="w-full max-w-xs rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-3 text-center">
              <div className="text-sm font-semibold text-stone-100">{node.label}</div>
              {node.sublabel && (
                <div className="text-xs font-mono text-stone-500 mt-0.5">{node.sublabel}</div>
              )}
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <div className="w-px h-5 bg-amber-500/40" />
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-amber-500/60" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: horizontal flow */}
      <div className="hidden sm:flex items-center justify-between gap-0 min-w-max mx-auto">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center">
            {/* Node card */}
            <div className="rounded-lg border border-stone-700 bg-stone-900/60 hover:border-amber-500/40 hover:bg-amber-500/5 transition-colors px-4 py-3 text-center min-w-[130px]">
              <div className="text-sm font-semibold text-stone-100 whitespace-nowrap">{node.label}</div>
              {node.sublabel && (
                <div className="text-[11px] font-mono text-stone-500 mt-0.5 whitespace-nowrap">{node.sublabel}</div>
              )}
            </div>
            {/* Arrow between nodes */}
            {i < nodes.length - 1 && (
              <div className="flex items-center px-2">
                <div className="h-px w-8 bg-amber-500/40" />
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-amber-500/60" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
