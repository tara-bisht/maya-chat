export function Composer({
  placeholder,
  disabled,
  busy,
  onSend,
}: {
  placeholder: string;
  disabled: boolean;
  busy: boolean;
  onSend: (text: string) => void;
}) {
  return (
    <form
      className="shrink-0 bg-night px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      onSubmit={(event) => {
        event.preventDefault();
        if (disabled || busy) {
          return;
        }
        const form = event.currentTarget;
        const field = form.elements.namedItem("line") as HTMLTextAreaElement;
        const text = field.value.trim();
        if (!text) {
          return;
        }
        field.value = "";
        field.style.height = "";
        onSend(text);
      }}
    >
      <div className="mx-auto flex max-w-measure flex-col rounded-xl border border-rule bg-panel">
        <textarea
          name="line"
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          className="min-h-11 flex-1 resize-none bg-transparent px-3 pt-3 pb-1 text-sm text-cream placeholder:text-ink-soft"
          onInput={(event) => {
            const field = event.currentTarget;
            field.style.height = "auto";
            field.style.height = `${Math.min(field.scrollHeight, 160)}px`;
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <div className="flex items-center justify-end gap-2 px-2 pb-2">
          <button
            type="submit"
            disabled={disabled || busy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream text-night disabled:opacity-40"
            aria-label="Send"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
