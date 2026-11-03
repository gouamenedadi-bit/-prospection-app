"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pathologiesList } from "@/data/pathologies";
import { getProducts } from "@/app/actions/products";
import { PageHeader } from "@/components/ui";

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

  const q = query.trim().toLowerCase();
  const sortedPathologies = [...pathologiesList]
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }))
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));

  return (
    <div>
      <PageHeader
        eyebrow="Guide conseil"
        title="Soins & bien-être"
        lead="Les pathologies courantes et les produits Longrich recommandés, avec leur posologie."
      />

      <div className="relative mb-5">
        <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher une maladie ou un symptôme"
          placeholder="Rechercher une maladie ou un symptôme"
          className="input pl-11"
        />
      </div>

      {sortedPathologies.length === 0 && (
        <div className="card p-6 text-center text-sm text-ink-soft">
          Aucune pathologie ne correspond à « <span className="font-semibold text-ink">{query}</span> ». Essayez un autre mot, par exemple « tension » ou « fatigue ».
        </div>
      )}

      <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:items-start">
        {sortedPathologies.map((pathology) => {
          const isOpen = openId === pathology.id;
          return (
          <div key={pathology.id} className={`card overflow-hidden transition-colors ${isOpen ? "border-palm/30" : ""}`}>
            <button
              type="button"
              onClick={() => toggleAccordion(pathology.id)}
              aria-expanded={isOpen}
              className="w-full p-4 flex items-start justify-between gap-3 text-left hover:bg-cream/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
            >
              <div className="min-w-0">
                <h3 className="font-bold text-ink text-[15px]">{pathology.name}</h3>
                <p className="text-[13px] text-ink-soft mt-1 leading-relaxed">{pathology.description}</p>
              </div>
              <span className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-palm text-cream rotate-180" : "bg-palm-light text-palm"}`} aria-hidden="true">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M19 9l-7 7-7-7"></path></svg>
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
                <div className="note">
                  <span className="note-label">Posologie globale</span>
                  <p className="text-sm text-ink leading-relaxed">{pathology.posology}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-ink-soft mb-2">Produits recommandés · {pathology.products.length}</h4>
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
                          className={`rounded-xl border border-line bg-white p-3 flex gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${isClickable ? "cursor-pointer hover:border-palm/40" : ""}`}
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
                              <h5 className="font-semibold text-ink text-[13px] leading-snug">{prod.name}</h5>
                              <span className="pv-stamp">{prod.pv}<span className="text-[9px] tracking-wider">PV</span></span>
                            </div>
                            <p className="font-mono text-[12px] mt-1.5 tabular-nums">
                              <span className="text-forest font-semibold">{fcfa(prod.partner)} F</span>
                              <span className="text-ink-soft"> partenaire · {fcfa(prod.public)} F public</span>
                            </p>
                            <p className="text-[12px] text-ink-soft mt-1.5 leading-relaxed">{prod.dosage}</p>
                            {isClickable && (
                              <span className="text-xs font-bold text-palm mt-2 inline-flex items-center gap-1">Voir la fiche produit <span aria-hidden="true">→</span></span>
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
    </div>
  );
}
