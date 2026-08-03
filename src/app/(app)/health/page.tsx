"use client";

import { useState, useEffect } from "react";
import { pathologiesList } from "@/data/pathologies";
import { getProducts } from "@/app/actions/products";

export default function HealthWellness() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(res => {
      if (res.success && res.data) {
        setDbProducts(res.data);
      }
    });
  }, []);

  const getProductImage = (prodName: string) => {
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
    return match?.image || null;
  };

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const sortedPathologies = [...pathologiesList].sort((a, b) => 
    a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-center shadow-md">
        <h2 className="text-2xl font-bold text-white font-heading">Soins & Bien-être</h2>
        <p className="text-sm text-white/90 mt-2">Découvrez les pathologies courantes et les recommandations de produits Longrich associés.</p>
      </div>

      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Rechercher une maladie ou un symptôme..." 
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div className="space-y-4">
        {sortedPathologies.map((pathology) => (
          <div key={pathology.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md">
            {/* Accordion Header */}
            <div 
              onClick={() => toggleAccordion(pathology.id)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-purple-50 transition-colors"
            >
              <div className="flex flex-col">
                <h3 className="font-black text-gray-800 text-lg">{pathology.name}</h3>
                <p className="text-sm text-red-600 font-medium mt-1 leading-relaxed">{pathology.description}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 transition-transform duration-300 ${openId === pathology.id ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            {openId === pathology.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-purple-50 text-purple-900 p-4 rounded-xl mb-5 text-base border border-purple-200 shadow-sm">
                  <span className="font-bold block mb-1">Posologie globale :</span>
                  <span className="font-medium">{pathology.posology}</span>
                </div>
                
                <h4 className="font-bold text-gray-800 mb-3 text-base">Produits prescrits :</h4>
                <div className="space-y-3">
                  {pathology.products.map((prod, idx) => {
                    const imageUrl = getProductImage(prod.name);
                    return (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-black text-gray-900 text-base leading-tight pr-2">{prod.name}</h5>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-sm">{prod.pv} PV</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          <span className="text-xs text-green-800 font-bold bg-green-100 px-2.5 py-1 rounded-md border border-green-200 shadow-sm">Partenaire: {prod.partner} F</span>
                          <span className="text-xs text-gray-800 font-bold bg-gray-100 px-2.5 py-1 rounded-md border border-gray-300 shadow-sm">Public: {prod.public} F</span>
                        </div>
                        <div className="mt-3 bg-blue-50 p-2.5 rounded-lg border border-blue-100 shadow-sm">
                          <span className="text-xs block text-blue-800 font-bold uppercase mb-1">Mode d'utilisation:</span>
                          <span className="text-sm text-gray-900 font-medium leading-relaxed block">{prod.dosage}</span>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
