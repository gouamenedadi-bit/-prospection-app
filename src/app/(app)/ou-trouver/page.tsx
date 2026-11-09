"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";
import VoiceSearchButton from "@/components/VoiceSearchButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { whatsappForPhone } from "@/lib/contacts";
import { getTopStocks } from "@/app/actions/inventory";
import { normalize } from "@/lib/fuzzy";
import { placeLabel } from "@/lib/places";

type TopStock = Extract<Awaited<ReturnType<typeof getTopStocks>>, { success: true }>["data"][number];

export default function OuTrouverPage() {
  const [items, setItems] = useState<TopStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  useEffect(() => {
    getTopStocks().then((res) => {
      if (res.success) setItems(res.data);
      else setError(res.error);
      setIsLoading(false);
    });
  }, []);

  const term = normalize(search);
  const shown = term ? items.filter((item) => normalize(item.productName).includes(term)) : items;

  return (
    <div className="space-y-4 pb-4 lg:max-w-2xl lg:mx-auto">
      <PageHeader
        eyebrow="Où trouver"
        title="Trouver un produit"
        lead="Pour chaque produit, le stockiste qui en a le plus en ce moment."
      />

      {error && <div role="alert" className="alert-error">{error}</div>}

      {!error && (
        <div className="sticky top-14 lg:top-0 z-20 -mx-4 px-4 py-2 bg-cream">
          <div className="relative">
            <input
              type="search"
              aria-label="Rechercher un produit"
              placeholder={listening ? "Parlez maintenant…" : "Nom du produit, par exemple café"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`input pr-14 ${listening ? "border-gold ring-2 ring-gold/25" : ""}`}
            />
            <VoiceSearchButton onText={(text) => setSearch(text)} onError={setVoiceError} onListeningChange={setListening} />
          </div>
          {voiceError && <p role="status" className="text-xs mt-1.5 text-clay">{voiceError}</p>}
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-sm text-ink-soft py-12">Recherche des stocks…</p>
      ) : error ? null : items.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-sm text-ink-soft">Aucun stockiste n&apos;a encore indiqué ses quantités. Les produits disponibles apparaîtront ici.</p>
        </div>
      ) : shown.length === 0 ? (
        <div className="card p-6 text-center space-y-2">
          <p className="text-sm text-ink-soft">Aucun stockiste n&apos;a indiqué ce produit en stock pour le moment.</p>
          <a href="/stockistes" className="inline-block text-sm font-bold text-palm">Voir la liste des stockistes</a>
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((item, i) => {
            const place = [item.neighborhood, placeLabel(item.city, item.commune)].filter(Boolean).join(", ");
            const whatsapp = whatsappForPhone(item.phone, `Bonjour, avez-vous toujours ce produit en stock : ${item.productName} ? Je vous ai trouvé sur l'application Prospections Longrich.`);
            return (
              <li key={item.productId} className="card p-4 rise-in" style={{ ["--i" as string]: Math.min(i, 8) } as React.CSSProperties}>
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-cream rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt="" loading="lazy" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-ink-soft/50">{item.productName.slice(0, 3)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[17px] leading-snug text-ink break-words">{item.productName}</h3>
                    <p className="inline-block mt-1.5 rounded-full bg-palm-light text-forest px-3 py-1 text-sm font-bold tabular-nums">
                      {item.quantity.toLocaleString("fr-FR")} en stock
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-line space-y-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[15px] text-ink break-words">{item.stockisteName}</p>
                    {place && <p className="text-[15px] text-ink-soft break-words">{place}</p>}
                  </div>
                  <div className={`grid gap-2 ${whatsapp ? "grid-cols-2" : "grid-cols-1"}`}>
                    <a href={`tel:${item.phone}`} aria-label={`Appeler ${item.stockisteName}`} className="btn-primary">Appeler</a>
                    {whatsapp && <WhatsAppButton href={whatsapp} label="WhatsApp" ariaLabel={`Écrire sur WhatsApp à ${item.stockisteName}`} />}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
