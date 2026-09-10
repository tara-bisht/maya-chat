# OpenRouter is the sole LLM gateway

Maya Chat needs one secret and many labs. The stack defaulted to Vercel AI Gateway and already allowed OpenRouter as the only replacement. We take that replacement so Grok, Claude, Gemini, Kimi, Qwen, and the rest share one catalog of OpenRouter slugs (`models.gateway_id`).

`@openrouter/sdk` is the typed server client (models list, embeddings later, usage). Chat still uses the Vercel AI SDK (`useChat` / `streamText`) through `@openrouter/ai-sdk-provider` in the chat PR — not a second gateway, and not `@ai-sdk/openai` plus friends. The key is `OPENROUTER_API_KEY` only, server-side only.
