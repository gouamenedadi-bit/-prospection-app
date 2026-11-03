import { PageHeader } from "@/components/ui";

type Gain = { num: string; title: string; details: string; value?: string; icon: string };

// Icônes au trait (24×24) : chaque bonus est reconnaissable d'un coup d'œil.
const ICONS: Record<string, string> = {
  bag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  userPlus: "M15 19a6 6 0 00-12 0M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  trend: "M3 17l6-6 4 4 8-8M14 7h7v7",
  crown: "M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z",
  refresh: "M4 4v5h5M20 20v-5h-5M5.6 15a7 7 0 0012.4 2M18.4 9A7 7 0 006 7",
  plane: "M10.5 13.5L3 11l1.5-1.5 8 1 4-4.5a2 2 0 013 3l-4.5 4 1 8L15.5 22 13 14.5l-3.5 3V20l-2 1-1-3-3-1 1-2h2.5l3.5-3.5z",
  car: "M5 17h14M5 17a2 2 0 104 0M15 17a2 2 0 104 0M3 17v-5l2-5h14l2 5v5M3 12h18",
  cap: "M12 4L2 9l10 5 10-5-10-5zM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6",
  house: "M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5",
};

const CASH: Gain[] = [
  { num: "1", title: "Vente directe", details: "Bénéfice immédiat sur la vente au détail", icon: "bag" },
  { num: "2", title: "Parrainage", details: "Bonus sur l'inscription de nouveaux partenaires", icon: "userPlus" },
  { num: "3", title: "Performance", details: "Bonus calculé sur le volume de groupe", icon: "chart" },
  { num: "4", title: "Développement", details: "Prime d'évolution de votre réseau", icon: "trend" },
  { num: "5", title: "Leadership", details: "Rémunération sur le succès de vos leaders", icon: "crown" },
  { num: "6", title: "Maintenance", details: "Bonus lié à la consommation mensuelle", icon: "refresh" },
];

const NATURE: Gain[] = [
  { num: "7", title: "Voyages", details: "Des voyages internationaux tous frais payés", icon: "plane" },
  { num: "8", title: "Voitures", details: "Des véhicules neufs offerts par la compagnie", icon: "car" },
  { num: "9", title: "Bourse d'étude", details: "Une bourse pour un MBA", value: "30 millions FCFA", icon: "cap" },
  { num: "10", title: "Immobilier", details: "Un chèque pour l'achat d'une villa", value: "90 millions FCFA", icon: "house" },
];

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function SectionTitle({ title, range, dark = false }: { title: string; range: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h3 className={`font-heading text-[21px] leading-none ${dark ? "text-cream" : "text-ink"}`}>{title}</h3>
      <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-line"}`} aria-hidden="true" />
      <span className={`text-xs ${dark ? "text-cream/60" : "text-ink-soft"}`}>{range}</span>
    </div>
  );
}

export default function CompensationPlanPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Rémunération"
        title="Plan de compensation"
        lead="Les 10 façons d'être rémunéré chez Longrich : 6 bonus en espèces et 4 récompenses en nature."
      />

      <div className="space-y-8">
        {/* Bonus en espèces */}
        <section>
          <SectionTitle title="Paiement en espèces" range="Bonus 1 à 6" />
          <ul className="space-y-2.5 desk:space-y-0 desk:grid desk:grid-cols-2 desk:gap-3">
            {CASH.map((g, i) => (
              <li
                key={g.num}
                className="card lift-card accent-palm rise-in flex items-center gap-4 p-4 pl-5"
                style={{ ["--i" as string]: i } as React.CSSProperties}
              >
                <span className="lift-badge relative w-12 h-12 shrink-0 rounded-2xl bg-palm-light text-palm flex items-center justify-center">
                  <Icon name={g.icon} className="w-6 h-6" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-palm text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {g.num}
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[17px] font-semibold text-forest leading-snug">{g.title}</p>
                  <p className="text-[13px] text-ink-soft mt-0.5 leading-relaxed">{g.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Récompenses en nature : le sommet du plan, sur fond vert forêt */}
        <section className="card-dark p-4 sm:p-5 rise-in relative overflow-hidden" style={{ ["--i" as string]: 6 } as React.CSSProperties}>
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border-[22px] border-gold/10" aria-hidden="true" />
          <div className="relative">
            <SectionTitle title="Récompenses en nature" range="Bonus 7 à 10" dark />
            <p className="text-sm text-cream/70 -mt-1 mb-4 leading-relaxed">
              Les récompenses réservées aux grades les plus élevés du réseau.
            </p>
            <ul className="space-y-2.5 desk:space-y-0 desk:grid desk:grid-cols-2 desk:gap-3">
              {NATURE.map((g, i) => (
                <li
                  key={g.num}
                  className="lift-card accent-gold rise-in rounded-2xl border border-white/10 bg-white/[0.05] flex items-center gap-4 p-4 pl-5"
                  style={{ ["--i" as string]: i + 7 } as React.CSSProperties}
                >
                  <span className="lift-badge relative w-12 h-12 shrink-0 rounded-2xl bg-gold text-forest-deep flex items-center justify-center shadow-[0_6px_18px_-6px_rgb(217_139_43/0.6)]">
                    <Icon name={g.icon} className="w-6 h-6" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-cream text-forest-deep text-[10px] font-bold flex items-center justify-center ring-2 ring-forest-deep">
                      {g.num}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-[17px] font-semibold text-cream leading-snug">{g.title}</p>
                    <p className="text-[13px] text-cream/70 mt-0.5 leading-relaxed">{g.details}</p>
                    {g.value && (
                      <p className="font-mono text-sm font-semibold text-gold mt-1.5 tabular-nums">{g.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
