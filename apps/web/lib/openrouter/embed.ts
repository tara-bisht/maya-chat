import "server-only";

import { EMBEDDING_DIM, EMBEDDING_MODEL, vectorLiteral } from "@maya/shared";
import { getOpenRouter } from "./client";

const EMBED_TIMEOUT_MS = 8_000;

export type EmbedTextResult = { ok: true; vector: string } | { ok: false };

function embeddingFromResponse(payload: unknown): number[] | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  const first = data[0];
  if (!first || typeof first !== "object") {
    return null;
  }
  const embedding = (first as { embedding?: unknown }).embedding;
  if (!Array.isArray(embedding)) {
    return null;
  }
  const values: number[] = [];
  for (const item of embedding) {
    if (typeof item !== "number") {
      return null;
    }
    values.push(item);
  }
  return values.length === EMBEDDING_DIM ? values : null;
}

export async function embedText(text: string): Promise<EmbedTextResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false };
  }

  try {
    const response = await getOpenRouter().embeddings.generate(
      {
        requestBody: {
          model: EMBEDDING_MODEL,
          input: trimmed,
          dimensions: EMBEDDING_DIM,
          encodingFormat: "float",
        },
      },
      { timeoutMs: EMBED_TIMEOUT_MS },
    );
    const body =
      typeof response === "string" ? (JSON.parse(response) as unknown) : response;
    const values = embeddingFromResponse(body);
    if (!values) {
      return { ok: false };
    }
    const vector = vectorLiteral(values);
    if (!vector) {
      return { ok: false };
    }
    return { ok: true, vector };
  } catch {
    return { ok: false };
  }
}

export { embeddingFromResponse };
