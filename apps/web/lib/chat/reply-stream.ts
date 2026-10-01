import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import type { HostTicket } from "@maya/shared";

type TicketMessage = UIMessage<unknown, { ticket: HostTicket }>;

/** Replay a reply that is already stored, without calling the model again. */
export function storedReplyResponse(input: {
  text: string;
  ticket: HostTicket | null;
}): Response {
  const stream = createUIMessageStream<TicketMessage>({
    execute({ writer }) {
      if (input.text) {
        const id = "stored-text";
        writer.write({ type: "text-start", id });
        writer.write({ type: "text-delta", id, delta: input.text });
        writer.write({ type: "text-end", id });
      }
      if (input.ticket) {
        writer.write({ type: "data-ticket", data: input.ticket });
      }
    },
  });
  return createUIMessageStreamResponse({ stream });
}
