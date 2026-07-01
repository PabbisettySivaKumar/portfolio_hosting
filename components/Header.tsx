"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { navItems } from "@/app/data/portfolio";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = useCallback((sectionId: string, pushUrl: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", pushUrl);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On initial load, scroll to the section matching the URL path
  useEffect(() => {
    const path = window.location.pathname.replace("/", "");
    if (path) {
      const el = document.getElementById(path);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId, href);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#0b0b0a]/75 border-b border-stone-800/70"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="h-16 flex items-center justify-between">
          <a
            href="/home"
            onClick={(e) => handleNavClick(e, "/home", "home")}
            className="flex items-center gap-2.5 group"
            aria-label="Home"
          >
            <div className="relative w-[38px] h-[38px] flex items-center justify-center">
              <img
                src="/icon.png?v=6"
                alt="Logo"
                width={38}
                height={38}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight text-stone-100">
              Siva Kumar
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 text-[11px] font-mono text-stone-400 px-2 py-0.5 rounded-full border border-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
              available
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                className="px-3 py-2 text-sm text-stone-400 hover:text-stone-100 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={(e) => handleNavClick(e, "/contact", "contact")}
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-stone-950 rounded-md bg-amber-500 hover:bg-amber-400 shadow-[0_0_24px_-8px_rgba(245,158,11,0.9)] transition"
            >
              Get in touch
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-md text-stone-300 hover:bg-stone-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-stone-800 -mx-5 sm:-mx-8 px-5 sm:px-8 pt-3 bg-[#0b0b0a]/95 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href, item.sectionId);
                    setMobileOpen(false);
                  }}
                  className="px-3 py-2.5 text-sm text-stone-300 hover:text-stone-100 rounded-md hover:bg-stone-900"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
