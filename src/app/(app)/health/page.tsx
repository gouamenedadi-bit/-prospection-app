"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pathologiesList } from "@/data/pathologies";
import { getProducts } from "@/app/actions/products";
import { PageHeader } from "@/components/ui";
import VoiceSearchButton from "@/components/VoiceSearchButton";
import { normalize } from "@/lib/fuzzy";

export default function HealthWellness() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(res => {
      if (res.success && res.data) {
        setDbProducts(res.data);
      }
    });
  }, []);

  const getMatchedProduct = (prodName: string) => {
    if (!dbProducts.length) return null;
    const search = prodName.toLowerCase();

    let match = dbProducts.find(p => p.name.toLowerCase() === search || p.name.toLowerCase().includes(search) || search.includes(p.name.toLowerCase()));

    if (!match) {
      if (search.includes("nutriv")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("nutrivrich") && (search.includes("rose") ? p.name.toLowerCase().includes("rose") : p.name.toLowerCase().includes("nutritive")));
      } else if (search.includes("gobelet")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("gobelet"));
      } else if (search.includes("lait de corps")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("lait de corps"));
      } else if (search.includes("savon au charbon")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("bambou"));
      } else if (search.includes("arthro")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("arthro"));
      } else if (search.includes("thé tension")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("tension"));
      } else if (search.includes("parfum de bouche")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("bouche"));
      } else if (search.includes("shampooing")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("shampooing") && !p.name.toLowerCase().includes("bambou"));
      } else if (search.includes("mengqian")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("mengqian"));
      } else if (search.includes("protège slip")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("slip"));
      } else if (search.includes("déodorant")) {
         match = dbProducts.find(p => p.name.toLowerCase().includes("odorant"));
      }
    }
    return match || null;
  };

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const fcfa = (v: unknown) => {
    const n = Number(String(v).replace(/s/g, ""));
    return Number.isFinite(n) && String(v).trim() !== "" ? n.toLocaleString("fr-FR") : String(v);
  };

  const q = normalize(query);
  const sortedPathologies = [...pathologiesList]
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }))
    .filter((p) => !q || normalize(p.name).includes(q) || normalize(p.description).includes(q));

  // Regroupement par première lettre, sans accent (« Éczéma » va sous E).
  const letterOf = (name: string) => name.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
  const groups: { letter: string; items: typeof sortedPathologies }[] = [];
  for (const p of sortedPathologies) {
    const letter = letterOf(p.name);
    const last = groups[groups.length - 1];
    if (last && last.letter === letter) last.items.push(p);
    else groups.push({ letter, items: [p] });
  }
  // Position de chaque carte dans la liste, pour l'entrée en cascade.
  const orderOf = new Map(sortedPathologies.map((p, i) => [p.id, i]));

  const jumpTo = (letter: string) => {
    document.getElementById(`lettre-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Guide conseil"
        title="Soins & bien-être"
        lead="Les pathologies courantes et les produits Longrich recommandés, avec leur posologie."
      />

      {/* Recherche et index A–Z figés sous l'en-tête : seule la liste défile */}
      <div className="sticky top-14 z-30 -mx-4 px-4 pt-2 pb-3 bg-cream/95 backdrop-blur-md desk:top-0 desk:mx-0 desk:px-0 desk:pt-5 desk:-mt-5">
      <div className="relative">
        <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher une maladie ou un symptôme"
          placeholder="Maladie ou symptôme"
          className="input pl-11 pr-14"
        />
        <VoiceSearchButton onText={(text) => setQuery(text)} />
      </div>

      {/* Index A–Z : reste visible pendant le défilement */}
      {groups.length > 1 && (
        <nav
          aria-label="Aller à une lettre"
          className="pt-2.5"
        >
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {groups.map((g) => (
              <button
                key={g.letter}
                type="button"
                onClick={() => jumpTo(g.letter)}
                aria-label={`Lettre ${g.letter}`}
                className="shrink-0 w-8 h-8 rounded-lg bg-white border border-line/80 font-heading text-[15px] text-rouge transition-all duration-200 hover:bg-rouge hover:text-white hover:border-rouge hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {g.letter}
              </button>
            ))}
          </div>
        </nav>
      )}
      </div>

      <p className="text-xs text-ink-soft mt-1 mb-4" aria-live="polite">
        {sortedPathologies.length} pathologie{sortedPathologies.length > 1 ? "s" : ""}
        {q ? ` pour « ${query.trim()} »` : ""}
      </p>

      {sortedPathologies.length === 0 && (
        <div className="card p-6 text-center text-sm text-ink-soft">
          Aucune pathologie ne correspond à « <span className="font-semibold text-ink">{query}</span> ». Essayez un autre mot, par exemple « tension » ou « fatigue ».
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.letter} id={`lettre-${group.letter}`} className="scroll-mt-48 desk:scroll-mt-36" aria-labelledby={`titre-${group.letter}`}>
            <div className="flex items-center gap-3 mb-3">
              <h2 id={`titre-${group.letter}`} className="font-heading text-[34px] leading-none text-rouge">{group.letter}</h2>
              <span className="h-px flex-1 bg-gradient-to-r from-rouge/30 to-transparent" aria-hidden="true" />
              <span className="text-xs text-ink-soft">{group.items.length}</span>
            </div>

            <div className="space-y-3 desk:space-y-0 desk:grid desk:grid-cols-2 desk:gap-3 desk:items-start">
              {group.items.map((pathology) => {
                const isOpen = openId === pathology.id;
                return (
                  <div
                    key={pathology.id}
                    data-open={isOpen}
                    className="card lift-card accent-rouge overflow-hidden rise-in"
                    style={{ ["--i" as string]: orderOf.get(pathology.id) ?? 0 } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(pathology.id)}
                      aria-expanded={isOpen}
                      className="w-full p-4 pl-5 flex items-start justify-between gap-3 text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                    >
                      <div className="min-w-0">
                        <h3 className="font-heading font-semibold text-rouge text-[19px] leading-snug">{pathology.name}</h3>
                        <p className="text-[15px] text-ink-soft mt-1 leading-relaxed">{pathology.description}</p>
                      </div>
                      <span
                        className={`lift-chevron mt-0.5 w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-rouge text-white" : "bg-rouge-light text-rouge"}`}
                        aria-hidden="true"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M19 9l-7 7-7-7"></path></svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pl-5 pb-4 pt-1 space-y-4">
                        <div className="note unfold">
                          <span className="note-label">Posologie globale</span>
                          <p className="text-sm text-ink leading-relaxed">{pathology.posology}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-ink-soft mb-2 unfold">Produits recommandés ({pathology.products.length})</h4>
                          <ul className="space-y-2">
                            {pathology.products.map((prod, idx) => {
                              const matched = getMatchedProduct(prod.name);
                              const imageUrl = matched?.image || null;
                              const isClickable = Boolean(matched);
                              const go = () => router.push(`/stockiste/products/${matched.id}?from=health`);
                              return (
                                <li
                                  key={idx}
                                  onClick={isClickable ? go : undefined}
                                  role={isClickable ? "link" : undefined}
                                  tabIndex={isClickable ? 0 : undefined}
                                  onKeyDown={isClickable ? (e) => { if (e.key === "Enter") go(); } : undefined}
                                  style={{ ["--i" as string]: idx + 1 } as React.CSSProperties}
                                  className={`unfold rounded-xl border border-line bg-white p-3 flex gap-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${isClickable ? "cursor-pointer hover:border-palm/40 hover:shadow-soft hover:-translate-y-0.5" : ""}`}
                                >
                                  <div className="w-14 h-14 bg-cream rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                    {imageUrl ? (
                                      <img src={imageUrl} alt="" className="w-full h-full object-contain" loading="lazy" />
                                    ) : (
                                      <svg className="w-5 h-5 text-ink-soft/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <h5 className="font-semibold text-ink text-[15px] leading-snug">{prod.name}</h5>
                                      <span className="pv-stamp">{prod.pv}<span className="text-[11px] tracking-wider">PV</span></span>
                                    </div>
                                    <p className="font-mono text-[14px] mt-1.5 tabular-nums">
                                      <span className="text-forest font-semibold">{fcfa(prod.partner)} F</span>
                                      <span className="text-ink-soft"> partenaire, {fcfa(prod.public)} F public</span>
                                    </p>
                                    <p className="text-[14px] text-ink-soft mt-1.5 leading-relaxed">{prod.dosage}</p>
                                    {isClickable && (
                                      <span className="text-xs font-bold text-palm mt-2 inline-block">Voir la fiche produit</span>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
