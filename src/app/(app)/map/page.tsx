"use client";

import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PageHeader } from "@/components/ui";

// Mock data for stockistes
const STOCKISTES = [
  { id: 1, name: 'Bureau Longrich Cocody', city: 'Abidjan', commune: 'Cocody', lat: 5.345317, lng: -4.024429, phone: '01 02 03 04 05' },
  { id: 2, name: 'Bureau Longrich Yopougon', city: 'Abidjan', commune: 'Yopougon', lat: 5.334057, lng: -4.067332, phone: '05 04 03 02 01' },
  { id: 3, name: 'Distributeur Yamoussoukro', city: 'Yamoussoukro', commune: 'Centre', lat: 6.827623, lng: -5.289343, phone: '07 08 09 10 11' },
];

export default function MapPage() {
  const [selectedStockiste, setSelectedStockiste] = useState<any>(null);
  const [search, setSearch] = useState('');

  // Note: Un token Mapbox valide sera nécessaire en production.
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  const filteredStockistes = STOCKISTES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.commune.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader eyebrow="Carte" title="Trouver un stockiste" />

      <div className="relative mb-4">
        <svg className="w-5 h-5 text-ink-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="search"
          aria-label="Rechercher par ville ou commune"
          placeholder="Ville ou commune"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-11"
        />
      </div>

      <div className="flex-1 card overflow-hidden relative min-h-[420px]">
        <Map
          initialViewState={{
            longitude: -4.0083,
            latitude: 5.3096, // Abidjan
            zoom: 11
          }}
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
                setSelectedStockiste(stockiste);
              }}
            >
              <svg width="30" height="38" viewBox="0 0 30 38" className="cursor-pointer drop-shadow-md hover:scale-110 transition-transform" aria-hidden="true">
                <path d="M15 37C15 37 28 23.5 28 14A13 13 0 0 0 2 14C2 23.5 15 37 15 37Z" fill="#173B2C" stroke="#F6F2E7" strokeWidth="2" />
                <circle cx="15" cy="14" r="5" fill="#D98B2B" />
              </svg>
            </Marker>
          ))}

          {selectedStockiste && (
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
                <p className="font-mono text-ink mt-1">{selectedStockiste.phone}</p>
                <a href="/stockistes" className="mt-2 block text-center bg-palm-light text-palm py-1.5 rounded-lg text-xs font-bold hover:bg-palm hover:text-cream transition-colors">
                  Voir les produits
                </a>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
