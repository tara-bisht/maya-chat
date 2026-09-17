import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import type { HostTicket } from "@maya/shared";

type TicketMessage = UIMessage<unknown, { ticket: HostTicket }>;

export function pauseStreamResponse(input: {
  text: string;
  ticket: HostTicket;
}): Response {
  const stream = createUIMessageStream<TicketMessage>({
    execute({ writer }) {
      const id = "pause-text";
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: input.text });
      writer.write({ type: "text-end", id });
      writer.write({ type: "data-ticket", data: input.ticket });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export function switchLine(name: string): string {
  return `${name} is on your agents — they're stronger on this.`;
}

export function addReason(name: string, category: string): string {
  if (category === "learning") {
    return `${name} does this all day.`;
  }
  if (category === "productivity") {
    return `${name} lives in this mess.`;
  }
  return `${name} is built for this.`;
}
