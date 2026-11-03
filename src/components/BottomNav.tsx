"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ReorderableList from "@/components/ReorderableList";

type NavItem = { id: string; href: string; label: string; short?: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Accueil",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    ),
  },
  {
    id: "health",
    href: "/health",
    label: "Soins",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
    ),
  },
  {
    id: "grades",
    href: "/grades",
    label: "Grades",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
    ),
  },
  {
    id: "compensation",
    href: "/compensation",
    label: "Compensation",
    short: "Gains",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
    ),
  },
  {
    id: "products",
    href: "/stockiste/products",
    label: "Produits",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
    ),
  },
  {
    id: "stockistes",
    href: "/stockistes",
    label: "Stockistes",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    ),
  },
  {
    id: "profile",
    href: "/dashboard/stockiste",
    label: "Profil",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    ),
  },
];

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

export default function BottomNav() {
  const pathname = usePathname();
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    setOrder(loadOrder());
  }, []);

  const persist = (next: string[]) => {
    setOrder(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const orderedItems = order.map((id) => NAV_ITEMS.find((i) => i.id === id)).filter((i): i is NavItem => Boolean(i));
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
      <nav aria-label="Navigation principale" className="bg-white/95 backdrop-blur border-t border-line/70 sticky bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
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
