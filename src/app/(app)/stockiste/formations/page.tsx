"use client";

import { useState } from "react";

export default function FormationsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const formations = [
    { 
      title: "Présentation Plan de Compensation", 
      date: "12 Août 2026", 
      time: "14:00", 
      trainer: "Leader K. Jean",
      location: "Bureau Marc Kouassi (Abidjan, Cocody Angré)"
    },
    { 
      title: "Formation Produits & Soins", 
      date: "15 Août 2026", 
      time: "09:00", 
      trainer: "Dr. A. Marie",
      location: "Bureau Fatou Diarra (Abidjan, Yopougon)"
    },
    { 
      title: "Stratégies de Prospection", 
      date: "20 Août 2026", 
      time: "10:00", 
      trainer: "Leader S. Michel",
      location: "Bureau Jean Pierre (Bouaké, Commerce)"
    },
  ];

  const filteredFormations = formations.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-white shadow-md text-center">
        <h2 className="text-2xl font-bold font-heading">Liste des Formations</h2>
        <p className="text-sm opacity-90 mt-2">Découvrez et participez aux prochaines sessions de formation dans les bureaux.</p>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Rechercher par ville, bureau, titre..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-forest focus:border-forest shadow-sm text-sm"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div className="space-y-4">
        {filteredFormations.length > 0 ? (
          filteredFormations.map((form, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-forest transition-all transform hover:scale-[1.03] hover:shadow-lg duration-300 cursor-pointer">
              <h3 className="font-bold text-gray-800 text-lg">{form.title}</h3>
              <div className="text-sm text-gray-600 mt-3 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-forest text-base">📅</span> {form.date} à {form.time}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-forest text-base">📍</span> Lieu : <span className="font-semibold text-gray-700">{form.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-forest text-base">👨‍🏫</span> Formateur : {form.trainer}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Aucune formation trouvée pour cette recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
