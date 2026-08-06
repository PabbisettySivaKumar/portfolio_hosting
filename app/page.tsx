"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Playground from "@/components/Playground";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Portfolio() {
  // Fire-and-forget: silently notify on first page load. Never blocks render.
  useEffect(() => {
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageUrl: window.location.href,
        referrer: document.referrer || "Direct",
      }),
    }).catch(() => {
      // Ignore all errors — notification is best-effort
    });
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0a] text-stone-300 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-50">
      <Header />
      <Hero />
      <Playground />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </div>
  );
}