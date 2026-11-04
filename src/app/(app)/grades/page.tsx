import { PageHeader } from "@/components/ui";

type Grade = { title: string; level: string; suffix?: string; pv: string; conditions: string };

// Du plus haut au plus bas. La teinte du badge suit la famille de grade.
const GROUPS: { name: string; tone: "gold" | "forest" | "cream"; grades: Grade[] }[] = [
  {
    name: "Directeurs étoilés",
    tone: "gold",
    grades: [
      { title: "Directeur", level: "5", suffix: "étoiles", pv: "60 000 000", conditions: "Min. 3 pieds (1 Dir. 3 étoiles/pied)" },
      { title: "Directeur", level: "4", suffix: "étoiles", pv: "20 000 000", conditions: "Min. 3 pieds (1 Dir. 2 étoiles/pied)" },
      { title: "Directeur", level: "3", suffix: "étoiles", pv: "9 000 000", conditions: "Min. 3 pieds (1 Dir. 1 étoile/pied)" },
      { title: "Directeur", level: "2", suffix: "étoiles", pv: "3 750 000", conditions: "Min. 3 pieds (Diamant 7/pied)" },
      { title: "Directeur", level: "1", suffix: "étoile", pv: "1 500 000", conditions: "Min. 3 pieds (Diamant 6/pied)" },
    ],
  },
  {
    name: "Diamants",
    tone: "forest",
    grades: [
      { title: "Diamant", level: "7", pv: "450 000", conditions: "Min. 3 pieds (Diamant 5/pied)" },
      { title: "Diamant", level: "6", pv: "225 000", conditions: "Min. 2 pieds (Diamant 5/pied)" },
      { title: "Diamant", level: "5", pv: "75 000", conditions: "Min. 2 pieds (Diamant 4/pied)" },
      { title: "Diamant", level: "4", pv: "15 000", conditions: "Min. 2 pieds (Diamant 3/pied)" },
      { title: "Diamant", level: "3", pv: "3 600", conditions: "Min. 2 pieds (Diamant 2/pied)" },
      { title: "Diamant", level: "2", pv: "1 680", conditions: "Aucune" },
      { title: "Diamant", level: "1", pv: "720", conditions: "Aucune" },
    ],
  },
  {
    name: "Pré-diamants",
    tone: "cream",
    grades: [
      { title: "Pré-diamant", level: "2", pv: "240", conditions: "Aucune" },
      { title: "Pré-diamant", level: "1", pv: "165", conditions: "Aucune" },
    ],
  },
];

const BADGE: Record<string, string> = {
  gold: "bg-gold text-forest-deep",
  forest: "bg-forest text-cream",
  cream: "bg-cream-deep text-ink",
};
const ACCENT: Record<string, string> = { gold: "accent-gold", forest: "accent-forest", cream: "accent-palm" };
const DOT: Record<string, string> = { gold: "bg-gold", forest: "bg-forest", cream: "bg-palm" };

export default function GradesCompensations() {
  let order = 0; // position de chaque carte pour l'entrée en cascade
  return (
    <div>
      <PageHeader
        eyebrow="Évolution"
        title="Grades Longrich"
        lead="Le volume de points (PV) et les conditions sur vos pieds pour atteindre chaque grade."
      />

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <section key={group.name}>
            <h3 className="flex items-center gap-2.5 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${DOT[group.tone]}`} aria-hidden="true" />
              <span className="font-heading text-xl text-orange">{group.name}</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span className="text-xs text-ink-soft">{group.grades.length} grades</span>
            </h3>
            <ol className="space-y-2.5">
              {group.grades.map((g) => {
                const noCondition = g.conditions === "Aucune";
                const i = order++;
                return (
                  <li
                    key={`${g.title}-${g.level}`}
                    className={`card lift-card ${ACCENT[group.tone]} rise-in flex items-center gap-3.5 p-3.5 pl-4`}
                    style={{ ["--i" as string]: i } as React.CSSProperties}
                  >
                    <div className={`lift-badge w-14 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center shadow-sm ${BADGE[group.tone]}`}>
                      <span className="font-heading text-2xl leading-none">{g.level}</span>
                      {g.suffix && <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-80">{g.suffix}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-[16px] font-semibold text-ink">
                        {g.title} {g.level}{g.suffix ? ` ${g.suffix}` : ""}
                      </p>
                      <p className={`text-xs mt-0.5 ${noCondition ? "text-ink-soft/70" : "text-ink-soft"}`}>
                        {noCondition ? "Aucune condition de pieds" : g.conditions}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-semibold text-forest tabular-nums">{g.pv}</p>
                      <p className="font-mono text-[12px] text-ink-soft tracking-wider">PV</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
