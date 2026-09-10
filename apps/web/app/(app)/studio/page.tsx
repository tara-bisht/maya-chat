import { redirect } from "next/navigation";

export default function StudioIndexPage() {
  redirect("/settings#your-agents");
}
