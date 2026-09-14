"use client";

import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";

export function FloatingChatLauncher() {
  return (
    <div className="fixed right-5 bottom-5 z-40 md:right-8 md:bottom-8">
      <Link
        href="/chat/maya"
        aria-label="Open Chat with Maya"
        className="group flex items-center gap-3 rounded-full border-2 border-cream bg-night py-2 pr-4 pl-2 text-cream shadow-[6px_6px_0_#CEFF00] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#FF4D2E] active:translate-y-0"
      >
        <AgentPortrait
          name="Maya"
          costume="maya"
          avatar="/avatars/maya-host.svg"
          size="rail"
        />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-sm font-semibold text-cream italic">
              Maya
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
          </div>
          <div className="font-mono text-[10px] font-bold text-ink-soft uppercase group-hover:text-acid">
            Open Chat ➔
          </div>
        </div>
      </Link>
    </div>
  );
}
