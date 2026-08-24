"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getPartenaireProfile, updatePartenaireProfile } from "@/app/actions/partenaires";
import ReorderableList from "@/components/ReorderableList";
import {
  QUICK_ACCESS_DEFAULT_ORDER,
  loadQuickAccessOrder,
  orderedQuickAccessItems,
  saveQuickAccessOrder,
} from "@/lib/quickAccess";

const VILLES = ["Abengourou", "Abidjan", "Aboisso", "Afféry", "Agboville", "Agnibilékrou", "Assinie", "Bangolo", "Bingerville", "Bocanda", "Bondoukou", "Bouaflé", "Bouaké", "Bouna", "Boundiali", "Dabou", "Daloa", "Danané", "Daoukro", "Dimbokro", "Divo", "Duékoué", "Ferkessédougou", "Gagnoa", "Grand-Bassam", "Guiglo", "Issia", "Jacqueville", "Katiola", "Korhogo", "Man", "Mankono", "Odienné", "Ouangolodougou", "Oumé", "San-Pédro", "Sassandra", "Séguéla", "Sinfra", "Soubré", "Tabou", "Tengréla", "Tiassalé", "Touba", "Toumodi", "Yamoussoukro", "Zuénoula"];
const COMMUNES = ["Abobo", "Adjamé", "Anyama", "Attécoubé", "Bingerville", "Brofodoumé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Songon", "Treichville", "Yopougon"];

export default function PartnerSettings() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", email: "", city: "", commune: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const [navOrder, setNavOrder] = useState<string[]>(QUICK_ACCESS_DEFAULT_ORDER);

  useEffect(() => {
    setNavOrder(loadQuickAccessOrder());
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    getPartenaireProfile(session.user.id).then((res) => {
      if (res.success && res.data) {
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          city: res.data.city || "",
          commune: res.data.commune || "",
        });
      }
      setIsLoading(false);
    });
  }, [status, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setError("");
    setIsSaving(true);
    const res = await updatePartenaireProfile(session.user.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      city: formData.city,
      commune: formData.commune,
    });
    setIsSaving(false);
    if (res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      setError(res.error || "Erreur lors de la mise à jour.");
    }
  };

  const quickAccessItems = orderedQuickAccessItems(navOrder);

  const handleQuickAccessReorder = (order: string[]) => {
    setNavOrder(order);
    saveQuickAccessOrder(order);
  };

  const resetQuickAccessOrder = () => {
    setNavOrder(QUICK_ACCESS_DEFAULT_ORDER);
    saveQuickAccessOrder(QUICK_ACCESS_DEFAULT_ORDER);
  };

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center py-20 text-forest">Chargement...</div>;
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="text-ink-soft hover:text-forest">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <h2 className="text-lg font-bold text-ink font-heading">Paramètres</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Mon Profil Partenaire</h2>
        <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-semibold">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prénoms</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-forest focus:border-forest"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-forest focus:border-forest"
              required
            />
          </div>
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
            value={formData.email}
            disabled
            className="w-full px-4 py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié — contactez le support si besoin.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
            <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-forest focus:border-forest">
              {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Commune</label>
            <select name="commune" value={formData.commune} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-forest focus:border-forest">
              {COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-forest text-white py-3 rounded-xl font-bold shadow hover:bg-forest-deep transition-all transform hover:scale-[1.02] duration-200 disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Mettre à jour le profil"}
          </button>
        </div>

        {isSaved && (
          <div className="p-3 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-100 text-center animate-in fade-in zoom-in duration-300">
            Informations sauvegardées avec succès !
          </div>
        )}
      </form>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800">Réorganiser mon tableau de bord</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4">Maintenez et faites glisser un raccourci pour l'organiser selon vos besoins.</p>

        <ReorderableList items={quickAccessItems} onChange={handleQuickAccessReorder} />

        <button
          onClick={resetQuickAccessOrder}
          className="w-full mt-4 text-xs font-bold text-ink-soft py-2.5 rounded-lg border border-line hover:bg-cream transition-colors"
        >
          Réinitialiser l'ordre par défaut
        </button>
      </div>

    </div>
  );
}
