"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { CITIES, communeForCity } from "@/lib/places";

const PARTNER_COMMUNES = ["Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", "Yopougon", "Anyama", "Bingerville", "Songon", "Commune Centrale", "Autre"].sort();

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
    return <div className="flex justify-center py-20 text-sm text-ink-soft">Chargement de votre espace…</div>;
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
    <div className="space-y-5 pb-4 lg:max-w-2xl lg:mx-auto">
      <PageHeader eyebrow="Espace partenaire" title="Mon profil" lead="Vos informations personnelles." />

      <form onSubmit={triggerSave} className="card p-5 space-y-4">
        <div>
          <label htmlFor="pd-name" className="label">Nom et prénoms</label>
          <input id="pd-name" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pd-phone" className="label">Téléphone</label>
            <input id="pd-phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input" />
          </div>
          <div>
            <label htmlFor="pd-country" className="label">Pays</label>
            <select id="pd-country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="input">
              <option>Côte d&apos;Ivoire</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pd-city" className="label">Ville</label>
            <select id="pd-city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value, commune: communeForCity(e.target.value, formData.commune)})} className="input">
              {CITIES.map(ville => <option key={ville} value={ville}>{ville}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pd-commune" className="label">Commune</label>
            <select id="pd-commune" value={formData.commune} onChange={e => setFormData({...formData, commune: e.target.value})} className="input">
              {PARTNER_COMMUNES.map(commune => <option key={commune} value={commune}>{commune}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="pd-hood" className="label">Quartier</label>
          <input id="pd-hood" type="text" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="input" />
        </div>

        <div>
          <label htmlFor="pd-email" className="label">Email</label>
          <input id="pd-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input" />
        </div>

        <button type="submit" className="btn-primary w-full">Enregistrer les modifications</button>

        {showSaveMessage && <div role="status" className="alert-success text-center">Modifications enregistrées.</div>}
      </form>

      <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-danger w-full">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        Se déconnecter
      </button>
    </div>
  );
}
