"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { MayaPlan } from "@maya/shared";
import {
  COPY,
  planHref,
  profileInitial,
} from "@/lib/ui-copy";
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
  dense = false,
}: {
  displayName: string;
  plan: MayaPlan;
  dense?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const href = planHref();
  const planItemLabel = plan === "free" ? COPY.upgrade : COPY.plan;

  function placeMenu() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    setCoords({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }

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
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
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
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex shrink-0 items-center gap-2">
      {plan === "free" ? (
        <Link
          href={href}
          className={`font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline ${
            dense ? "hidden lg:inline" : ""
          }`}
        >
          {COPY.upgrade}
        </Link>
      ) : null}
      <button
        ref={buttonRef}
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm leading-none text-night italic"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={COPY.profile}
        onClick={toggleMenu}
      >
        {profileInitial(displayName)}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="fixed z-40 w-56 border border-rule bg-night py-1 shadow-[6px_6px_0_#F6EFE4]"
          style={
            coords
              ? { top: coords.top, right: coords.right }
              : { top: 56, right: 16 }
          }
        >
          <Link
            href="/settings"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            onClick={() => setOpen(false)}
          >
            <ProfileIcon />
            {COPY.profile}
          </Link>
          <Link
            href="/settings#your-agents"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            onClick={() => setOpen(false)}
          >
            <AgentsIcon />
            {COPY.yourAgents}
          </Link>
          <Link
            href={href}
            role="menuitem"
            className={MENU_ITEM_CLASS}
            onClick={() => setOpen(false)}
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
