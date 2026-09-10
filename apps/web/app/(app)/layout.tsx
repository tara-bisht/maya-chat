import { headers } from "next/headers";
import { safeNextPath } from "@/lib/auth/next";
import { requireUser } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = safeNextPath((await headers()).get("x-maya-pathname"));
  await requireUser(pathname);

  return (
    <div className="h-dvh overflow-hidden bg-night text-cream">
      {children}
    </div>
  );
}
