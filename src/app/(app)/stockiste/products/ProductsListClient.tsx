"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VoiceSearchButton from "@/components/VoiceSearchButton";
import { normalize } from "@/lib/fuzzy";

const fcfa = (n: unknown) => (Number(n) || 0).toLocaleString("fr-FR");

export default function ProductsListClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const q = normalize(search);
  const filteredProducts = products.filter(product =>
    !q || normalize(product.name).includes(q) || (product.description && normalize(product.description).includes(q))
  );

  return (
    <div className="space-y-4">
      {/* Recherche figée sous l'en-tête : seule la liste défile */}
      <div className="sticky top-14 z-30 -mx-4 px-4 pt-2 pb-3 bg-cream/95 backdrop-blur-md desk:top-0 desk:mx-0 desk:px-0 desk:pt-5 desk:-mt-5">
      <div className="relative">
        <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher un produit"
          placeholder="Rechercher un produit ou une indication"
          className="input pl-11 pr-14"
        />
        <VoiceSearchButton onText={(text) => setSearch(text)} />
      </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card p-6 text-center text-sm text-ink-soft">
          Aucun produit ne correspond à « <span className="font-semibold text-ink">{search}</span> ». Vérifiez l&apos;orthographe ou cherchez par indication (ex. « tension »).
        </div>
      ) : (
        <ul className="space-y-2.5 desk:space-y-0 desk:grid desk:grid-cols-2 desk:gap-3">
          {filteredProducts.map((product, i) => {
            const go = () => router.push(`/stockiste/products/${product.id}`);
            return (
              <li
                key={product.id}
                onClick={go}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") go(); }}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="card lift-card accent-palm rise-in flex gap-3.5 p-3.5 pl-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="w-[72px] h-[72px] bg-cream rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt="" className="lift-img w-full h-full object-contain" loading="lazy" />
                  ) : (
                    <svg className="w-6 h-6 text-ink-soft/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-[18px] font-semibold text-forest leading-snug line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="pv-stamp">{Number(product.pv || 0).toLocaleString("fr-FR")}<span className="text-[11px] tracking-wider">PV</span></span>
                    {product.posology && <span className="text-[13px] text-ink-soft truncate">{product.posology}</span>}
                  </div>
                  <p className="text-[15px] mt-1.5 tabular-nums">
                    <span className="text-forest font-bold">{fcfa(product.partnerPrice)} F</span>
                    <span className="text-ink-soft"> partenaire, {fcfa(product.publicPrice)} F public</span>
                  </p>
                </div>

                <span className="lift-arrow self-center text-ink-soft/40 text-xl" aria-hidden="true">›</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
