import { ArrowUpRight } from "lucide-react";
import { projects } from "@/app/data/portfolio";

export default function Projects() {
  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-3">
            <span className="w-6 h-px bg-amber-500/70" />
            Selected work
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-100 leading-tight">
              Featured projects.
            </h2>
            <a
              href="https://github.com/PabbisettySivaKumar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-100 transition-colors"
            >
              All projects on GitHub
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => {
            const Icon = p.icon;
            const Wrapper = p.href ? "a" : "div";
            const linkProps = p.href
              ? { href: p.href, target: "_blank" as const, rel: "noreferrer" }
              : {};
            return (
              <Wrapper
                key={p.title}
                {...linkProps}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group relative rounded-xl border border-stone-800 bg-[#111110] p-6 overflow-hidden hover:border-amber-500/40 transition-all"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-md bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:border-amber-500/40 group-hover:bg-amber-500/5 transition-colors">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-stone-600">
                      /{p.code}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-100 mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed mb-5">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[11px] font-mono text-stone-400 rounded-full border border-stone-800 bg-black/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.href ? (
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-200 group-hover:text-amber-400 transition-colors">
                      View on GitHub
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500">
                      Company project
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
