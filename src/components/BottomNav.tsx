"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = { id: string; href: string; label: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Accueil",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    ),
  },
  {
    id: "health",
    href: "/health",
    label: "Soins",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
    ),
  },
  {
    id: "grades",
    href: "/grades",
    label: "Grades",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
    ),
  },
  {
    id: "compensation",
    href: "/compensation",
    label: "Compensation",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
    ),
  },
  {
    id: "products",
    href: "/stockiste/products",
    label: "Produits",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
    ),
  },
  {
    id: "stockistes",
    href: "/stockistes",
    label: "Stockistes",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    ),
  },
  {
    id: "profile",
    href: "/dashboard/stockiste",
    label: "Profil",
    icon: (
      <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    ),
  },
];

const STORAGE_KEY = "prospection_nav_order_v1";
const DEFAULT_ORDER = NAV_ITEMS.map((i) => i.id);
const ROW_HEIGHT = 60;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

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

  const getNavClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center min-w-[4.5rem] flex-1 transition-all duration-300 ${
      isActive ? "text-forest scale-110 font-bold drop-shadow-sm" : "text-ink-soft hover:text-forest"
    }`;
  };

  return (
    <>
      <nav className="bg-white border-t border-line sticky bottom-0 z-50">
        <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar{display:none;}` }} />
        <div className="flex overflow-x-auto no-scrollbar gap-1 px-2 items-center h-16 text-[10px]" style={{ scrollbarWidth: "none" }}>
          {orderedItems.map((item) => (
            <a key={item.id} href={item.href} className={getNavClass(item.href)}>
              {item.icon}
              <span className="truncate w-full text-center">{item.label}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={() => setShowCustomize(true)}
            className="flex flex-col items-center justify-center min-w-[3.5rem] flex-1 text-ink-soft/50 hover:text-forest transition-all"
            aria-label="Personnaliser le menu"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="truncate w-full text-center">Menu</span>
          </button>
        </div>
      </nav>

      {showCustomize && (
        <CustomizeSheet
          items={orderedItems}
          onClose={() => setShowCustomize(false)}
          onChange={persist}
          onReset={() => persist(DEFAULT_ORDER)}
        />
      )}
    </>
  );
}

function CustomizeSheet({
  items,
  onClose,
  onChange,
  onReset,
}: {
  items: NavItem[];
  onClose: () => void;
  onChange: (order: string[]) => void;
  onReset: () => void;
}) {
  const [localItems, setLocalItems] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(0);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    setDraggingId(id);
    setDragY(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return;
    const delta = e.clientY - startYRef.current;
    setDragY(delta);

    const currentIndex = localItems.findIndex((i) => i.id === draggingId);
    const targetIndex = clamp(currentIndex + Math.round(delta / ROW_HEIGHT), 0, localItems.length - 1);
    if (targetIndex !== currentIndex) {
      const next = [...localItems];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, moved);
      setLocalItems(next);
      startYRef.current += (targetIndex - currentIndex) * ROW_HEIGHT;
      setDragY(e.clientY - startYRef.current);
    }
  };

  const handlePointerUp = () => {
    if (draggingId) {
      onChange(localItems.map((i) => i.id));
    }
    setDraggingId(null);
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-2xl shadow-xl p-4 pb-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="w-10 h-1.5 bg-line rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-bold text-ink font-heading mb-1">Personnaliser le menu</h3>
        <p className="text-xs text-ink-soft mb-4">Maintenez et faites glisser une icône pour l'organiser à votre guise.</p>

        <div className="space-y-1.5">
          {localItems.map((item) => {
            const isDragging = item.id === draggingId;
            return (
              <div
                key={item.id}
                onPointerDown={(e) => handlePointerDown(e, item.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  transform: isDragging ? `translateY(${dragY}px) scale(1.02)` : undefined,
                  zIndex: isDragging ? 10 : 1,
                  touchAction: "none",
                  height: ROW_HEIGHT - 8,
                }}
                className={`flex items-center gap-3 px-3 rounded-xl border select-none cursor-grab active:cursor-grabbing relative ${
                  isDragging ? "bg-cream shadow-lg border-forest/30" : "bg-white border-line"
                }`}
              >
                <span className="text-forest">{item.icon}</span>
                <span className="flex-1 font-semibold text-sm text-ink">{item.label}</span>
                <svg className="w-5 h-5 text-ink-soft/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onReset} className="flex-1 text-xs font-bold text-ink-soft py-2.5 rounded-lg border border-line hover:bg-cream transition-colors">
            Réinitialiser
          </button>
          <button onClick={onClose} className="flex-1 text-sm font-bold text-white bg-forest py-2.5 rounded-lg hover:bg-forest-deep transition-colors">
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
}
