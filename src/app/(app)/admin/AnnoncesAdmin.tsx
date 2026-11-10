"use client";

import React, { useEffect, useState } from "react";
import { getAnnonces, saveAnnonce, deleteAnnonce, type AnnonceInput } from "@/app/actions/annonces";
import { ANNONCE_CATEGORIES, annonceCategory, formatEventDate, type Annonce } from "@/lib/annonces";
import DictationButton from "@/components/DictationButton";

const EMPTY: AnnonceInput = { category: "evenement", title: "", body: "", eventDate: "", place: "", image: "" };

const toDraft = (a: Annonce): AnnonceInput => ({
  id: a.id,
  category: a.category,
  title: a.title,
  body: a.body,
  eventDate: a.eventDate ? new Date(a.eventDate).toISOString().slice(0, 10) : "",
  place: a.place ?? "",
  image: a.image ?? "",
});

export default function AnnoncesAdmin({ onCount }: { onCount: (n: number) => void }) {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState<AnnonceInput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [toDelete, setToDelete] = useState<Annonce | null>(null);

  const load = async () => {
    const res = await getAnnonces();
    if (res.success && res.data) {
      setAnnonces(res.data);
      onCount(res.data.length);
    } else {
      setError(res.error || "Impossible de charger les annonces.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 4000);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    setError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setDraft((d) => (d ? { ...d, image: data.url } : d));
      else setError(data.error || "L'image n'a pas été ajoutée. Réessayez.");
    } catch {
      setError("L'image n'a pas été ajoutée. Vérifiez votre connexion.");
    }
    setIsUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError("");
    setIsSaving(true);
    const res = await saveAnnonce(draft);
    setIsSaving(false);
    if (!res.success) {
      setError(res.error || "L'annonce n'a pas été enregistrée. Réessayez.");
      return;
    }
    flash(draft.id ? "Annonce modifiée." : "Annonce publiée.");
    setDraft(null);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const res = await deleteAnnonce(toDelete.id);
    if (!res.success) {
      setError(res.error || "L'annonce n'a pas été supprimée. Réessayez.");
    } else {
      flash("Annonce supprimée.");
      load();
    }
    setToDelete(null);
  };

  return (
    <section className="bg-white rounded-2xl border border-line overflow-hidden rise-in">
      <header className="px-5 py-4 border-b border-line flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="section-title text-[22px]">Annonces</h3>
          <p className="text-[15px] text-ink-soft mt-0.5">Visibles par tous les membres de l&apos;application.</p>
        </div>
        {!draft && (
          <button type="button" onClick={() => { setError(""); setDraft({ ...EMPTY }); }} className="btn-primary shrink-0">
            Nouvelle annonce
          </button>
        )}
      </header>

      {error && <div role="alert" className="alert-error m-4">{error}</div>}

      {draft && (
        <form onSubmit={handleSave} className="p-5 space-y-4 border-b border-line bg-cream/40">
          <h4 className="font-bold text-ink text-[17px]">{draft.id ? "Modifier l'annonce" : "Nouvelle annonce"}</h4>
          <div>
            <label htmlFor="an-category" className="label">Type d&apos;annonce</label>
            <select id="an-category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input">
              {ANNONCE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="an-title" className="label">Titre</label>
            <DictationButton singleLine value={draft.title} onChange={(t) => setDraft((d) => (d ? { ...d, title: t.slice(0, 120) } : d))} hint="Touchez le micro pour dicter le titre.">
              <input id="an-title" type="text" required maxLength={120} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input pr-14" placeholder="Grand séminaire de décembre" />
            </DictationButton>
          </div>
          <div>
            <label htmlFor="an-body" className="label">Texte de l&apos;annonce</label>
            <DictationButton value={draft.body} onChange={(t) => setDraft((d) => (d ? { ...d, body: t.slice(0, 3000) } : d))} hint="Touchez le micro pour dicter le texte de l'annonce.">
              <textarea id="an-body" required rows={5} maxLength={3000} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="input pb-14" placeholder="Programme, intervenants, conditions de participation…" />
            </DictationButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="an-date" className="label">Date <span className="font-normal text-ink-soft">(facultatif)</span></label>
              <input id="an-date" type="date" value={draft.eventDate} onChange={(e) => setDraft({ ...draft, eventDate: e.target.value })} className="input" />
            </div>
            <div>
              <label htmlFor="an-place" className="label">Lieu <span className="font-normal text-ink-soft">(facultatif)</span></label>
              <input id="an-place" type="text" maxLength={120} value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} className="input" placeholder="Palais de la Culture, Treichville" />
            </div>
          </div>
          <div>
            <label htmlFor="an-image" className="label">Affiche ou photo <span className="font-normal text-ink-soft">(facultatif, 5 Mo au plus)</span></label>
            {draft.image && (
              <div className="mb-2 rounded-xl overflow-hidden bg-cream-deep">
                <img src={draft.image} alt="Aperçu de l'affiche" className="w-full max-h-56 object-contain" />
              </div>
            )}
            <input id="an-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImage} className="block w-full text-sm text-ink-soft" />
            {isUploading && <p className="text-sm text-ink-soft mt-1.5">Envoi de l&apos;image…</p>}
            {draft.image && !isUploading && (
              <button type="button" onClick={() => setDraft({ ...draft, image: "" })} className="text-sm font-bold text-clay underline underline-offset-2 mt-1.5">Retirer l&apos;image</button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isSaving || isUploading} className="btn-primary flex-1">
              {isSaving ? "Enregistrement…" : draft.id ? "Enregistrer" : "Publier l'annonce"}
            </button>
            <button type="button" onClick={() => { setError(""); setDraft(null); }} className="btn-ghost">Annuler</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-center py-12 text-sm text-ink-soft">Chargement des annonces…</p>
      ) : annonces.length === 0 ? (
        <p className="text-center py-12 px-6 text-sm text-ink-soft">Aucune annonce publiée. Touchez « Nouvelle annonce » pour commencer.</p>
      ) : (
        <ul className="divide-y divide-line">
          {annonces.map((a) => {
            const category = annonceCategory(a.category);
            return (
              <li key={a.id} className="px-5 py-4 flex gap-4">
                {a.image && <img src={a.image} alt="" loading="lazy" className="w-16 h-16 shrink-0 rounded-xl object-cover bg-cream-deep" />}
                <div className="min-w-0 flex-1">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] font-bold ${category.chip}`}>{category.label}</span>
                  <p className="font-bold text-[17px] text-ink mt-1 break-words">{a.title}</p>
                  <p className="text-[15px] text-ink-soft mt-0.5">
                    {a.eventDate ? <span className="first-letter:uppercase inline-block">{formatEventDate(a.eventDate)}</span> : `Publiée le ${new Date(a.createdAt).toLocaleDateString("fr-FR")}`}
                    {a.place ? ` · ${a.place}` : ""}
                  </p>
                  <div className="flex gap-2 mt-2.5">
                    <button type="button" onClick={() => { setError(""); setDraft(toDraft(a)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full border border-palm/30 bg-white px-3 py-1.5 text-sm font-bold text-palm hover:bg-palm-light transition-colors" aria-label={`Modifier l'annonce ${a.title}`}>
                      Modifier
                    </button>
                    <button type="button" onClick={() => setToDelete(a)} className="rounded-full border border-clay/30 bg-white px-3 py-1.5 text-sm font-bold text-clay hover:bg-clay hover:text-white transition-colors" aria-label={`Supprimer l'annonce ${a.title}`}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {notice && (
        <div role="status" className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[110] rounded-2xl bg-ink text-white px-5 py-3 text-[15px] font-semibold shadow-xl pop-in">
          {notice}
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="an-del-title">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 pop-in">
            <h4 id="an-del-title" className="font-heading text-xl text-ink">Supprimer cette annonce ?</h4>
            <p className="text-[15px] text-ink-soft">« {toDelete.title} » ne sera plus visible par les membres.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setToDelete(null)} className="btn-ghost flex-1">Annuler</button>
              <button type="button" onClick={confirmDelete} className="flex-1 rounded-xl bg-clay text-white font-bold py-2.5">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
