import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/session";
import { loadLobbyChrome } from "@/lib/gallery/load";
import { AppShellChrome } from "./app-shell-chrome";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const chrome = await loadLobbyChrome(user.id);

  return (
    <AppShellChrome
      viewer={chrome.viewer}
      recents={chrome.recents}
      custom={chrome.custom}
    >
      {children}
    </AppShellChrome>
  );
}
