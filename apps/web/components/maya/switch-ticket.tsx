"use client";

import { COPY, chatWithLabel } from "@/lib/ui-copy";

export function SwitchTicket({
  name,
  reason,
  resolved,
  onKeepGoing,
  onSwitch,
  busy = false,
}: {
  name: string;
  reason: string;
  resolved: boolean;
  onKeepGoing: () => void;
  onSwitch: () => void;
  busy?: boolean;
}) {
  return (
    <div className="mt-3 rounded-md bg-cream px-3 py-3 text-night shadow-[4px_4px_0_#FF4D2E]">
      <p className="font-sans text-sm leading-snug">{reason}</p>
      {resolved ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            className="inline-flex h-9 items-center rounded-md bg-acid px-3 font-sans text-sm font-semibold text-on-acid shadow-[3px_3px_0_#14110F]"
            onClick={onSwitch}
          >
            {chatWithLabel(name)}
          </button>
          <button
            type="button"
            disabled={busy}
            className="inline-flex h-9 items-center rounded-md px-3 font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
            onClick={onKeepGoing}
          >
            {COPY.keepGoingHere}
          </button>
        </div>
      )}
    </div>
  );
}
