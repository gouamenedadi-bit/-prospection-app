"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAllStockistes } from "@/app/actions/stockistes";
import { getStockisteInventory } from "@/app/actions/inventory";

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
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-white shadow-md text-center shrink-0">
        <h2 className="text-2xl font-bold font-heading">Liste des Stockistes</h2>
        <p className="text-sm opacity-90 mt-2">Trouvez le bureau de distribution le plus proche de chez vous.</p>
      </div>

      {/* Map Container */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 relative min-h-[300px] shrink-0">
        <Map
          initialViewState={{
            longitude: -4.0083,
            latitude: 5.3096, // Abidjan center
            zoom: 11
          }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
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
              <div className="text-3xl cursor-pointer">📍</div>
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
              <div className="p-2">
                <h3 className="font-bold text-green-700">{selectedStockiste.name}</h3>
                <p className="text-gray-600 mt-1">{selectedStockiste.city}, {selectedStockiste.commune}</p>
                <p className="text-gray-800 font-medium mt-2">📞 {selectedStockiste.contact}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Search Bar */}
      <div className="relative shrink-0">
        <input 
          type="text" 
          placeholder="Rechercher par nom, ville, commune ou contact..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-forest focus:border-forest shadow-sm text-sm"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      {/* List Container */}
      <div className="space-y-4 pb-10">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Chargement des stockistes...</div>
        ) : filteredStockistes.length > 0 ? (
          filteredStockistes.map((stockiste, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all transform hover:scale-[1.02] hover:shadow-lg duration-300 cursor-pointer" onClick={() => handleStockisteClick(stockiste)}>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-forest flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                
                <div>
                  <h3 className="font-bold text-ink text-lg">{stockiste.name}</h3>
                  
                  <div className="flex items-center gap-1 text-sm text-ink-soft mt-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="break-words">{stockiste.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm font-semibold text-forest mt-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{stockiste.contact}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-700`}>
                  Voir les produits
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-line">
            <p className="text-gray-500 text-sm">Aucun stockiste trouvé pour cette recherche.</p>
          </div>
        )}
      </div>

      {/* Modal Inventaire */}
      {showInventory && selectedStockiste && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-forest text-white">
              <div>
                <h3 className="font-bold text-lg">{selectedStockiste.name}</h3>
                <p className="text-xs opacity-90">{selectedStockiste.location}</p>
              </div>
              <button onClick={() => setShowInventory(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
              {isLoadingInventory ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
                </div>
              ) : inventoryItems.length > 0 ? (
                <div className="space-y-3">
                  {inventoryItems.map((item, idx) => {
                    const product = item.produit;
                    const qty = item.quantity;
                    
                    let stockBadge = null;
                    if (qty >= 50) {
                      stockBadge = <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">En stock</span>;
                    } else if (qty < 5) {
                      stockBadge = <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Rupt. stock</span>;
                    } else {
                      stockBadge = <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">Qté: {qty}</span>;
                    }

                    return (
                      <div 
                        key={idx} 
                        className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md hover:border-green-200 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationFillMode: 'both', animationDelay: `${idx * 40}ms` }}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                              {product.name.substring(0,2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[15px] text-gray-800 line-clamp-1">{product.name}</h4>
                          <div className="text-xs mt-1.5 flex flex-wrap gap-2">
                            <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 border border-gray-200">{product.pv} PV</span>
                            <span className="font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">Partenaire: {product.partnerPrice} F</span>
                            <span className="font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">Public: {product.publicPrice} F</span>
                          </div>
                          {product.description && (
                            <p className="text-[13px] text-gray-900 mt-2 line-clamp-2 italic leading-snug">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {stockBadge}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                  Ce stockiste n'a pas encore ajouté de produits à son inventaire.
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white">
              <button 
                onClick={() => setShowInventory(false)}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
