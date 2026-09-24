"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAYA_HOME_HREF } from "@maya/shared";
import type { GalleryViewer, RecentChat } from "@/lib/gallery/recents";
import { newChatHref, parseChatPath } from "@/lib/house/href";
import { APP_NAV, COPY, navIsActive } from "@/lib/ui-copy";
import { AccountMenu } from "./account-menu";
import { AppShellProvider, useAppShell } from "./app-shell-context";
import { CreditMeter } from "./credit-meter";
import { CollapseIcon, ExpandIcon, MenuIcon, NAV_ICONS } from "./nav-icons";
import { RecentChatsList } from "./recent-chats";

const RAIL_STORAGE_KEY = "maya.navRail";

function readRailCollapsed(): boolean {
  try {
    return window.localStorage.getItem(RAIL_STORAGE_KEY) === "collapsed";
  } catch {
    return false;
  }
}

function writeRailCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(
      RAIL_STORAGE_KEY,
      collapsed ? "collapsed" : "expanded",
    );
  } catch {
    // Private mode and blocked storage should not break the rail.
  }
}

function RailMark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href={MAYA_HOME_HREF}
      onClick={onClick}
      aria-label="Maya"
      className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-cream text-sm font-semibold text-night"
    >
      M
    </Link>
  );
}

function IconNav({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <nav className="flex w-full flex-col" aria-label="App">
      {APP_NAV.filter((item) => item.id !== "profile").map((item) => {
        const active = navIsActive(item.href, pathname);
        const Icon = NAV_ICONS[item.id];
        const label = item.id === "create" ? "Create" : item.label;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            title={item.label}
            aria-label={item.label}
            className={`flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium ${
              active ? "text-cream" : "text-ink-soft hover:text-cream"
            }`}
          >
            <Icon />
            <span className="leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function ChatsColumn({
  recents,
  pathname,
  viewer,
  collapsed,
  onToggle,
  onNavigate,
}: {
  recents: RecentChat[];
  pathname: string;
  viewer: GalleryViewer;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const chat = parseChatPath(pathname);
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return recents;
    }
    return recents.filter((item) =>
      `${item.title} ${item.agentName}`.toLowerCase().includes(needle),
    );
  }, [query, recents]);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-rule bg-panel">
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <h2 className="font-sans text-sm font-semibold">{COPY.chats}</h2>
        {onToggle ? (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-soft hover:bg-raised hover:text-cream"
            aria-expanded={!collapsed}
            aria-label={collapsed ? COPY.expandRail : COPY.collapseRail}
            onClick={onToggle}
          >
            {collapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        ) : null}
      </div>
      <div className="px-3 pb-2">
        <Link
          href={newChatHref(pathname)}
          onClick={onNavigate}
          className="flex h-9 w-full items-center justify-center rounded-lg bg-cream text-sm font-semibold text-night hover:bg-acid-hover"
        >
          {COPY.newChat}
        </Link>
      </div>
      <label className="mx-3 mb-2 flex h-9 items-center rounded-lg border border-rule bg-night px-2.5">
        <span className="sr-only">Search chats</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search chats"
          className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-ink-soft"
        />
      </label>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <RecentChatsList
          recents={shown}
          empty={query.trim() ? "No chat matches that." : undefined}
          activeConversationId={chat.conversationId}
          currentAgentId={chat.agentId}
          onNavigate={onNavigate}
        />
      </div>
      {viewer.credits ? (
        <CreditMeter credits={viewer.credits} variant="rail" />
      ) : null}
    </aside>
  );
}

function ShellInner({
  viewer,
  recents,
  children,
}: {
  viewer: GalleryViewer;
  recents: RecentChat[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { menuOpen, closeMenu, openMenu } = useAppShell();
  const [collapsed, setCollapsed] = useState(false);
  const isChat = pathname.startsWith("/chat");

  useEffect(() => {
    setCollapsed(readRailCollapsed());
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    function onResize() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        closeMenu();
      }
    }

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, closeMenu]);

  function toggleRail() {
    setCollapsed((current) => {
      const next = !current;
      writeRailCollapsed(next);
      return next;
    });
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-night text-cream">
      <aside className="hidden h-full w-[72px] shrink-0 flex-col items-center border-r border-rule bg-night py-3 lg:flex">
        <RailMark />
        <IconNav pathname={pathname} />
        <div className="flex-1" />
        <div className="w-full px-2 pb-1">
          <AccountMenu
            displayName={viewer.displayName}
            plan={viewer.plan}
            collapsed
            placement="up"
            layout="rail"
          />
        </div>
      </aside>

      {collapsed ? null : (
        <div className="hidden h-full w-[286px] shrink-0 lg:block">
          <ChatsColumn
            recents={recents}
            pathname={pathname}
            viewer={viewer}
            collapsed={collapsed}
            onToggle={toggleRail}
          />
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {isChat ? null : (
          <header className="flex shrink-0 items-center gap-2 border-b border-rule bg-night px-3 py-2 lg:hidden">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-cream"
              aria-label={COPY.menu}
              aria-expanded={menuOpen}
              onClick={openMenu}
            >
              <MenuIcon />
            </button>
            <Link href={MAYA_HOME_HREF} className="text-sm font-semibold">
              Maya
            </Link>
          </header>
        )}
        {collapsed ? (
          <button
            type="button"
            className="absolute top-3 left-[84px] z-20 hidden h-8 items-center rounded-md px-2 text-xs text-ink-soft hover:bg-raised hover:text-cream lg:flex"
            onClick={toggleRail}
          >
            {COPY.chats}
          </button>
        ) : null}
        <div
          id="maya-stage"
          className={`min-h-0 min-w-0 flex-1 ${
            isChat
              ? "flex flex-col overflow-hidden"
              : "overflow-x-hidden overflow-y-auto"
          }`}
        >
          {children}
        </div>
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-[color:var(--maya-overlay)] lg:hidden"
          onClick={closeMenu}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={COPY.menu}
            className="absolute inset-y-0 left-0 flex w-[min(22rem,100%)] overflow-hidden bg-night"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex w-[72px] shrink-0 flex-col items-center border-r border-rule py-3">
              <RailMark onClick={closeMenu} />
              <IconNav pathname={pathname} onClick={closeMenu} />
              <div className="flex-1" />
              <button
                type="button"
                className="px-1 pb-2 text-[10px] text-ink-soft"
                onClick={closeMenu}
              >
                {COPY.close}
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <ChatsColumn
                recents={recents}
                pathname={pathname}
                viewer={viewer}
                collapsed={false}
                onNavigate={closeMenu}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AppShellChrome({
  viewer,
  recents,
  children,
}: {
  viewer: GalleryViewer;
  recents: RecentChat[];
  children: ReactNode;
}) {
  return (
    <AppShellProvider>
      <ShellInner viewer={viewer} recents={recents}>
        {children}
      </ShellInner>
    </AppShellProvider>
  );
}
