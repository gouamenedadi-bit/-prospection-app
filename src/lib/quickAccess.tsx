import React from "react";

export type QuickAccessItem = { id: string; href: string; label: string; icon: React.ReactNode };

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: "products",
    href: "/stockiste/products",
    label: "Liste des produits",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
    ),
  },
  {
    id: "stockistes",
    href: "/stockistes",
    label: "Stockistes",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    ),
  },
  {
    id: "health",
    href: "/health",
    label: "Soins & Bien-être",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
    ),
  },
  {
    id: "formations",
    href: "/stockiste/formations",
    label: "Formations",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
    ),
  },
  {
    id: "grades",
    href: "/grades",
    label: "Grades",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
    ),
  },
  {
    id: "compensation",
    href: "/compensation",
    label: "Plan de Compensation",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    ),
  },
];

export const QUICK_ACCESS_STORAGE_KEY = "prospection_quickaccess_order_v1";
export const QUICK_ACCESS_DEFAULT_ORDER = QUICK_ACCESS_ITEMS.map((i) => i.id);

export function loadQuickAccessOrder(): string[] {
  if (typeof window === "undefined") return QUICK_ACCESS_DEFAULT_ORDER;
  try {
    const raw = localStorage.getItem(QUICK_ACCESS_STORAGE_KEY);
    if (!raw) return QUICK_ACCESS_DEFAULT_ORDER;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.length === QUICK_ACCESS_ITEMS.length &&
      QUICK_ACCESS_DEFAULT_ORDER.every((id) => parsed.includes(id))
    ) {
      return parsed;
    }
  } catch {}
  return QUICK_ACCESS_DEFAULT_ORDER;
}

export function saveQuickAccessOrder(order: string[]) {
  localStorage.setItem(QUICK_ACCESS_STORAGE_KEY, JSON.stringify(order));
}

export function orderedQuickAccessItems(order: string[]): QuickAccessItem[] {
  return order.map((id) => QUICK_ACCESS_ITEMS.find((i) => i.id === id)).filter((i): i is QuickAccessItem => Boolean(i));
}
