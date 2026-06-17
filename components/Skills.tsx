import { skills } from "@/app/data/portfolio";

export default function Skills() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-3">
            <span className="w-6 h-px bg-amber-500/70" />
            Toolkit
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-100 leading-tight">
            Skills &amp; stack.
          </h2>
          <p className="mt-3 text-stone-400 max-w-xl">
            The tools I reach for to ship agentic, observable, and actually
            useful AI systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
                className="group rounded-xl border border-stone-800 bg-[#111110] p-5 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:bg-amber-500/5 group-hover:border-amber-500/30 transition-colors">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-100">{s.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs font-mono text-stone-400 rounded-full border border-stone-800 bg-black/30 group-hover:border-stone-700 group-hover:text-stone-200 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
