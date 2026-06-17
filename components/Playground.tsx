"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, ChevronDown, FileText, Send } from "lucide-react";
import { Message, suggestions, mockAnswers, defaultAnswer } from "@/app/data/portfolio";

export default function Playground() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Ask me anything about Siva's experience, projects, or skills.",
      sources: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content, sources: null }]);
    setStreaming(true);

    const payload = mockAnswers[content] ?? defaultAnswer;
    let i = 0;
    const full = payload.answer;
    setMessages((m) => [...m, { role: "assistant", content: "", sources: null }]);
    const step = () => {
      i += Math.max(2, Math.round(full.length / 90));
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, content: full.slice(0, i) };
        return copy;
      });
      if (i < full.length) {
        setTimeout(step, 18);
      } else {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: full,
            sources: payload.sources,
          };
          return copy;
        });
        setStreaming(false);
        setSourcesOpen(true);
      }
    };
    setTimeout(step, 180);
  }

  return (
    <section id="playground" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div data-reveal className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-3">
              <span className="w-6 h-px bg-amber-500/70" />
              Playground
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-100 max-w-2xl leading-tight">
              Ask my portfolio anything.
            </h2>
            <p className="mt-3 text-stone-400 max-w-xl">
              A live RAG demo over my resume, projects, and notes. Click a
              prompt or type your own.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-500 px-3 py-1.5 rounded-full border border-stone-800 bg-stone-900/40">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            LangChain · Neo4j · Gemini
          </div>
        </div>

        <div
          data-reveal
          className="rounded-2xl border border-stone-800 bg-[#111110] overflow-hidden shadow-[0_30px_80px_-40px_rgba(245,158,11,0.25)]"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-stone-800 bg-stone-950/60">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              </div>
              <span className="ml-2 text-xs font-mono text-stone-500">
                ~/ask-siva <span className="text-amber-500">$</span> portfolio.query
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-500/90">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
              connected
            </div>
          </div>

          <div className="chat-scroll max-h-[460px] overflow-y-auto px-5 sm:px-7 py-6 space-y-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center shadow-[0_0_18px_-4px_rgba(245,158,11,0.8)]">
                    <Bot className="w-4 h-4 text-stone-950" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-stone-800/60 border border-stone-700 text-stone-100"
                      : "bg-stone-950/60 border border-stone-800 text-stone-200"
                  }`}
                >
                  <span
                    className={
                      streaming && i === messages.length - 1 && m.role === "assistant" ? "caret" : ""
                    }
                  >
                    {m.content}
                  </span>

                  {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-800">
                      <button
                        onClick={() => setSourcesOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        Retrieved sources ({m.sources.length})
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${sourcesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {sourcesOpen && (
                        <div className="mt-3 space-y-2">
                          {m.sources.map((s, si) => (
                            <div
                              key={si}
                              className="rounded-md border border-stone-800 bg-black/40 p-3"
                            >
                              <div className="flex items-center gap-2 text-[11px] font-mono text-amber-500/90 mb-1">
                                <FileText className="w-3 h-3" />
                                {s.title}
                              </div>
                              <p className="text-xs text-stone-400 leading-relaxed">
                                {s.snippet}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-stone-800 border border-stone-700 flex items-center justify-center">
                    <span className="text-xs font-semibold text-stone-300">You</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="px-5 sm:px-7 pb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={streaming}
                className="text-xs px-3 py-1.5 rounded-full border border-stone-800 bg-stone-900/40 text-stone-300 hover:bg-stone-900 hover:border-amber-500/40 hover:text-stone-100 disabled:opacity-50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="px-5 sm:px-7 pb-5 pt-2 border-t border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 rounded-md border border-stone-800 bg-black/50 focus-within:border-amber-500/50 focus-within:bg-black/70 transition-all px-4 py-2.5"
            >
              <span className="font-mono text-sm text-amber-500">&gt;</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder="ask about projects, stack, availability…"
                className="flex-1 bg-transparent outline-none text-sm text-stone-100 placeholder:text-stone-600 font-mono"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="flex items-center justify-center w-9 h-9 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="mt-2 text-[11px] font-mono text-stone-600">
              prototype · mock responses · real version runs LangChain + Neo4j + Gemini
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
