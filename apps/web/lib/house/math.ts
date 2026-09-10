/**
 * remark-math only understands `$` / `$$`. Models also emit `\(...\)`,
 * `\[...\]`, and mixed wrappers like `$\(...\)$`. Normalize those
 * dialects before markdown parse. Fenced and inline code is left alone.
 */
export function normalizeMathMarkdown(text: string): string {
  return mapOutside(text, /(```[\s\S]*?```|~~~[\s\S]*?~~~)/, (chunk) =>
    mapOutside(chunk, /(`[^`\n]+`)/, normalizeMathDelimiters),
  );
}

function mapOutside(
  text: string,
  pattern: RegExp,
  transform: (chunk: string) => string,
): string {
  return text
    .split(pattern)
    .map((part, index) => (index % 2 === 1 ? part : transform(part)))
    .join("");
}

function normalizeMathDelimiters(text: string): string {
  let out = text;

  out = out.replace(/\$\$\s*\\\[/g, () => "$$");
  out = out.replace(/\\\]\s*\$\$/g, () => "$$");
  out = out.replace(/\$\s*\\\(/g, () => "$(");
  out = out.replace(/\\\)\s*\$/g, () => ")$");
  out = out.replace(/\\\[([\s\S]*?)\\\]/g, (_match, body: string) => `$$${body}$$`);
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_match, body: string) => `$${body}$`);
  out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_match, body: string) => {
    const trimmed = body.trim();
    return trimmed ? `\n$$\n${trimmed}\n$$\n` : _match;
  });

  return out;
}
