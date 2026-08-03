"use client";

import { useState } from "react";

export default function PartnerSettings() {
  const [formData, setFormData] = useState({
    fullName: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "0102030405",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Mon Profil Partenaire</h2>
        <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nom et prénoms</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-forest focus:border-forest"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Numéro de téléphone</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-forest focus:border-forest"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse E-mail</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-forest focus:border-forest"
            required
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-forest text-white py-3 rounded-xl font-bold shadow hover:bg-forest-deep transition-all transform hover:scale-[1.02] duration-200"
          >
            Mettre à jour le profil
          </button>
        </div>

        {isSaved && (
          <div className="p-3 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-100 text-center animate-in fade-in zoom-in duration-300">
            Informations sauvegardées avec succès !
          </div>
        )}
      </form>
    </div>
  );
}
