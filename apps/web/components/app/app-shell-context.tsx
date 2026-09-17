"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AboutOpener = {
  agentId: string;
  open: () => void;
};

export type AppShellContextValue = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  setAboutOpener: (agentId: string | null, open: (() => void) | null) => void;
  openAbout: (agentId: string) => boolean;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [about, setAbout] = useState<AboutOpener | null>(null);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const setAboutOpener = useCallback(
    (agentId: string | null, open: (() => void) | null) => {
      setAbout(agentId && open ? { agentId, open } : null);
    },
    [],
  );

  const openAbout = useCallback(
    (agentId: string) => {
      if (about && about.agentId === agentId) {
        about.open();
        return true;
      }
      return false;
    },
    [about],
  );

  const value = useMemo(
    () => ({
      menuOpen,
      openMenu,
      closeMenu,
      setAboutOpener,
      openAbout,
    }),
    [menuOpen, openMenu, closeMenu, setAboutOpener, openAbout],
  );

  return (
    <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>
  );
}

export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell needs AppShellProvider");
  }
  return context;
}
