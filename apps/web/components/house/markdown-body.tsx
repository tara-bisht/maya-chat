import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownBody({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 whitespace-pre-wrap">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
              {children}
            </ol>
          ),
          code: ({ className, children }) => {
            const block = Boolean(className);
            if (block) {
              return (
                <code className="font-mono text-sm text-on-code">{children}</code>
              );
            }
            return (
              <code className="font-mono text-[0.9em]">{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-md bg-code-well p-3 last:mb-0">
              {children}
            </pre>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}
