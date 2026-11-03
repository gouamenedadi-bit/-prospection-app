"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { NAV_ITEMS, NavItem, resolveHref } from "@/lib/navItems";

const ROLE_LABELS: Record<string, string> = {
  partenaire: "Partenaire",
  stockiste: "Stockiste",
  admin: "Administrateur",
};

const ADMIN_ITEM: NavItem = {
  id: "admin",
  href: "/admin",
  label: "Administration",
  icon: (
    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4" />
    </svg>
  ),
};

function initials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/**
 * Colonne de navigation sur ordinateur (≥ 1024 px).
 * La rubrique ouverte forme un onglet crème qui rejoint la page, comme un intercalaire.
 */
export default function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const name = session?.user?.name;

  // L'admin n'a pas de profil membre : sa rubrique « Administration » remplace « Profil ».
  const items = NAV_ITEMS.filter((i) => !(role === "admin" && i.id === "profile")).map((i) => ({ ...i, href: resolveHref(i, role) }));
  if (role === "admin") items.push(ADMIN_ITEM);

  // La rubrique la plus précise gagne (ex. /dashboard/stockiste plutôt que /dashboard).
  const matches = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const activeHref = items
    .map((i) => i.href)
    .filter(matches)
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside className="hidden lg:flex flex-col w-[248px] shrink-0 sticky top-0 h-screen bg-forest text-cream pl-4 py-6">
      <a
        href="/dashboard"
        className="flex items-center gap-3 mr-4 px-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span className="w-10 h-10 rounded-xl bg-gold text-forest-deep flex items-center justify-center font-heading text-xl leading-none" aria-hidden="true">
          L
        </span>
        <span className="leading-tight">
          <span className="block font-heading text-[21px]">Prospection</span>
          <span className="block text-xs text-cream/60">Longrich en Côte d&apos;Ivoire</span>
        </span>
      </a>

      <nav aria-label="Navigation principale" className="mt-9 flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 h-11 pl-3 pr-4 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset ${
                    active
                      ? "bg-cream text-forest font-bold rounded-l-xl"
                      : "text-cream/70 hover:text-cream hover:bg-white/[0.06] rounded-xl mr-4"
                  }`}
                >
                  <span className={active ? "text-palm" : ""}>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mr-4 mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <span className="w-10 h-10 rounded-full bg-gold-light text-forest-deep flex items-center justify-center text-sm font-bold shrink-0" aria-hidden="true">
            {initials(name)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-semibold truncate">{name ?? "Mon compte"}</span>
            <span className="block text-xs text-cream/60">{role ? ROLE_LABELS[role] ?? role : ""}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-3 w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm text-cream/70 hover:text-cream hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
