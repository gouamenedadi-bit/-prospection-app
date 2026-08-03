"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PartnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "Jean Dupont",
    phone: "0102030405",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    commune: "Cocody",
    neighborhood: "Angré 8e Tranche",
    email: "jean@example.com"
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Set the actual user info from session
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  if (status === "loading") {
    return <div className="flex justify-center py-20 text-forest">Chargement de votre espace...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const triggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-white shadow-md text-center relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white opacity-10 rounded-full blur-lg"></div>
        <h2 className="text-xl font-bold font-heading relative z-10">Espace Partenaire</h2>
        <p className="text-xs text-white/80 mt-1 relative z-10">Gérez vos informations personnelles</p>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <form onSubmit={triggerSave} className="space-y-4 animate-in fade-in duration-300">
          <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 mb-4">Mon Profil</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nom et Prénoms</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Pays</label>
                <select 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest"
                >
                  <option>Côte d'Ivoire</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ville</label>
                <select 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest"
                >
                  {["Abengourou", "Abidjan", "Aboisso", "Afféry", "Agboville", "Agnibilékrou", "Assinie", "Bangolo", "Bingerville", "Bocanda", "Bondoukou", "Bouaflé", "Bouaké", "Bouna", "Boundiali", "Dabou", "Daloa", "Danané", "Daoukro", "Dimbokro", "Divo", "Duékoué", "Ferkessédougou", "Gagnoa", "Grand-Bassam", "Guiglo", "Issia", "Jacqueville", "Katiola", "Korhogo", "Man", "Mankono", "Odienné", "Ouangolodougou", "Oumé", "San-Pédro", "Sassandra", "Séguéla", "Sinfra", "Soubré", "Tabou", "Tengréla", "Tiassalé", "Touba", "Toumodi", "Yamoussoukro", "Zuénoula"].sort().map(ville => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Commune</label>
                <select 
                  value={formData.commune}
                  onChange={e => setFormData({...formData, commune: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest"
                >
                  {["Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", "Yopougon", "Anyama", "Bingerville", "Songon", "Commune Centrale", "Autre"].sort().map(commune => (
                    <option key={commune} value={commune}>{commune}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Quartier</label>
              <input 
                type="text" 
                value={formData.neighborhood}
                onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Adresse Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-forest text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-forest-deep transition-all mt-4">
            Enregistrer les modifications
          </button>
        </form>

        {showSaveMessage && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100 text-center animate-in fade-in zoom-in duration-300">
            Modifications enregistrées avec succès !
          </div>
        )}

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full mt-6 bg-red-50 text-red-600 py-3 rounded-xl text-sm font-bold shadow-sm border border-red-100 hover:bg-red-100 transition-all flex justify-center items-center gap-2"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
