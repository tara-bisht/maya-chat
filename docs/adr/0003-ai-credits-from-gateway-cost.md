# AI credits from gateway cost, not message counts

Plan-gated chat cannot price Claude and Qwen Flash with the same “1 message = 1 turn” counter. We meter **AI credits**: `ceil(OpenRouter usage.cost USD × 10_000)`, reserve-then-settle under the existing advisory lock, and never show dollars in chrome. Unused daily allowance is the margin; a silent monthly cap is the whale fuse. Message caps (`daily_message_limit`) are gone.

**Considered:** ChatGPT-style message caps (ignores 20× cost spread); showing dollars (trains COGS arbitrage); a 2.5× per-token markup on top of a tight cap (double-dips, makes Pro stingy). **Rejected.**
