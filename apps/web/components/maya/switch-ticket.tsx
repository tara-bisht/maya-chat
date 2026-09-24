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
    <div className="mt-3 rounded-xl border border-rule bg-panel px-3 py-3">
      <p className="text-sm leading-relaxed">{reason}</p>
      {resolved ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            className="inline-flex h-9 items-center rounded-lg bg-cream px-3 text-sm font-semibold text-night disabled:opacity-40"
            onClick={onSwitch}
          >
            {chatWithLabel(name)}
          </button>
          <button
            type="button"
            disabled={busy}
            className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-ink-soft hover:text-cream disabled:opacity-40"
            onClick={onKeepGoing}
          >
            {COPY.keepGoingHere}
          </button>
        </div>
      )}
    </div>
  );
}
