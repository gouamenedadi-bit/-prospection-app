"use client";

import { useState, useEffect, useRef } from "react";
import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAllStockistes } from "@/app/actions/stockistes";
import { PageHeader } from "@/components/ui";
import WhatsAppButton from "@/components/WhatsAppButton";
import { whatsappForPhone } from "@/lib/contacts";
import VoiceSearchButton from "@/components/VoiceSearchButton";
import { normalize, closestPlace } from "@/lib/fuzzy";
import { CITIES, COMMUNES, placeLabel, realCommune } from "@/lib/places";

function Pin({ active }: { active?: boolean }) {
  return (
    <svg width="30" height="38" viewBox="0 0 30 38" className={`cursor-pointer drop-shadow-md transition-transform ${active ? "scale-110" : "hover:scale-110"}`} aria-hidden="true">
      <path d="M15 37C15 37 28 23.5 28 14A13 13 0 0 0 2 14C2 23.5 15 37 15 37Z" fill="#0C7A4E" stroke="#F6FAF7" strokeWidth="2" />
      <circle cx="15" cy="14" r="5" fill="#EF7B1A" />
    </svg>
  );
}

export default function StockistesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const mapRef = useRef<MapRef>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);

  // La carte doit suivre la taille de son cadre (passage téléphone → ordinateur, rotation…).
  useEffect(() => {
    const box = mapBoxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => mapRef.current?.resize());
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  const [selectedStockiste, setSelectedStockiste] = useState<any>(null);

  const [stockistes, setStockistes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fiche du stockiste : coordonnées seulement, ses quantités ne sont pas publiques
  const [showDetail, setShowDetail] = useState(false);

  // Utilisation de la clé depuis les variables d'environnement
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  useEffect(() => {
    async function loadStockistes() {
      setIsLoading(true);
      const res = await getAllStockistes();
      if (res.success && res.data) {
        setStockistes(res.data.map(s => ({
          ...s,
          location: placeLabel(s.city, s.commune),
          contact: s.phone,
          status: "Ouvert",
          lat: s.latitude || 5.3096,
          lng: s.longitude || -4.0083
        })));
      }
      setIsLoading(false);
    }
    loadStockistes();
  }, []);

  const handleStockisteClick = (stockiste: any) => {
    setSelectedStockiste(stockiste);
    setShowDetail(true);
  };

  // Recherche sans accents ni majuscules. Si rien ne correspond, on essaie la commune ou la ville
  // la plus proche : utile quand la dictée entend « Makori » pour « Marcory ».
  const matches = (st: any, term: string) => {
    const t = normalize(term);
    if (!t) return true;
    const digits = term.replace(/\D/g, "");
    return [st.name, st.city, realCommune(st.commune), st.neighborhood].some((v) => v && normalize(String(v)).includes(t))
      || (digits.length >= 4 && String(st.contact || "").replace(/\D/g, "").includes(digits));
  };
  const directMatches = stockistes.filter((st) => matches(st, searchTerm));
  const placeNames = Array.from(new Set([...COMMUNES.filter((c) => realCommune(c)), ...CITIES, ...stockistes.flatMap((st) => [st.city, realCommune(st.commune), st.neighborhood]).filter(Boolean)]));
  const correctedPlace = searchTerm.trim() && directMatches.length === 0 ? closestPlace(searchTerm, placeNames) : null;
  const filteredStockistes = correctedPlace ? stockistes.filter((st) => matches(st, correctedPlace)) : directMatches;

  return (
    <div className="relative">
      <PageHeader
        eyebrow={isLoading ? "Réseau de distribution" : `Réseau · ${stockistes.length} bureaux`}
        title="Stockistes"
        lead="Trouvez le bureau de distribution le plus proche et appelez-le directement."
      />

      {/* Ordinateur : carte à gauche (fixe pendant le défilement), recherche et liste à droite */}
      <div className="space-y-4 desk:space-y-0 desk:grid desk:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] desk:gap-6 desk:items-start">
        {/* Carte */}
        <div className="sticky top-14 z-20 -mx-4 px-4 pt-1 bg-cream desk:top-5 desk:mx-0 desk:px-0 desk:pt-0 desk:bg-transparent">
        <div ref={mapBoxRef} className="card overflow-hidden relative h-[200px] sm:h-[240px] desk:h-[calc(100vh-15rem)] desk:min-h-[420px]">
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: -4.0083,
              latitude: 5.3096, // Abidjan
              zoom: 11
            }}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={mapboxToken}
          >
            {filteredStockistes.map(stockiste => (
              <Marker
                key={stockiste.id}
                longitude={stockiste.lng}
                latitude={stockiste.lat}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  handleStockisteClick(stockiste);
                }}
              >
                <Pin active={selectedStockiste?.id === stockiste.id} />
              </Marker>
            ))}

            {selectedStockiste && !showDetail && (
              <Popup
                longitude={selectedStockiste.lng}
                latitude={selectedStockiste.lat}
                anchor="top"
                onClose={() => setSelectedStockiste(null)}
                closeOnClick={false}
                className="text-sm"
              >
                <div className="p-1">
                  <h3 className="font-bold text-forest">{selectedStockiste.name}</h3>
                  <p className="text-ink-soft mt-0.5">{placeLabel(selectedStockiste.city, selectedStockiste.commune)}</p>
                  <p className="font-mono text-ink mt-1">{selectedStockiste.contact}</p>
                </div>
              </Popup>
            )}
          </Map>
        </div>
        </div>

        <div className="space-y-4">
        {/* Recherche : reste visible sous la carte ; seule la liste défile */}
        <div className="sticky top-[260px] sm:top-[300px] z-20 -mx-4 px-4 pt-3 pb-3 bg-cream desk:top-0 desk:mx-0 desk:px-0 desk:pt-5 desk:-mt-5">
          <div className="relative">
            <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="search"
              aria-label="Rechercher un stockiste par nom, commune, quartier ou téléphone"
              placeholder={listening ? "Parlez maintenant…" : "Commune, quartier ou nom"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`input pl-11 pr-14 ${listening ? "border-gold ring-2 ring-gold/25" : ""}`}
            />
            <VoiceSearchButton
              onText={(text) => setSearchTerm(text)}
              onError={setVoiceError}
              onListeningChange={setListening}
            />
          </div>
          {(listening || voiceError || correctedPlace) && (
            <p role="status" aria-live="polite" className={`text-xs mt-1.5 ${voiceError ? "text-clay" : "text-ink-soft"}`}>
              {listening
                ? "Je vous écoute… dites une commune ou un quartier, par exemple « Yopougon »."
                : voiceError
                ? voiceError
                : <>Résultats pour <span className="font-bold text-forest">« {correctedPlace} »</span></>}
            </p>
          )}
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="card p-6 text-center text-sm text-ink-soft">Chargement des stockistes…</div>
        ) : filteredStockistes.length > 0 ? (
          <ul className="space-y-2.5">
            {filteredStockistes.map((stockiste, i) => (
              <li key={stockiste.id} className="card lift-card accent-palm rise-in" style={{ ["--i" as string]: i } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => handleStockisteClick(stockiste)}
                  className="w-full flex items-center gap-3 p-4 pl-5 text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                >
                  <span className="lift-badge w-11 h-11 shrink-0 bg-palm-light rounded-xl flex items-center justify-center text-palm" aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-heading font-semibold text-[16px] text-forest truncate">{stockiste.name}</span>
                    <span className="block text-xs text-ink-soft mt-0.5 truncate">{stockiste.location}</span>
                    <span className="block font-mono text-xs text-forest mt-0.5">{stockiste.contact}</span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-palm">Contact <span className="lift-arrow inline-block" aria-hidden="true">›</span></span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card p-6 text-center text-sm text-ink-soft">
            {searchTerm ? (
              <>Aucun stockiste ne correspond à « <span className="font-semibold text-ink">{searchTerm}</span> ». Essayez une autre ville ou commune.</>
            ) : (
              <>Aucun stockiste inscrit pour le moment.</>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Fiche du stockiste */}
      {showDetail && selectedStockiste && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="st-title">
          <div className="absolute inset-0 bg-forest-deep/50 backdrop-blur-[2px]" onClick={() => setShowDetail(false)} />
          <div className="relative bg-cream w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl motion-safe:animate-in motion-safe:slide-in-from-bottom motion-safe:duration-300">
            <div className="bg-forest-deep text-cream px-5 pt-5 pb-4 flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold">Stockiste</p>
                <h3 id="st-title" className="font-heading text-xl mt-1 break-words">{selectedStockiste.name}</h3>
                <p className="text-[15px] text-cream/80 mt-1 break-words">
                  {[normalize(selectedStockiste.neighborhood ?? "") !== normalize(selectedStockiste.commune ?? "") ? selectedStockiste.neighborhood?.trim() : null, selectedStockiste.location].filter(Boolean).join(", ")}
                </p>
              </div>
              <button onClick={() => setShowDetail(false)} aria-label="Fermer" className="p-1.5 -mr-1 rounded-full text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-4 space-y-2.5">
              <a href={`tel:${selectedStockiste.contact}`} className="btn-primary w-full">Appeler le {selectedStockiste.contact}</a>
              {whatsappForPhone(selectedStockiste.contact) && (
                <WhatsAppButton
                  href={whatsappForPhone(selectedStockiste.contact, "Bonjour, je vous contacte depuis l'application Prospections Longrich.")!}
                  label="Écrire sur WhatsApp"
                  ariaLabel={`Écrire sur WhatsApp à ${selectedStockiste.name}`}
                  className="w-full"
                />
              )}
              <a href="/ou-trouver" className="btn-secondary w-full">Chercher un produit</a>
              <button onClick={() => setShowDetail(false)} className="btn-ghost w-full">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
