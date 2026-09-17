"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { MayaPlan } from "@maya/shared";
import { COPY, planHref, planLabel, profileInitial } from "@/lib/ui-copy";
import {
  AgentsIcon,
  PlanIcon,
  ProfileIcon,
  SignOutIcon,
} from "./nav-icons";
import { SignOutButton } from "./sign-out-button";

const MENU_ITEM_CLASS =
  "flex w-full items-center gap-3 px-3 py-2.5 text-left font-sans text-sm font-semibold text-cream hover:bg-rule/40 disabled:opacity-40";

export function AccountMenu({
  displayName,
  plan,
  collapsed = false,
  placement = "down",
  layout = "button",
  onNavigate,
}: {
  displayName: string;
  plan: MayaPlan;
  collapsed?: boolean;
  placement?: "up" | "down";
  layout?: "button" | "rail";
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const href = planHref();
  const planItemLabel = plan === "free" ? COPY.upgrade : COPY.plan;
  const name = displayName.trim() || COPY.profile;

  const placeMenu = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    if (placement === "up") {
      setCoords({
        bottom: window.innerHeight - rect.top + 8,
        left: Math.max(8, rect.left),
      });
      return;
    }
    setCoords({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, [placement]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }
    placeMenu();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onReposition() {
      placeMenu();
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", onReposition);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onReposition);
    };
  }, [open, placeMenu]);

  return (
    <div ref={rootRef} className="relative flex w-full shrink-0 items-center">
      <button
        ref={buttonRef}
        type="button"
        className={
          layout === "rail"
            ? `flex w-full items-center rounded-md py-2 ${
                collapsed ? "justify-center" : "gap-3 px-2"
              } text-left hover:bg-rule/40`
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm leading-none text-night italic"
        }
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={COPY.profile}
        title={collapsed ? name : undefined}
        onClick={toggleMenu}
      >
        {layout === "rail" ? (
          <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm leading-none text-night italic">
              {profileInitial(displayName)}
            </span>
            {collapsed ? null : (
              <span className="min-w-0">
                <span className="block truncate font-sans text-sm font-semibold text-cream">
                  {name}
                </span>
                <span className="block truncate font-sans text-xs text-ink-soft">
                  {planLabel(plan)}
                </span>
              </span>
            )}
          </>
        ) : (
          profileInitial(displayName)
        )}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="fixed z-40 w-56 border border-rule bg-night py-1 shadow-[6px_6px_0_#F6EFE4]"
          style={
            coords
              ? {
                  top: coords.top,
                  bottom: coords.bottom,
                  left: coords.left,
                  right: coords.right,
                }
              : { top: 56, right: 16 }
          }
        >
          <Link
            href="/settings"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            <ProfileIcon />
            {COPY.profile}
          </Link>
          <Link
            href="/settings#your-agents"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            <AgentsIcon />
            {COPY.yourAgents}
          </Link>
          <Link
            href={href}
            role="menuitem"
            className={MENU_ITEM_CLASS}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            <PlanIcon />
            {planItemLabel}
          </Link>
          <SignOutButton className={MENU_ITEM_CLASS} role="menuitem">
            <SignOutIcon />
            {COPY.signOut}
          </SignOutButton>
        </div>
      ) : null}
    </div>
  );
}
