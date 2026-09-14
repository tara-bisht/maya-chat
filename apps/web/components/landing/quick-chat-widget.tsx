"use client";

import { useState } from "react";
import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";

const SUGGESTED_PROMPTS = [
  {
    kicker: "Persona Match",
    text: "I need someone to ruthlessly roast my procrastination habits.",
    previewReply:
      "Ah, a soul in desperate need of philosophical discipline! Marcus (The Savage Stoic) is waiting in the wings for you. He will roast your excuses to ashes and reframe your locus of control with Epictetian fury. Step inside the theater.",
    targetAgent: "Marcus (marcus-01)",
    href: "/chat/marcus-01",
  },
  {
    kicker: "STEM & Code",
    text: "Can you help me derive the calculus proof for gradient descent?",
    previewReply:
      "Dr. Priya is already scribbling LaTeX on the chalkboard. She pairs rigorous mathematical proofs with playfully flirty banter and code sandboxes. Let me seat you with her.",
    targetAgent: "Dr. Priya (priya-02)",
    href: "/chat/priya-02",
  },
  {
    kicker: "Architecture",
    text: "Review my distributed systems architecture before prod goes down.",
    previewReply:
      "Alex has had four espressos and his pager is already buzzing. Send him your system diagram and he'll tear out the unnecessary message queues before midnight.",
    targetAgent: "Alex (alex-03)",
    href: "/chat/alex-03",
  },
  {
    kicker: "Burnout",
    text: "I worked 14 hours today and forgot to eat lunch.",
    previewReply:
      "Madonna mia! Nonna Maria is already boiling water for pasta. Close your laptop, put a sweater on, and let Nonna scold you back into human health.",
    targetAgent: "Nonna Maria (nonna-04)",
    href: "/chat/nonna-04",
  },
];

export function QuickChatWidget() {
  const [input, setInput] = useState("");
  const [activeReply, setActiveReply] = useState<{
    prompt: string;
    reply: string;
    targetAgent?: string;
    href?: string;
  } | null>(null);

  function handleSelectSuggestion(suggestion: (typeof SUGGESTED_PROMPTS)[number]) {
    setInput(suggestion.text);
    setActiveReply({
      prompt: suggestion.text,
      reply: suggestion.previewReply,
      targetAgent: suggestion.targetAgent,
      href: suggestion.href,
    });
  }

  function handleCustomSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setActiveReply({
      prompt: input.trim(),
      reply: `I hear you! Whether you need cold Stoic logic, pure mathematics, architectural review, or deep conversation, our resident touring company is in character and ready for you. Step into the house to speak with me or your matched character.`,
      targetAgent: "Maya (Resident Host)",
      href: "/chat/maya",
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border-2 border-cream bg-night p-5 shadow-[8px_8px_0_#FF4D2E] md:p-7">
      {/* Widget Header */}
      <div className="flex items-center gap-3 border-b border-rule pb-4">
        <AgentPortrait
          name="Maya"
          costume="maya"
          avatar="/avatars/maya-host.svg"
          size="rail"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-semibold text-cream italic">
              Maya
            </h3>
            <span className="rounded bg-stub px-1.5 py-0.5 font-sans text-[10px] font-extrabold tracking-[0.08em] text-on-stub uppercase">
              Resident Host
            </span>
          </div>
          <p className="truncate font-sans text-xs text-cream-dim">
            Tell me what you&apos;re facing, and I&apos;ll match you with the right mind.
          </p>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mt-4">
        <div className="font-mono text-[11px] font-bold tracking-wider text-ink-soft uppercase">
          Quick Prompts
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((item) => (
            <button
              key={item.kicker}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="rounded border border-cream/30 bg-rule/20 px-2.5 py-1 text-left font-sans text-xs text-cream transition-colors hover:border-acid hover:bg-rule/50"
            >
              <span className="font-mono text-[10px] font-bold text-acid uppercase">
                {item.kicker}:{" "}
              </span>
              <span className="truncate">{item.text.slice(0, 38)}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Preview Well */}
      {activeReply ? (
        <div className="mt-5 rounded-md border border-rule/80 bg-rule/40 p-4">
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 text-sm">🎭</span>
            <div className="text-left">
              <p className="font-sans text-sm leading-relaxed text-cream">
                {activeReply.reply}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={activeReply.href ?? "/chat/maya"}
                  className="inline-flex h-9 items-center justify-center rounded bg-acid px-4 font-sans text-xs font-bold text-cream shadow-[3px_3px_0_#CEFF00] transition-transform hover:-translate-y-0.5"
                >
                  Enter Chat ({activeReply.targetAgent ?? "Maya"}) →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveReply(null);
                    setInput("");
                  }}
                  className="font-sans text-xs text-ink-soft hover:text-cream underline-offset-4 hover:underline"
                >
                  Ask something else
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Input Composer */}
      <form onSubmit={handleCustomSend} className="mt-4">
        <div className="flex items-center gap-2 rounded-md border border-cream/40 bg-rule/20 p-1.5 focus-within:border-acid">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your own question or problem..."
            className="min-w-0 flex-1 bg-transparent px-3 py-1 font-sans text-sm text-cream placeholder:text-ink-soft focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded bg-cream px-3 font-sans text-xs font-bold text-night transition-opacity disabled:opacity-40"
          >
            Ask Maya ↵
          </button>
        </div>
      </form>
    </div>
  );
}
