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
    <div className="mt-3 rounded-xl border border-rule bg-panel px-3 py-3">
      <p className="text-sm leading-relaxed">
        {added ? addedAgentLabel(name) : reason}
      </p>
      {dismissed && !added ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          {added ? (
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg bg-cream px-3 text-sm font-semibold text-night"
              onClick={onChat}
            >
              {chatWithLabel(name)}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                className="inline-flex h-9 items-center rounded-lg bg-cream px-3 text-sm font-semibold text-night"
                onClick={onAdd}
              >
                {addAgentLabel(name)}
              </button>
              <button
                type="button"
                disabled={busy}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-ink-soft hover:text-cream"
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
