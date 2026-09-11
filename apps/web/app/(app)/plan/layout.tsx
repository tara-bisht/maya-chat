import { AppShell } from "@/components/app/app-shell";

export default function PlanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
