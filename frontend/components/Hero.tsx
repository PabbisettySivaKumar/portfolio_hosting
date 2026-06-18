"use client";

import { Terminal, MapPin, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { techBadges } from "@/app/data/portfolio";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="absolute inset-0 grid-bg opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
      <div className="absolute inset-0 noise opacity-[0.35] pointer-events-none" />
      <div className="relative hero-glow max-w-6xl mx-auto px-5 sm:px-8">
        <div
          data-reveal
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-800 bg-stone-900/40 text-xs font-mono text-stone-400 mb-6"
        >
          <Terminal className="w-3 h-3 text-amber-400" />
          <span>AI Engineer Intern @ Dotkonnekt</span>
          <span className="text-stone-600">·</span>
          <MapPin className="w-3 h-3" />
          <span>Bangalore, IN</span>
        </div>

        <h1
          data-reveal
          style={{ transitionDelay: "80ms" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-100 leading-[1.08] max-w-4xl"
        >
          Hi, I&apos;m Siva Kumar — I build{" "}
          <span className="amber-text">production-grade</span>{" "}
          <span className="whitespace-nowrap">agentic AI systems.</span>
        </h1>

        <p
          data-reveal
          style={{ transitionDelay: "160ms" }}
          className="mt-6 text-lg sm:text-xl text-stone-400 leading-relaxed max-w-2xl"
        >
          AI Engineer specializing in RAG pipelines, LLM orchestration, and
          multi-agent architectures. Currently building AI products at{" "}
          <span className="text-stone-200 font-medium">Dotkonnekt</span>.
        </p>

        <div
          data-reveal
          style={{ transitionDelay: "240ms" }}
          className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <a
            href="#playground"
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-[0_0_36px_-8px_rgba(245,158,11,0.95)] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Chat with my portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-stone-700 bg-stone-900/40 hover:bg-stone-900/80 text-stone-100 font-medium text-sm transition-colors"
          >
            View projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div
          data-reveal
          style={{ transitionDelay: "320ms" }}
          className="mt-12 flex flex-wrap gap-2"
        >
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mr-1 self-center">
            Stack:
          </span>
          {techBadges.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs font-mono text-stone-300 rounded-full border border-stone-800 bg-stone-900/40 hover:border-amber-500/40 hover:text-stone-100 transition-colors"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
