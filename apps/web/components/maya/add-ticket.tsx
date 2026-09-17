"use client";

import { COPY, addAgentLabel, addedAgentLabel, chatWithLabel } from "@/lib/ui-copy";

export function AddTicket({
  name,
  reason,
  added,
  dismissed,
  busy = false,
  onAdd,
  onDismiss,
  onChat,
}: {
  name: string;
  reason: string;
  added: boolean;
  dismissed: boolean;
  busy?: boolean;
  onAdd: () => void;
  onDismiss: () => void;
  onChat: () => void;
}) {
  return (
    <div className="mt-3 rounded-md bg-cream px-3 py-3 text-night shadow-[4px_4px_0_#FF4D2E]">
      <p className="font-sans text-sm leading-snug">
        {added ? addedAgentLabel(name) : reason}
      </p>
      {dismissed && !added ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          {added ? (
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-md bg-acid px-3 font-sans text-sm font-semibold text-on-acid shadow-[3px_3px_0_#14110F]"
              onClick={onChat}
            >
              {chatWithLabel(name)}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                className="inline-flex h-9 items-center rounded-md bg-acid px-3 font-sans text-sm font-semibold text-on-acid shadow-[3px_3px_0_#14110F]"
                onClick={onAdd}
              >
                {addAgentLabel(name)}
              </button>
              <button
                type="button"
                disabled={busy}
                className="inline-flex h-9 items-center rounded-md px-3 font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
                onClick={onDismiss}
              >
                {COPY.notNow}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
