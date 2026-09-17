"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAYA_HOME_HREF } from "@maya/shared";
import { APP_NAV, COPY, navIsActive } from "@/lib/ui-copy";
import { CollapseIcon, ExpandIcon, NAV_ICONS } from "./nav-icons";

const STORAGE_KEY = "maya.chatNav";

function readCollapsed(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "expanded") {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      collapsed ? "collapsed" : "expanded",
    );
  } catch {
    // Private mode should not break the rail.
  }
}

export function ChatNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setCollapsed(readCollapsed());
  }, []);

  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      writeCollapsed(next);
      return next;
    });
  }

  return (
    <aside
      className={`hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-rule lg:flex ${
        collapsed ? "w-[72px]" : "w-[268px]"
      } transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none`}
    >
      <div
        className={`shrink-0 ${
          collapsed
            ? "flex flex-col items-center gap-2 py-4"
            : "flex items-center justify-between gap-2 px-4 py-4"
        }`}
      >
        <Link
          href={MAYA_HOME_HREF}
          className={`font-display text-cream italic ${
            collapsed ? "text-2xl" : "text-3xl"
          }`}
          aria-label="Maya"
        >
          {collapsed ? "M" : "Maya"}
        </Link>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-cream-dim hover:bg-rule/40 hover:text-cream"
          aria-expanded={!collapsed}
          aria-label={collapsed ? COPY.expandRail : COPY.collapseRail}
          onClick={toggle}
        >
          {collapsed ? <ExpandIcon /> : <CollapseIcon />}
        </button>
      </div>
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
              <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                <Icon />
              </span>
              {collapsed ? null : item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
