"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ReorderableList from "@/components/ReorderableList";
import { NAV_ITEMS, NavItem, resolveHref } from "@/lib/navItems";

const STORAGE_KEY = "prospection_nav_order_v1";
const BAR_SIZE = 4;
const DEFAULT_ORDER = NAV_ITEMS.map((i) => i.id);

function loadOrder(): string[] {
  if (typeof window === "undefined") return DEFAULT_ORDER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ORDER;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === NAV_ITEMS.length && DEFAULT_ORDER.every((id) => parsed.includes(id))) {
      return parsed;
    }
  } catch {}
  return DEFAULT_ORDER;
}

export default function BottomNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    setOrder(loadOrder());
  }, []);

  const persist = (next: string[]) => {
    setOrder(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const orderedItems = order
    .map((id) => NAV_ITEMS.find((i) => i.id === id))
    .filter((i): i is NavItem => Boolean(i))
    .map((i) => ({ ...i, href: resolveHref(i, role) }));
  // Les premiers éléments vont dans la barre ; les autres sont dans « Plus ».
  const barItems = orderedItems.slice(0, BAR_SIZE);
  const moreItems = orderedItems.slice(BAR_SIZE);

  const isActive = (path: string) =>
    pathname === path || (path !== "/dashboard" && pathname.startsWith(path + "/"));
  const moreActive = moreItems.some((i) => isActive(i.href));

  const slotClass = (active: boolean) =>
    `group flex flex-col items-center justify-center gap-1 min-w-0 flex-1 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
      active ? "text-forest font-bold" : "text-ink-soft font-medium hover:text-forest"
    }`;
  const pillClass = (active: boolean) =>
    `flex items-center justify-center w-12 h-7 rounded-full transition-colors ${active ? "bg-palm-light" : "group-hover:bg-cream"}`;

  return (
    <>
      <nav data-bottom-nav aria-label="Navigation principale" className={`bg-white/95 backdrop-blur border-t border-line/70 sticky bottom-0 z-50 pb-[env(safe-area-inset-bottom)] ${className}`}>
        <div className="flex px-1.5 items-stretch h-[68px] text-[11px]">
          {barItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a key={item.id} href={item.href} aria-current={active ? "page" : undefined} className={slotClass(active)}>
                <span className={pillClass(active)}>{item.icon}</span>
                <span className="truncate w-full text-center px-0.5">{item.short ?? item.label}</span>
              </a>
            );
          })}

          <button
            type="button"
            onClick={() => setShowCustomize(true)}
            className={slotClass(moreActive)}
            aria-haspopup="dialog"
            aria-expanded={showCustomize}
          >
            <span className={pillClass(moreActive)}>
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </span>
            <span className="truncate w-full text-center px-0.5">Plus</span>
          </button>
        </div>
      </nav>

      {showCustomize && (
        <MoreSheet
          items={orderedItems}
          moreItems={moreItems}
          isActive={isActive}
          onClose={() => setShowCustomize(false)}
          onChange={persist}
          onReset={() => persist(DEFAULT_ORDER)}
        />
      )}
    </>
  );
}

function MoreSheet({
  items,
  moreItems,
  isActive,
  onClose,
  onChange,
  onReset,
}: {
  items: NavItem[];
  moreItems: NavItem[];
  isActive: (path: string) => boolean;
  onClose: () => void;
  onChange: (order: string[]) => void;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Plus de rubriques">
      <div className="absolute inset-0 bg-forest-deep/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-3xl shadow-xl p-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-line rounded-full mx-auto mb-4" />

        {!editing ? (
          <>
            <h3 className="font-heading text-xl text-ink mb-4">Plus de rubriques</h3>
            <div className="grid grid-cols-3 gap-2">
              {moreItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-xs text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      active ? "border-palm bg-palm-light text-forest font-bold" : "border-line text-ink font-medium hover:bg-cream"
                    }`}
                  >
                    <span className="text-forest">{item.icon}</span>
                    <span className="w-full break-words leading-tight">{item.label}</span>
                  </a>
                );
              })}
            </div>
            <button type="button" onClick={() => setEditing(true)} className="btn-secondary w-full mt-5">
              Personnaliser la barre
            </button>
          </>
        ) : (
          <>
            <h3 className="font-heading text-xl text-ink mb-1">Personnaliser la barre</h3>
            <p className="text-xs text-ink-soft mb-4">
              Faites glisser les rubriques. Les {BAR_SIZE} premières s&apos;affichent dans la barre du bas.
            </p>
            <ReorderableList items={items} onChange={onChange} />
            <div className="flex gap-2 mt-5">
              <button onClick={onReset} className="btn-secondary flex-1">Réinitialiser</button>
              <button onClick={() => setEditing(false)} className="btn-primary flex-1">Terminé</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
