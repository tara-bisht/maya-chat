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
      className="border-t border-rule bg-night px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
        onSend(text);
      }}
    >
      <div className="mx-auto flex max-w-measure items-end gap-2">
        <textarea
          name="line"
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          className="min-h-11 flex-1 resize-none rounded-md bg-cream-dim px-3 py-2.5 font-sans text-lg text-night placeholder:text-night/40"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || busy}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-acid text-on-acid disabled:opacity-40"
          aria-label="Send"
        >
          <svg
            width="20"
            height="20"
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
    </form>
  );
}
