"use client";

import { useEffect, useState } from "react";
import { PageInner } from "./page-frame";

export type GalleryJump = { href: string; label: string };

export function GalleryJumps({ items }: { items: GalleryJump[] }) {
  const [active, setActive] = useState(items[0]?.href ?? "");

  const hrefs = items.map((item) => item.href).join(" ");

  useEffect(() => {
    const hrefList = hrefs.split(" ").filter(Boolean);
    const hash = window.location.hash;
    if (hrefList.includes(hash)) {
      setActive(hash);
    }

    const stage = document.getElementById("maya-stage");

    function sync() {
      const tabs = document.querySelector('[aria-label="On this page"]');
      const offset =
        (tabs instanceof HTMLElement
          ? tabs.getBoundingClientRect().bottom
          : 72) + 24;
      let current = hrefList[0] ?? "";
      for (const href of hrefList) {
        const section = document.getElementById(href.slice(1));
        if (!section) {
          continue;
        }
        if (section.getBoundingClientRect().top <= offset) {
          current = href;
        }
      }
      if (current) {
        setActive(current);
      }
    }

    sync();
    stage?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      stage?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [hrefs]);

  return (
    <div className="sticky top-0 z-10 border-b border-rule bg-night">
      <PageInner>
        <nav aria-label="On this page" className="flex flex-wrap gap-x-6">
          {items.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(item.href)}
                className={`relative py-3 font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase ${
                  isActive
                    ? "text-cream after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-cream"
                    : "text-cream-dim hover:text-cream"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </PageInner>
    </div>
  );
}
