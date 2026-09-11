"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Playbill } from "@/lib/gallery/playbill";
import type { GalleryViewer, RecentChat } from "@/lib/gallery/recents";
import {
  APP_NAV,
  COPY,
  MOBILE_NAV,
  greetingName,
  navIsActive,
} from "@/lib/ui-copy";
import { AccountMenu } from "./account-menu";
import { CreditMeter } from "./credit-meter";
import {
  CollapseIcon,
  ExpandIcon,
  MenuIcon,
  NAV_ICONS,
} from "./nav-icons";
import { RecentChatsList } from "./recent-chats";
import { SidebarAgents } from "./your-agents-list";

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
      href="/gallery"
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
            className={`flex items-center rounded-md py-2 font-sans text-sm font-semibold ${
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

function SidebarBody({
  recents,
  custom,
  pathname,
  collapsed,
  showBrand,
  onNavigate,
}: {
  recents: RecentChat[];
  custom: Playbill[];
  pathname: string;
  collapsed: boolean;
  showBrand: boolean;
  onNavigate?: () => void;
}) {
  const gutter = collapsed ? "" : "px-2";

  return (
    <>
      {showBrand ? (
        <div className={`shrink-0 py-4 ${collapsed ? "flex justify-center" : "px-4"}`}>
          <RailBrand collapsed={collapsed} onClick={onNavigate} />
        </div>
      ) : null}
      <NavLinks
        pathname={pathname}
        collapsed={collapsed}
        onClick={onNavigate}
      />
      <div
        className={`mt-4 min-h-0 flex-1 overflow-y-auto pb-4 ${gutter}`}
      >
        {collapsed ? null : (
          <p className="px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
            {COPY.recentChats}
          </p>
        )}
        <div className={collapsed ? "" : "mt-1.5"}>
          <RecentChatsList recents={recents} iconOnly={collapsed} />
        </div>
        {collapsed ? (
          recents.length > 0 && custom.length > 0 ? (
            <div className="mx-3 my-2 h-px bg-rule" aria-hidden />
          ) : null
        ) : (
          <p className="mt-4 px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
            {COPY.yourAgents}
          </p>
        )}
        <div className={collapsed ? "" : "mt-1.5"}>
          <SidebarAgents agents={custom} iconOnly={collapsed} />
        </div>
      </div>
    </>
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

export function AppShellChrome({
  viewer,
  recents,
  custom,
  children,
}: {
  viewer: GalleryViewer;
  recents: RecentChat[];
  custom: Playbill[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const hideCreateCta = pathname.startsWith("/studio/new");

  useEffect(() => {
    setCollapsed(readRailCollapsed());
  }, []);

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
        <SidebarBody
          recents={recents}
          custom={custom}
          pathname={pathname}
          collapsed={collapsed}
          showBrand={false}
        />
        {viewer.credits ? (
          <CreditMeter
            credits={viewer.credits}
            variant="rail"
            collapsed={collapsed}
          />
        ) : null}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b border-rule bg-night px-4 py-3 lg:px-8">
          <Link
            href="/gallery"
            className="font-display text-2xl text-cream italic lg:hidden"
          >
            Maya
          </Link>
          <p className="hidden min-w-0 flex-1 truncate font-display text-2xl text-cream italic lg:block">
            {greetingName(viewer.displayName)}
          </p>
          <div className="ml-auto flex items-center gap-3 lg:gap-6">
            {hideCreateCta ? null : (
              <Link
                href="/studio/new"
                className="hidden h-11 items-center rounded-md bg-acid px-4 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#F6EFE4] hover:bg-acid-hover lg:inline-flex"
              >
                {COPY.createAgent}
              </Link>
            )}
            <AccountMenu displayName={viewer.displayName} plan={viewer.plan} />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-cream lg:hidden"
              aria-label={COPY.menu}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </header>
        <div
          id="maya-stage"
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0"
        >
          {children}
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-rule bg-night lg:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const active = navIsActive(
            item.href === "/studio/new" ? "/studio/new" : item.href,
            pathname,
          );
          const Icon = NAV_ICONS[item.id];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 font-sans text-[11px] font-semibold ${
                active ? "text-cream" : "text-ink-soft"
              }`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-[color:var(--maya-overlay)] lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100%-2rem))] flex-col overflow-y-auto bg-night"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end px-4 pt-4">
              <button
                type="button"
                className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                {COPY.close}
              </button>
            </div>
            <SidebarBody
              recents={recents}
              custom={custom}
              pathname={pathname}
              collapsed={false}
              showBrand
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
