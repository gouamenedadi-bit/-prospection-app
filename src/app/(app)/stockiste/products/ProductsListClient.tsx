"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ExpandableText from "@/components/ExpandableText";

export default function ProductsListClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..." 
          className="bg-white border-2 border-gray-100 text-gray-900 text-base rounded-2xl focus:ring-forest focus:border-forest block w-full pl-11 p-3.5 shadow-sm transition-all outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product, i) => (
          <div
            key={i}
            onClick={() => router.push(`/stockiste/products/${product.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/stockiste/products/${product.id}`);
            }}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all transform hover:scale-[1.02] hover:shadow-md duration-300 cursor-pointer"
          >
            {/* Photo du produit */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg shadow-inner flex items-center justify-center flex-shrink-0 border border-black/5 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
            
            <div className="flex flex-col flex-1 w-full gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-gray-800 leading-tight">{product.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">{product.pv} PV</span>
              </div>
              
              <div className="flex flex-row gap-2 mt-1">
                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Partenaire</span>
                  <span className="text-base font-black text-green-700 tracking-wide">{product.partnerPrice} F</span>
                </div>
                
                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Non Partenaire</span>
                  <span className="text-base font-black text-gray-700 tracking-wide">{product.publicPrice} F</span>
                </div>
              </div>
              
              {product.posology && (
                <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 mt-1">
                  <span className="text-xs text-blue-600 uppercase font-bold block mb-1">Posologie / Utilisation</span>
                  <ExpandableText
                    text={product.posology}
                    maxLength={100}
                    className="text-sm text-gray-800 font-bold leading-relaxed"
                  />
                </div>
              )}

              {product.description && (
                <div className="px-1 mt-2">
                  <ExpandableText
                    text={product.description}
                    maxLength={120}
                    className="text-sm text-gray-800 font-medium italic leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 px-4 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aucun produit ne correspond à "<span className="font-semibold text-gray-700">{search}</span>".
          </div>
        )}
      </div>
    </div>
  );
}
