"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAYA_HOME_HREF } from "@maya/shared";
import type { GalleryViewer, RecentChat } from "@/lib/gallery/recents";
import { newChatHref, parseChatPath } from "@/lib/house/href";
import { APP_NAV, COPY, navIsActive } from "@/lib/ui-copy";
import { AccountMenu } from "./account-menu";
import { AppShellProvider, useAppShell } from "./app-shell-context";
import { CreditMeter } from "./credit-meter";
import {
  CollapseIcon,
  ExpandIcon,
  MenuIcon,
  NAV_ICONS,
  NewChatIcon,
} from "./nav-icons";
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

function RailSlot({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

function RailBrand({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={MAYA_HOME_HREF}
      onClick={onClick}
      className={`font-display text-cream italic ${
        collapsed ? "text-2xl" : "text-3xl"
      }`}
      aria-label="Maya"
    >
      {collapsed ? "M" : "Maya"}
    </Link>
  );
}

function NavLinks({
  pathname,
  collapsed,
  onClick,
}: {
  pathname: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <nav
      className={`flex shrink-0 flex-col gap-0.5 ${collapsed ? "" : "px-2"}`}
      aria-label="App"
    >
      {APP_NAV.map((item) => {
        const active = navIsActive(item.href, pathname);
        const Icon = NAV_ICONS[item.id];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            aria-label={collapsed ? item.label : undefined}
            className={`flex items-center rounded-md py-1.5 font-sans text-sm font-semibold ${
              collapsed ? "justify-center" : "gap-3 px-2"
            } ${
              active
                ? "bg-rule/60 text-cream"
                : "text-cream-dim hover:bg-rule/40 hover:text-cream"
            }`}
          >
            <RailSlot>
              <Icon />
            </RailSlot>
            {collapsed ? null : item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function NewChatLink({
  pathname,
  collapsed,
  onClick,
}: {
  pathname: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const href = newChatHref(pathname);
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? COPY.newChat : undefined}
      aria-label={collapsed ? COPY.newChat : undefined}
      className={`flex items-center rounded-md py-1.5 font-sans text-sm font-semibold text-cream-dim hover:bg-rule/40 hover:text-cream ${
        collapsed ? "justify-center" : "mx-2 gap-3 px-2"
      }`}
    >
      <RailSlot>
        <NewChatIcon />
      </RailSlot>
      {collapsed ? null : COPY.newChat}
    </Link>
  );
}

function RecentsBlock({
  recents,
  pathname,
  collapsed,
  onNavigate,
}: {
  recents: RecentChat[];
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const chat = parseChatPath(pathname);
  return (
    <div className={`mt-4 min-h-0 flex-1 overflow-y-auto ${collapsed ? "" : "px-2"}`}>
      {collapsed ? null : (
        <p className="px-2 pb-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {COPY.recentChats}
        </p>
      )}
      <RecentChatsList
        recents={recents}
        iconOnly={collapsed}
        activeConversationId={chat.conversationId}
        currentAgentId={chat.agentId}
        onNavigate={onNavigate}
      />
    </div>
  );
}

function RailToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-cream-dim hover:bg-rule/40 hover:text-cream"
      aria-expanded={!collapsed}
      aria-label={collapsed ? COPY.expandRail : COPY.collapseRail}
      onClick={onToggle}
    >
      {collapsed ? <ExpandIcon /> : <CollapseIcon />}
    </button>
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
    <div className="flex h-dvh overflow-hidden bg-night text-cream">
      <aside
        className={`hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-rule motion-reduce:transition-none lg:flex ${
          collapsed ? "w-[72px]" : "w-[268px]"
        } transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]`}
      >
        <div
          className={`shrink-0 ${
            collapsed
              ? "flex flex-col items-center gap-2 py-4"
              : "flex items-center justify-between gap-2 px-4 py-4"
          }`}
        >
          <RailBrand collapsed={collapsed} />
          <RailToggle collapsed={collapsed} onToggle={toggleRail} />
        </div>
        <NavLinks pathname={pathname} collapsed={collapsed} />
        <div className={`mt-1 ${collapsed ? "" : "px-0"}`}>
          <NewChatLink pathname={pathname} collapsed={collapsed} />
        </div>
        <RecentsBlock
          recents={recents}
          pathname={pathname}
          collapsed={collapsed}
        />
        {viewer.credits ? (
          <CreditMeter
            credits={viewer.credits}
            variant="rail"
            collapsed={collapsed}
          />
        ) : null}
        <div
          className={`shrink-0 border-t border-rule py-2 ${
            collapsed ? "px-1" : "px-2"
          }`}
        >
          <AccountMenu
            displayName={viewer.displayName}
            plan={viewer.plan}
            collapsed={collapsed}
            placement="up"
            layout="rail"
          />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {isChat ? null : (
          <header className="flex shrink-0 items-center gap-2 border-b border-rule bg-night px-3 py-1.5 lg:hidden">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-cream"
              aria-label={COPY.menu}
              aria-expanded={menuOpen}
              onClick={openMenu}
            >
              <MenuIcon />
            </button>
            <Link
              href={MAYA_HOME_HREF}
              className="font-display text-2xl text-cream italic"
            >
              Maya
            </Link>
          </header>
        )}
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
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={COPY.menu}
            className="absolute inset-y-0 left-0 flex w-[min(268px,calc(100%-2rem))] flex-col overflow-hidden border-r border-rule bg-night"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <RailBrand collapsed={false} onClick={closeMenu} />
              <button
                type="button"
                className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
                onClick={closeMenu}
              >
                {COPY.close}
              </button>
            </div>
            <NavLinks
              pathname={pathname}
              collapsed={false}
              onClick={closeMenu}
            />
            <NewChatLink
              pathname={pathname}
              collapsed={false}
              onClick={closeMenu}
            />
            <RecentsBlock
              recents={recents}
              pathname={pathname}
              collapsed={false}
              onNavigate={closeMenu}
            />
            {viewer.credits ? (
              <CreditMeter credits={viewer.credits} variant="rail" />
            ) : null}
            <div className="shrink-0 border-t border-rule px-2 py-2">
              <AccountMenu
                displayName={viewer.displayName}
                plan={viewer.plan}
                placement="up"
                layout="rail"
                onNavigate={closeMenu}
              />
            </div>
          </aside>
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
