"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/app/actions/products";
import { getStockisteInventory, updateStock } from "@/app/actions/inventory";
import { getStockisteProfile, updateStockisteProfile } from "@/app/actions/stockistes";

const LOW_STOCK_THRESHOLD = 5;

export default function StockisteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("profil");
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [profileForm, setProfileForm] = useState({ name: "", phone: "", city: "", commune: "", neighborhood: "" });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Initialize products with quantity 0 by default
  const [products, setProducts] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: 0, pv: "" as string|number, partnerPrice: "", publicPrice: "", posology: "", description: "", imageUrl: "" });

  // Formation management state
  const [formations, setFormations] = useState([
    { title: "Présentation Plan de Compensation", date: "2026-08-12", time: "14:00", trainer: "Kouassi Marc" }
  ]);
  const [editingFormationIndex, setEditingFormationIndex] = useState<number | null>(null);
  const [formationForm, setFormationForm] = useState({ title: "", date: "", time: "", trainer: "" });
  const [isAddingFormation, setIsAddingFormation] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadProducts() {
      if (!session?.user?.id) return;
      
      setIsLoadingProducts(true);
      
      // 1. Fetch all available products
      const productsRes = await getProducts();
      
      // 2. Fetch stockiste's inventory
      // @ts-ignore
      const inventoryRes = await getStockisteInventory(session.user.id);
      
      if (productsRes.success && productsRes.data) {
        // Map inventory quantities to products
        const inventoryMap = new Map();
        if (inventoryRes.success && inventoryRes.data) {
          inventoryRes.data.forEach((inv: any) => {
            inventoryMap.set(inv.produitId, inv.quantity);
          });
        }

        const loadedProducts = productsRes.data.map((p: any) => ({
          ...p,
          quantity: inventoryMap.get(p.id) || 0
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));

        setProducts(loadedProducts);
      }

      // Produits réellement suivis en stock (Inventory existant) et bas (<= seuil)
      if (inventoryRes.success && inventoryRes.data) {
        setLowStockItems(
          inventoryRes.data
            .filter((inv: any) => inv.quantity <= LOW_STOCK_THRESHOLD)
            .sort((a: any, b: any) => a.quantity - b.quantity)
        );
      }

      setIsLoadingProducts(false);
    }
    
    if (status === "authenticated" && session?.user) {
      loadProducts();
    }
  }, [status, session]);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) return;
      setIsLoadingProfile(true);
      // @ts-ignore
      const res = await getStockisteProfile(session.user.id);
      if (res.success && res.data) {
        setProfileForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          commune: res.data.commune || "",
          neighborhood: res.data.neighborhood || ""
        });
      }
      setIsLoadingProfile(false);
    }
    
    if (status === "authenticated" && session?.user) {
      loadProfile();
    }
  }, [status, session]);

  if (status === "loading") {
    return <div className="flex justify-center py-20 text-sm text-ink-soft">Chargement de votre espace…</div>;
  }

  if (status === "unauthenticated") {
    return null; // Redirecting in useEffect
  }
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.id) {
      // @ts-ignore
      const res = await updateStockisteProfile(session.user.id, profileForm);
      if (res.success) {
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 3000);
      } else {
        alert("Erreur lors de la mise à jour du profil.");
      }
    }
  };

  // --- Handlers for Products ---
  const handleEditProduct = (index: number) => {
    setEditingIndex(index);
    setEditForm(products[index]);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null && session?.user?.id) {
      const product = products[editingIndex];
      // @ts-ignore
      const res = await updateStock(session.user.id, product.id, editForm.quantity);
      
      if (res.success) {
        const newProducts = [...products];
        newProducts[editingIndex] = { ...newProducts[editingIndex], quantity: editForm.quantity };
        setProducts(newProducts);
        setEditingIndex(null);
      } else {
        alert("Erreur: " + res.error);
      }
    }
  };

  // --- Handlers for Formations ---
  const handleEditFormation = (index: number) => {
    setEditingFormationIndex(index);
    setFormationForm(formations[index]);
    setIsAddingFormation(false);
  };

  const handleAddFormationClick = () => {
    setIsAddingFormation(true);
    setEditingFormationIndex(null);
    setFormationForm({ title: "", date: "", time: "", trainer: "" });
  };

  const handleSaveFormation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFormationIndex !== null) {
      const newFormations = [...formations];
      newFormations[editingFormationIndex] = formationForm;
      setFormations(newFormations);
      setEditingFormationIndex(null);
    } else if (isAddingFormation) {
      setFormations([...formations, formationForm]);
      setIsAddingFormation(false);
    }
  };  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };


  const fcfa = (n: unknown) => (Number(n) || 0).toLocaleString("fr-FR");
  const stockedCount = products.filter((p) => p.quantity > 0).length;
  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d.getTime()) ? { day: "–", month: "" } : { day: String(d.getDate()), month: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "") };
  };

  const tabs = [
    { id: "profil", label: "Bureau" },
    { id: "produits", label: "Stock" },
    { id: "formations", label: "Formations" },
    { id: "paiement", label: "Paiements" },
  ];

  return (
    <div className="space-y-5 pb-4">
      {/* En-tête du bureau */}
      <section className="card-dark p-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-[18px] border-gold/15" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold relative">Espace stockiste</p>
        <h2 className="font-heading text-[24px] leading-tight mt-1.5 relative truncate">{profileForm.name || "Mon bureau"}</h2>
        <p className="text-sm text-cream/70 mt-0.5 relative truncate">
          {[profileForm.neighborhood || profileForm.commune, profileForm.city].filter(Boolean).join(", ") || "Adresse à compléter"}
        </p>
        <dl className="grid grid-cols-3 gap-2 mt-4 relative">
          <div className="rounded-xl bg-cream/5 border border-cream/10 px-3 py-2">
            <dt className="text-[10px] text-cream/60">En stock</dt>
            <dd className="font-mono text-lg tabular-nums">{isLoadingProducts ? "–" : stockedCount}</dd>
          </div>
          <div className={`rounded-xl px-3 py-2 border ${lowStockItems.length ? "bg-gold/15 border-gold/30" : "bg-cream/5 border-cream/10"}`}>
            <dt className="text-[10px] text-cream/60">Stock faible</dt>
            <dd className="font-mono text-lg tabular-nums">{isLoadingProducts ? "–" : lowStockItems.length}</dd>
          </div>
          <div className="rounded-xl bg-cream/5 border border-cream/10 px-3 py-2">
            <dt className="text-[10px] text-cream/60">Formations</dt>
            <dd className="font-mono text-lg tabular-nums">{formations.length}</dd>
          </div>
        </dl>
      </section>

      {showSaveMessage && (
        <div role="status" className="alert-success flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Modifications enregistrées.
        </div>
      )}

      {/* Onglets */}
      <div role="tablist" aria-label="Sections de l'espace stockiste" className="grid grid-cols-4 gap-1 bg-cream-deep p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              activeTab === tab.id ? "bg-white text-forest shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ───── BUREAU ───── */}
      {activeTab === "profil" && (
        <form onSubmit={handleSaveProfile} className="card p-5 space-y-4">
          <div>
            <h3 className="section-title">Informations du bureau</h3>
            <p className="text-xs text-ink-soft mt-0.5">Visibles par les partenaires sur la carte des stockistes.</p>
          </div>
          {isLoadingProfile ? (
            <div className="text-center py-8 text-sm text-ink-soft">Chargement des informations…</div>
          ) : (
            <>
              <div>
                <label htmlFor="sd-name" className="label">Nom du responsable ou du bureau</label>
                <input id="sd-name" type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sd-phone" className="label">Téléphone</label>
                  <input id="sd-phone" type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="input" />
                </div>
                <div>
                  <label htmlFor="sd-city" className="label">Ville</label>
                  <input id="sd-city" type="text" value={profileForm.city} onChange={(e) => setProfileForm({...profileForm, city: e.target.value})} className="input" />
                </div>
              </div>
              <div>
                <label htmlFor="sd-hood" className="label">Commune / quartier</label>
                <input id="sd-hood" type="text" value={profileForm.neighborhood || profileForm.commune} onChange={(e) => setProfileForm({...profileForm, neighborhood: e.target.value, commune: e.target.value})} className="input" />
              </div>
            </>
          )}
          <button type="submit" disabled={isLoadingProfile} className="btn-primary w-full">
            Enregistrer le bureau
          </button>
        </form>
      )}

      {/* ───── STOCK ───── */}
      {activeTab === "produits" && (
        <section className="space-y-3">
          {lowStockItems.length > 0 && editingIndex === null && (
            <div className="rounded-2xl border border-gold/30 bg-gold-light p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gold-deep shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h4 className="font-bold text-gold-deep text-sm">À réapprovisionner</h4>
              </div>
              <ul className="space-y-1">
                {lowStockItems.map((inv: any) => (
                  <li key={inv.id} className="text-xs text-gold-deep flex justify-between gap-3">
                    <span className="truncate">{inv.produit?.name}</span>
                    <span className="font-mono font-semibold shrink-0">{inv.quantity === 0 ? "Épuisé" : `${inv.quantity} restant${inv.quantity > 1 ? "s" : ""}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {editingIndex !== null ? (
            <form onSubmit={handleSaveProduct} className="card overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-line/70 bg-cream/60">
                <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  {editForm.imageUrl || (products[editingIndex] as any)?.image ? (
                    <img src={editForm.imageUrl || (products[editingIndex] as any)?.image} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-ink-soft/50">{editForm.name.substring(0, 3)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-ink-soft">Modifier la quantité</p>
                  <h4 className="font-bold text-sm text-ink leading-snug line-clamp-2">{editForm.name}</h4>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <dl className="grid grid-cols-3 rounded-xl border border-line overflow-hidden text-center">
                  <div className="py-2"><dt className="text-[10px] text-ink-soft">PV</dt><dd className="font-mono text-sm font-semibold">{editForm.pv}</dd></div>
                  <div className="py-2 border-x border-line"><dt className="text-[10px] text-ink-soft">Partenaire</dt><dd className="font-mono text-sm font-semibold text-forest">{fcfa(editForm.partnerPrice)} F</dd></div>
                  <div className="py-2"><dt className="text-[10px] text-ink-soft">Public</dt><dd className="font-mono text-sm font-semibold">{fcfa(editForm.publicPrice)} F</dd></div>
                </dl>

                {editForm.posology && (
                  <div className="note">
                    <span className="note-label">Posologie</span>
                    <p className="text-[13px] text-ink">{editForm.posology}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="sd-qty" className="label">Quantité en stock</label>
                  <div className="flex items-stretch gap-2">
                    <button type="button" onClick={() => setEditForm({...editForm, quantity: Math.max(0, editForm.quantity - 1)})} className="btn-secondary px-4" aria-label="Retirer 1">−</button>
                    <input
                      id="sd-qty"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={editForm.quantity}
                      onChange={e => setEditForm({...editForm, quantity: parseInt(e.target.value) || 0})}
                      className="input text-center font-mono text-lg font-semibold"
                    />
                    <button type="button" onClick={() => setEditForm({...editForm, quantity: editForm.quantity + 1})} className="btn-secondary px-4" aria-label="Ajouter 1">+</button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingIndex(null)} className="btn-secondary flex-1">Annuler</button>
                  <button type="submit" className="btn-primary flex-1">Enregistrer</button>
                </div>
              </div>
            </form>
          ) : isLoadingProducts ? (
            <div className="card p-6 text-center text-sm text-ink-soft">Chargement de votre stock…</div>
          ) : products.length === 0 ? (
            <div className="card p-6 text-center text-sm text-ink-soft">Le catalogue est vide pour le moment.</div>
          ) : (
            <ul className="card divide-y divide-line/70 overflow-hidden">
              {products.map((product, idx) => {
                const low = product.quantity > 0 && product.quantity <= LOW_STOCK_THRESHOLD;
                return (
                  <li key={product.id ?? idx} className="flex items-center gap-3 p-3">
                    <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-contain" loading="lazy" />
                      ) : (
                        <span className="text-xs font-bold text-ink-soft/50">{product.name.slice(0, 3)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[13px] text-ink line-clamp-1">{product.name}</h4>
                      <p className="font-mono text-[11px] mt-0.5 tabular-nums">
                        <span className="text-forest font-semibold">{fcfa(product.partnerPrice)} F</span>
                        <span className="text-ink-soft"> · {fcfa(product.publicPrice)} F · {product.pv} PV</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditProduct(idx)}
                      className={`shrink-0 min-w-[58px] rounded-lg border px-2.5 py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                        product.quantity === 0 ? "border-line text-ink-soft hover:border-palm/40" : low ? "border-gold/40 bg-gold-light text-gold-deep" : "border-palm/25 bg-palm-light text-palm"
                      }`}
                      aria-label={`Modifier la quantité de ${product.name} (${product.quantity})`}
                    >
                      <span className="block font-mono text-sm font-semibold leading-none">{product.quantity}</span>
                      <span className="block text-[9px] font-semibold mt-0.5">Modifier</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ───── FORMATIONS ───── */}
      {activeTab === "formations" && (
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="section-title">Mes formations</h3>
            {!isAddingFormation && editingFormationIndex === null && (
              <button onClick={handleAddFormationClick} className="btn-gold px-3 py-2 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M12 4v16m8-8H4"></path></svg>
                Planifier
              </button>
            )}
          </div>

          {(isAddingFormation || editingFormationIndex !== null) && (
            <form onSubmit={handleSaveFormation} className="card p-4 space-y-3">
              <h4 className="font-bold text-ink text-sm">{isAddingFormation ? "Nouvelle formation" : "Modifier la formation"}</h4>
              <div>
                <label htmlFor="sf-title" className="label">Thème</label>
                <input id="sf-title" type="text" required value={formationForm.title} onChange={e => setFormationForm({...formationForm, title: e.target.value})} placeholder="Présentation du plan de compensation" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sf-date" className="label">Date</label>
                  <input id="sf-date" type="date" required value={formationForm.date} onChange={e => setFormationForm({...formationForm, date: e.target.value})} className="input" />
                </div>
                <div>
                  <label htmlFor="sf-time" className="label">Heure</label>
                  <input id="sf-time" type="time" required value={formationForm.time} onChange={e => setFormationForm({...formationForm, time: e.target.value})} className="input" />
                </div>
              </div>
              <div>
                <label htmlFor="sf-trainer" className="label">Formateur</label>
                <input id="sf-trainer" type="text" required value={formationForm.trainer} onChange={e => setFormationForm({...formationForm, trainer: e.target.value})} placeholder="Dr. A. Marie" className="input" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => { setIsAddingFormation(false); setEditingFormationIndex(null); }} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" className="btn-primary flex-1">{isAddingFormation ? "Planifier" : "Enregistrer"}</button>
              </div>
            </form>
          )}

          {formations.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-ink-soft">Aucune formation programmée. Planifiez une session pour qu&apos;elle apparaisse aux partenaires.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {formations.map((form, idx) => {
                const d = formatDate(form.date);
                return (
                  <li key={idx} className="card p-3.5 flex items-center gap-3.5">
                    <div className="w-12 shrink-0 rounded-xl bg-forest text-cream text-center py-1.5" aria-hidden="true">
                      <span className="block font-heading text-xl leading-none">{d.day}</span>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-gold mt-0.5">{d.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-ink truncate">{form.title}</h4>
                      <p className="text-xs text-ink-soft mt-0.5"><span className="font-mono">{form.time}</span> · {form.trainer}</p>
                    </div>
                    <button onClick={() => handleEditFormation(idx)} aria-label={`Modifier ${form.title}`} className="shrink-0 p-2 rounded-lg text-ink-soft/70 hover:text-forest hover:bg-palm-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ───── PAIEMENTS ───── */}
      {activeTab === "paiement" && (
        <form onSubmit={handleSavePayment} className="card p-5 space-y-4">
          <div>
            <h3 className="section-title">Paiement Mobile Money</h3>
            <p className="text-xs text-ink-soft mt-1 leading-relaxed">
              Une fois activé, les partenaires pourront commander vos produits et vous payer directement depuis votre profil.
            </p>
          </div>

          <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-line cursor-pointer hover:border-palm/40 transition-colors">
            <span className="text-sm font-semibold text-ink">Accepter les paiements Mobile Money</span>
            <span className="relative inline-flex items-center shrink-0">
              <input type="checkbox" className="sr-only peer" checked={paymentEnabled} onChange={(e) => setPaymentEnabled(e.target.checked)} />
              <span className="w-11 h-6 bg-line rounded-full transition-colors peer-checked:bg-palm peer-focus-visible:ring-2 peer-focus-visible:ring-gold after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-transform peer-checked:after:translate-x-5"></span>
            </span>
          </label>

          {paymentEnabled && (
            <div className="space-y-3 p-4 rounded-xl bg-cream/70 border border-line">
              <div>
                <label htmlFor="sp-network" className="label">Réseau de réception</label>
                <select id="sp-network" className="input">
                  <option>Wave Côte d&apos;Ivoire</option>
                  <option>Orange Money</option>
                  <option>MTN MoMo</option>
                </select>
              </div>
              <div>
                <label htmlFor="sp-number" className="label">Numéro de réception</label>
                <input id="sp-number" type="tel" inputMode="tel" placeholder="07 01 02 03 04" className="input font-mono" />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full">Enregistrer les paramètres</button>
        </form>
      )}

      <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-danger w-full">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        Se déconnecter
      </button>
    </div>
  );
}
