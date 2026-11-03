"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAllStockistes } from "@/app/actions/stockistes";
import { getStockisteInventory } from "@/app/actions/inventory";
import { PageHeader } from "@/components/ui";

const fcfa = (n: unknown) => (Number(n) || 0).toLocaleString("fr-FR");

function Pin({ active }: { active?: boolean }) {
  return (
    <svg width="30" height="38" viewBox="0 0 30 38" className={`cursor-pointer drop-shadow-md transition-transform ${active ? "scale-110" : "hover:scale-110"}`} aria-hidden="true">
      <path d="M15 37C15 37 28 23.5 28 14A13 13 0 0 0 2 14C2 23.5 15 37 15 37Z" fill="#173B2C" stroke="#F6F2E7" strokeWidth="2" />
      <circle cx="15" cy="14" r="5" fill="#D98B2B" />
    </svg>
  );
}

export default function StockistesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStockiste, setSelectedStockiste] = useState<any>(null);

  const [stockistes, setStockistes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal d'inventaire
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Utilisation de la clé depuis les variables d'environnement
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  useEffect(() => {
    async function loadStockistes() {
      setIsLoading(true);
      const res = await getAllStockistes();
      if (res.success && res.data) {
        setStockistes(res.data.map(s => ({
          ...s,
          location: `${s.city}, ${s.commune}`,
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

  const handleStockisteClick = async (stockiste: any) => {
    setSelectedStockiste(stockiste);
    setShowInventory(true);
    setIsLoadingInventory(true);
    setInventoryItems([]);

    const res = await getStockisteInventory(stockiste.id);
    if (res.success && res.data) {
      setInventoryItems(res.data);
    }
    setIsLoadingInventory(false);
  };

  const filteredStockistes = stockistes.filter(s =>
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.location && s.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.city && s.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.commune && s.commune.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.contact && s.contact.includes(searchTerm))
  );

  return (
    <div className="relative">
      <PageHeader
        eyebrow={isLoading ? "Réseau de distribution" : `Réseau · ${stockistes.length} bureaux`}
        title="Stockistes"
        lead="Trouvez le bureau de distribution le plus proche et consultez ses produits disponibles."
      />

      <div className="space-y-4">
        {/* Carte */}
        <div className="card overflow-hidden relative h-[280px]">
          <Map
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

            {selectedStockiste && !showInventory && (
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
                  <p className="text-ink-soft mt-0.5">{selectedStockiste.city}, {selectedStockiste.commune}</p>
                  <p className="font-mono text-ink mt-1">{selectedStockiste.contact}</p>
                </div>
              </Popup>
            )}
          </Map>
        </div>

        {/* Recherche */}
        <div className="relative">
          <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="search"
            aria-label="Rechercher un stockiste"
            placeholder="Nom, ville, commune ou téléphone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-11"
          />
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="card p-6 text-center text-sm text-ink-soft">Chargement des stockistes…</div>
        ) : filteredStockistes.length > 0 ? (
          <ul className="card divide-y divide-line/70 overflow-hidden">
            {filteredStockistes.map((stockiste) => (
              <li key={stockiste.id}>
                <button
                  type="button"
                  onClick={() => handleStockisteClick(stockiste)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-cream/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                >
                  <span className="w-11 h-11 shrink-0 bg-palm-light rounded-xl flex items-center justify-center text-palm" aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-ink truncate">{stockiste.name}</span>
                    <span className="block text-xs text-ink-soft mt-0.5 truncate">{stockiste.location}</span>
                    <span className="block font-mono text-xs text-forest mt-0.5">{stockiste.contact}</span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-palm">Produits ›</span>
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

      {/* Inventaire du stockiste */}
      {showInventory && selectedStockiste && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="inv-title">
          <div className="absolute inset-0 bg-forest-deep/50 backdrop-blur-[2px]" onClick={() => setShowInventory(false)} />
          <div className="relative bg-cream w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl motion-safe:animate-in motion-safe:slide-in-from-bottom motion-safe:duration-300">
            <div className="bg-forest-deep text-cream px-5 pt-5 pb-4 flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Produits disponibles</p>
                <h3 id="inv-title" className="font-heading text-xl mt-1 truncate">{selectedStockiste.name}</h3>
                <p className="text-xs text-cream/70 mt-0.5">{selectedStockiste.location} · <span className="font-mono">{selectedStockiste.contact}</span></p>
              </div>
              <button onClick={() => setShowInventory(false)} aria-label="Fermer" className="p-1.5 -mr-1 rounded-full text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingInventory ? (
                <div className="flex justify-center py-10" role="status" aria-label="Chargement">
                  <div className="animate-spin rounded-full h-7 w-7 border-2 border-line border-t-palm"></div>
                </div>
              ) : inventoryItems.length > 0 ? (
                <ul className="card divide-y divide-line/70 overflow-hidden">
                  {inventoryItems.map((item, idx) => {
                    const product = item.produit;
                    const qty = item.quantity;
                    const badge =
                      qty >= 50 ? <span className="chip-palm">En stock</span>
                      : qty < 5 ? <span className="chip-clay">Presque épuisé</span>
                      : <span className="chip bg-cream-deep text-ink font-mono normal-case tracking-normal">{qty} en stock</span>;

                    return (
                      <li key={idx} className="flex items-center gap-3 p-3">
                        <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-contain" loading="lazy" />
                          ) : (
                            <span className="text-ink-soft/50 text-xs font-bold">{product.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[13px] text-ink line-clamp-2 leading-snug">{product.name}</h4>
                          <p className="font-mono text-[11px] mt-1 tabular-nums">
                            <span className="text-forest font-semibold">{fcfa(product.partnerPrice)} F</span>
                            <span className="text-ink-soft"> · {fcfa(product.publicPrice)} F public · {product.pv} PV</span>
                          </p>
                        </div>
                        <div className="shrink-0">{badge}</div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="card p-6 text-center text-sm text-ink-soft">
                  Ce stockiste n&apos;a pas encore renseigné ses produits. Appelez-le au <span className="font-mono text-ink">{selectedStockiste.contact}</span> pour vérifier la disponibilité.
                </div>
              )}
            </div>

            <div className="p-4 pt-0">
              <button onClick={() => setShowInventory(false)} className="btn-secondary w-full">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
