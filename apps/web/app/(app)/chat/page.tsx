import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";

export default async function ChatRootPage() {
  await requireUser("/chat");
  redirect("/chat/maya");
}
