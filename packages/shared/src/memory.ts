import { z } from "zod";

export const EMBEDDING_MODEL = "openai/text-embedding-3-small";
export const EMBEDDING_DIM = 1024;
export const MEMORY_CONTENT_MAX = 2000;
export const MEMORY_MATCH_COUNT = 8;

const memorySaverSchema = z.object({
  content: z.string(),
});

export type ParseMemorySaverResult =
  | { ok: true; content: string }
  | { ok: false };

export function parseMemorySaverInput(input: unknown): ParseMemorySaverResult {
  const parsed = memorySaverSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }
  const content = parsed.data.content.trim().slice(0, MEMORY_CONTENT_MAX);
  if (!content) {
    return { ok: false };
  }
  return { ok: true, content };
}

export function vectorLiteral(values: number[]): string | null {
  if (values.length !== EMBEDDING_DIM) {
    return null;
  }
  for (const value of values) {
    if (!Number.isFinite(value)) {
      return null;
    }
  }
  return `[${values.join(",")}]`;
}
