import { PageHeader } from "@/components/ui";

type Gain = { num: string; title: string; details: string };

const CASH: Gain[] = [
  { num: "1", title: "Vente directe", details: "Bénéfice immédiat sur la vente au détail" },
  { num: "2", title: "Parrainage", details: "Bonus sur l'inscription de nouveaux partenaires" },
  { num: "3", title: "Performance", details: "Bonus calculé sur le volume de groupe" },
  { num: "4", title: "Développement", details: "Prime d'évolution de votre réseau" },
  { num: "5", title: "Leadership", details: "Rémunération sur le succès de vos leaders" },
  { num: "6", title: "Maintenance", details: "Bonus lié à la consommation mensuelle" },
];

const NATURE: Gain[] = [
  { num: "7", title: "Voyages", details: "Des voyages internationaux tous frais payés" },
  { num: "8", title: "Voitures", details: "Des véhicules neufs offerts par la compagnie" },
  { num: "9", title: "Bourse d'étude", details: "Bourse MBA d'une valeur de 30 millions FCFA" },
  { num: "10", title: "Immobilier", details: "Un chèque de 90 millions FCFA pour une villa" },
];

function GainList({ items, tone }: { items: Gain[]; tone: "palm" | "gold" }) {
  return (
    <ul className="card divide-y divide-line/70 overflow-hidden">
      {items.map((g) => (
        <li key={g.num} className="flex items-center gap-3.5 p-3.5">
          <span
            className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-heading text-xl ${
              tone === "palm" ? "bg-palm-light text-palm" : "bg-gold-light text-gold-deep"
            }`}
          >
            {g.num}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink">{g.title}</p>
            <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">{g.details}</p>
          </div>
        </li>
      ))}
    </ul>
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

      <div className="space-y-6">
        <section>
          <div className="flex items-baseline justify-between mb-2.5">
            <h3 className="section-title">Paiement en espèces</h3>
            <span className="font-mono text-[11px] text-ink-soft">Bonus 1 à 6</span>
          </div>
          <GainList items={CASH} tone="palm" />
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-2.5">
            <h3 className="section-title">Récompenses en nature</h3>
            <span className="font-mono text-[11px] text-ink-soft">Bonus 7 à 10</span>
          </div>
          <GainList items={NATURE} tone="gold" />
        </section>
      </div>
    </div>
  );
}
