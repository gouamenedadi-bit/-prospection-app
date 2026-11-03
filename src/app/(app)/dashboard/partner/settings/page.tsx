"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getPartenaireProfile, updatePartenaireProfile } from "@/app/actions/partenaires";
import ReorderableList from "@/components/ReorderableList";
import { PageHeader } from "@/components/ui";
import { CITIES, COMMUNES } from "@/lib/places";
import {
  QUICK_ACCESS_DEFAULT_ORDER,
  loadQuickAccessOrder,
  orderedQuickAccessItems,
  saveQuickAccessOrder,
} from "@/lib/quickAccess";

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
      setError(res.error || "Le profil n'a pas pu être enregistré. Réessayez.");
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
    return <div className="flex justify-center py-20 text-sm text-ink-soft">Chargement…</div>;
  }

  const initials = `${formData.firstName[0] || ""}${formData.lastName[0] || ""}`.toUpperCase() || "P";

  return (
    <div className="space-y-5 pb-4 lg:max-w-2xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-forest rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        Accueil
      </Link>

      <PageHeader eyebrow="Compte partenaire" title="Paramètres" />

      {/* Identité */}
      <div className="card p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-forest text-cream flex items-center justify-center font-heading text-xl shrink-0" aria-hidden="true">{initials}</div>
        <div className="min-w-0">
          <p className="font-bold text-ink truncate">{formData.firstName} {formData.lastName}</p>
          <p className="text-xs text-ink-soft truncate">{formData.email}</p>
          <span className="chip-palm mt-1.5">Partenaire</span>
        </div>
      </div>

      {/* Profil */}
      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <h3 className="section-title">Informations personnelles</h3>
        {error && <div role="alert" className="alert-error">{error}</div>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ps-first" className="label">Prénoms</label>
            <input id="ps-first" type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label htmlFor="ps-last" className="label">Nom</label>
            <input id="ps-last" type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input" required />
          </div>
        </div>

        <div>
          <label htmlFor="ps-phone" className="label">Téléphone</label>
          <input id="ps-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label htmlFor="ps-email" className="label">Email</label>
          <input id="ps-email" type="email" value={formData.email} disabled className="input bg-cream text-ink-soft cursor-not-allowed" />
          <p className="text-[11px] text-ink-soft mt-1.5">L&apos;email ne peut pas être modifié. Contactez le support si besoin.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ps-city" className="label">Ville</label>
            <select id="ps-city" name="city" value={formData.city} onChange={handleChange} className="input">
              {CITIES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ps-commune" className="label">Commune</label>
            <select id="ps-commune" name="commune" value={formData.commune} onChange={handleChange} className="input">
              {COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="btn-primary w-full">
          {isSaving ? "Enregistrement…" : "Enregistrer le profil"}
        </button>

        {isSaved && <div role="status" className="alert-success text-center">Profil enregistré.</div>}
      </form>

      {/* Raccourcis */}
      <div className="card p-5">
        <h3 className="section-title">Ordre des accès rapides</h3>
        <p className="text-xs text-ink-soft mt-1 mb-4">Maintenez puis faites glisser un raccourci pour changer sa place sur l&apos;accueil.</p>

        <ReorderableList items={quickAccessItems} onChange={handleQuickAccessReorder} />

        <button onClick={resetQuickAccessOrder} className="btn-ghost w-full mt-3 text-xs">
          Rétablir l&apos;ordre par défaut
        </button>
      </div>
    </div>
  );
}
