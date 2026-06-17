import { experience, education } from "@/app/data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-3">
            <span className="w-6 h-px bg-amber-500/70" />
            Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-100 leading-tight">
            Where I&apos;ve been shipping.
          </h2>
        </div>

        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/60 via-stone-700 to-transparent" />
          <div className="space-y-10">
            {experience.map((e, i) => {
              const Icon = e.icon;
              return (
                <div
                  key={i}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                  className="relative"
                >
                  <div
                    className={`absolute -left-[29px] sm:-left-[37px] top-1 w-6 h-6 rounded-full border-2 ${
                      e.current
                        ? "border-amber-500/70 bg-[#0b0b0a]"
                        : "border-stone-700 bg-[#0b0b0a]"
                    } flex items-center justify-center`}
                  >
                    {e.current ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" />
                    ) : (
                      <Icon className="w-3 h-3 text-stone-500" />
                    )}
                  </div>

                  <div className="rounded-xl border border-stone-800 bg-[#111110] p-5 hover:border-stone-700 transition-colors">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                      <h3 className="text-base font-semibold text-stone-100">{e.role}</h3>
                      <span className="text-xs font-mono text-stone-500">{e.period}</span>
                    </div>
                    <p className="text-sm text-amber-500/90 font-medium mb-2">{e.company}</p>
                    <p className="text-sm text-stone-400 leading-relaxed">{e.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div data-reveal className="mb-12 mt-20">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-3">
            <span className="w-6 h-px bg-amber-500/70" />
            Education
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-100 leading-tight">
            Where I studied.
          </h2>
        </div>

        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/60 via-stone-700 to-transparent" />
          <div className="space-y-10">
            {education.map((e, i) => {
              const Icon = e.icon;
              return (
                <div
                  key={i}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                  className="relative"
                >
                  <div className="absolute -left-[29px] sm:-left-[37px] top-1 w-6 h-6 rounded-full border-2 border-stone-700 bg-[#0b0b0a] flex items-center justify-center">
                    <Icon className="w-3 h-3 text-stone-500" />
                  </div>

                  <div className="rounded-xl border border-stone-800 bg-[#111110] p-5 hover:border-stone-700 transition-colors">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                      <h3 className="text-base font-semibold text-stone-100">{e.degree}</h3>
                      <span className="text-xs font-mono text-stone-500">{e.period}</span>
                    </div>
                    <p className="text-sm text-amber-500/90 font-medium">{e.institution}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
