"use client";

import { useState } from "react";
import { Check, Mail, Copy, ArrowUpRight } from "lucide-react";
import { Github } from "@/components/icons/Github";
import { Linkedin } from "@/components/icons/Linkedin";

export default function Contact() {
  const [emailCopied, setEmailCopied] = useState(false);

  function copyEmail() {
    const email = "pabbisettyssivakumar@gmail.com";
    navigator.clipboard?.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1600);
  }

  return (
    <section id="contact" className="relative pt-20 pb-10 sm:pt-28 sm:pb-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          data-reveal
          className="relative rounded-2xl border border-stone-800 bg-[#111110] p-10 sm:p-16 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-amber-600/5 blur-3xl" />
          <div className="absolute inset-0 noise opacity-[0.25] pointer-events-none" />

          <div className="relative max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-4">
              <span className="w-6 h-px bg-amber-500/70" />
              Get in touch
            </div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-100 leading-[1.05]">
              Let&apos;s build <span className="amber-text">something together.</span>
            </h2>
            <p className="mt-5 text-stone-400 text-lg leading-relaxed">
              Open to AI Engineer roles, freelance projects, and interesting
              problems in agentic AI. Fastest response over email.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyEmail}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-[0_0_32px_-8px_rgba(245,158,11,0.9)] transition"
              >
                {emailCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Email copied
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Email me
                    <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                  </>
                )}
              </button>
              <a
                href="https://linkedin.com/in/sivakumar644"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-stone-700 bg-stone-900/40 hover:bg-stone-900 text-stone-100 font-medium text-sm transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/PabbisettySivaKumar"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-stone-700 bg-stone-900/40 hover:bg-stone-900 text-stone-100 font-medium text-sm transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="mt-8 font-mono text-sm text-stone-500">
              <span className="text-amber-500">$</span> echo{" "}
              <span className="text-amber-400">pabbisettyssivakumar@gmail.com</span>
            </div>
          </div>
        </div>

        <footer className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <span className="font-mono font-bold text-[10px] text-stone-950">sk</span>
            </div>
            <span>© 2026 Siva Kumar Pabbisetty. All rights reserved.</span>
          </div>
          <div className="text-xs font-mono text-stone-600">
            Built with Next.js · deployed on Vercel
          </div>
        </footer>
      </div>
    </section>
  );
}
