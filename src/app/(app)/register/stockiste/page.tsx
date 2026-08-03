"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { registerStockiste } from "@/app/actions/auth";

export default function RegisterStockiste() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await registerStockiste(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <style dangerouslySetInnerHTML={{__html: `nav { display: none !important; }`}} />
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-xl animate-in fade-in zoom-in duration-300">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Inscription Stockiste</h2>
          <p className="text-sm text-gray-500 mt-1">Créez votre espace pour gérer votre bureau</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nom du Responsable / Bureau</label>
            <input 
              name="name"
              type="text" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              placeholder="Ex: Longrich Cocody Centre"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
              <input 
                name="phone"
                type="tel" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
                placeholder="0102030405"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input 
                name="email"
                type="email" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
                placeholder="contact@exemple.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ville</label>
              <select 
                name="city"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              >
                {["Abengourou", "Abidjan", "Aboisso", "Afféry", "Agboville", "Agnibilékrou", "Assinie", "Bangolo", "Bingerville", "Bocanda", "Bondoukou", "Bouaflé", "Bouaké", "Bouna", "Boundiali", "Dabou", "Daloa", "Danané", "Daoukro", "Dimbokro", "Divo", "Duékoué", "Ferkessédougou", "Gagnoa", "Grand-Bassam", "Guiglo", "Issia", "Jacqueville", "Katiola", "Korhogo", "Man", "Mankono", "Odienné", "Ouangolodougou", "Oumé", "San-Pédro", "Sassandra", "Séguéla", "Sinfra", "Soubré", "Tabou", "Tengréla", "Tiassalé", "Touba", "Toumodi", "Yamoussoukro", "Zuénoula"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Commune</label>
              <select 
                name="commune"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              >
                {["Abobo", "Adjamé", "Anyama", "Attécoubé", "Bingerville", "Brofodoumé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Songon", "Treichville", "Yopougon"].sort().map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Quartier (Précision)</label>
            <input 
              name="neighborhood"
              type="text" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              placeholder="Ex: Angré 8e Tranche près du rond point"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
            <input 
              name="password"
              type="password" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-forest text-white font-bold py-3 rounded-lg hover:bg-forest-deep transition-colors mt-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Inscription en cours..." : "S'inscrire et se connecter"}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/register" className="text-sm font-bold text-gray-500 hover:text-gray-900">Retour au choix du profil</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
