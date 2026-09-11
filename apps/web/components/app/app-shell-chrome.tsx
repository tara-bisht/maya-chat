"use client";

import { useState, type ReactNode } from "react";
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
import { MenuIcon, NAV_ICONS } from "./nav-icons";
import { RecentChatsList } from "./recent-chats";
import { SidebarAgents } from "./your-agents-list";

function NavLinks({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <nav className="flex shrink-0 flex-col gap-0.5 px-2" aria-label="App">
      {APP_NAV.map((item) => {
        const active = navIsActive(item.href, pathname);
        const Icon = NAV_ICONS[item.id];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-md px-2 py-2 font-sans text-sm font-semibold ${
              active ? "bg-rule/60 text-cream" : "text-cream-dim hover:bg-rule/40 hover:text-cream"
            }`}
          >
            <Icon className="shrink-0" />
            {item.label}
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
  onNavigate,
}: {
  recents: RecentChat[];
  custom: Playbill[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="shrink-0 px-4 py-5">
        <Link
          href="/gallery"
          onClick={onNavigate}
          className="font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
      </div>
      <NavLinks pathname={pathname} onClick={onNavigate} />
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-2 pb-6">
        <p className="px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {COPY.recentChats}
        </p>
        <div className="mt-2">
          <RecentChatsList recents={recents} />
        </div>
        <p className="mt-6 px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {COPY.yourAgents}
        </p>
        <div className="mt-2">
          <SidebarAgents agents={custom} />
        </div>
        <p className="mt-3 px-2">
          <Link
            href="/studio/new"
            onClick={onNavigate}
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            {COPY.createAgent}
          </Link>
        </p>
      </div>
    </>
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
  const hideCreateCta = pathname.startsWith("/studio/new");

  return (
    <div className="flex h-dvh overflow-hidden bg-night text-cream">
      <aside className="hidden h-full min-h-0 w-[268px] shrink-0 flex-col border-r border-rule lg:flex">
        <SidebarBody recents={recents} custom={custom} pathname={pathname} />
        {viewer.credits ? (
          <CreditMeter credits={viewer.credits} variant="rail" />
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
          <div className="ml-auto flex items-center gap-3">
            {viewer.credits ? (
              <div className="hidden sm:block">
                <CreditMeter credits={viewer.credits} variant="compact" />
              </div>
            ) : null}
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
              className="flex h-8 w-8 items-center justify-center text-cream lg:hidden"
              aria-label={COPY.menu}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </header>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0">
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
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
