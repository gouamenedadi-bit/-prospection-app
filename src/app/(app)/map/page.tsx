"use client";

import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

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
    <div className="flex flex-col h-full space-y-4">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 z-10 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Trouver un Stockiste</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Rechercher par ville, commune..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative min-h-[400px]">
        <Map
          initialViewState={{
            longitude: -4.0083,
            latitude: 5.3096, // Abidjan center
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
              <div className="text-3xl cursor-pointer">📍</div>
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
              <div className="p-2">
                <h3 className="font-bold text-green-700">{selectedStockiste.name}</h3>
                <p className="text-gray-600 mt-1">{selectedStockiste.city}, {selectedStockiste.commune}</p>
                <p className="text-gray-800 font-medium mt-2">📞 {selectedStockiste.phone}</p>
                <button className="mt-3 w-full bg-green-100 text-green-800 py-1 rounded text-xs font-semibold hover:bg-green-200">
                  Voir les produits
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
