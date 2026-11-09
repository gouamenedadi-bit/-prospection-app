import React from "react";

// Rubriques de navigation, partagées par la barre du bas (téléphone) et la colonne latérale (ordinateur).
export type NavItem = { id: string; href: string; label: string; short?: string; icon: React.ReactNode };

export const NAV_ITEMS: NavItem[] = [
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
    id: "annonces",
    href: "/annonces",
    label: "Annonces",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
    ),
  },
  {
    id: "ou-trouver",
    href: "/ou-trouver",
    label: "Où trouver",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-5.2-5.2M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" /></svg>
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
  {
    id: "abonnement",
    href: "/abonnement",
    label: "Abonnement",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5" strokeWidth="1.75"></rect><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.5 10h19M6.5 15h4"></path></svg>
    ),
  },
];

/** Rubriques réservées aux membres (l'administrateur ne s'abonne pas). */
export const MEMBER_ONLY_IDS = ["abonnement"];

/** Le bouton Profil mène à l’espace qui correspond au type de compte. */
export function resolveHref(item: NavItem, role?: string) {
  if (item.id !== "profile") return item.href;
  if (role === "partenaire") return "/dashboard/partner/settings";
  if (role === "admin") return "/admin";
  return item.href;
}
