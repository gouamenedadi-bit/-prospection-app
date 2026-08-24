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
    return <div className="flex justify-center py-20 text-forest">Chargement de votre espace...</div>;
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

  return (
    <div className="space-y-4 pb-6">
      <div className="bg-gradient-to-r from-forest-deep to-forest p-6 text-white text-center rounded-b-2xl shadow-md">
        <h2 className="text-2xl font-bold font-heading mb-1">Espace Stockiste</h2>
        <p className="text-sm opacity-90">Gérez votre bureau, vos produits et vos formations</p>
      </div>

      {showSaveMessage && (
        <div className="mx-5 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Modifications enregistrées avec succès !
        </div>
      )}

      {/* Tabs */}
      <div className="mx-5">
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
        {[
          { id: "profil", label: "Profil" },
          { id: "produits", label: "Produits" },
          { id: "formations", label: "Formations" },
          { id: "paiement", label: "Paiements" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-forest text-white shadow-md" 
                : "text-gray-500 hover:text-forest hover:bg-forest/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-4">
        
        {/* TAB: PROFIL */}
        {activeTab === "profil" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 mb-4">Informations du Bureau</h3>
            {isLoadingProfile ? (
              <div className="text-center py-10 text-gray-500">Chargement des informations...</div>
            ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nom du Responsable</label>
                <input 
                  type="text" 
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ville</label>
                  <input 
                    type="text" 
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({...profileForm, city: e.target.value})} 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Commune / Quartier</label>
                <input 
                  type="text" 
                  value={profileForm.neighborhood || profileForm.commune}
                  onChange={(e) => setProfileForm({...profileForm, neighborhood: e.target.value, commune: e.target.value})} 
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                />
              </div>
            </div>
            )}
            <button type="submit" disabled={isLoadingProfile} className="w-full bg-forest text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-forest-deep transition-all mt-4 disabled:opacity-50">
              Mettre à jour
            </button>
          </form>
        )}

        {/* TAB: PRODUITS */}
        {activeTab === "produits" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 mb-4">Gérer mon Stock</h3>

            {lowStockItems.length > 0 && editingIndex === null && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <h4 className="font-bold text-orange-800 text-sm">Stock faible — pensez à réapprovisionner</h4>
                </div>
                <ul className="space-y-1">
                  {lowStockItems.map((inv: any) => (
                    <li key={inv.id} className="text-xs text-orange-700 flex justify-between">
                      <span>{inv.produit?.name}</span>
                      <span className="font-bold">{inv.quantity === 0 ? "Rupture" : `${inv.quantity} restant${inv.quantity > 1 ? "s" : ""}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {editingIndex !== null ? (
              <form onSubmit={handleSaveProduct} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 mb-4 animate-in zoom-in-95 duration-200">
                <h4 className="font-bold text-gray-700 text-sm mb-2">Modifier la quantité</h4>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400">
                    {editForm.name.substring(0, 3)}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nom du produit</label>
                    <input type="text" disabled value={editForm.name} className="w-full px-3 py-2 bg-gray-200 text-gray-600 border border-gray-200 rounded-lg text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Points Volume</label>
                    <input type="text" disabled value={editForm.pv} className="w-full px-2 py-2 bg-gray-200 text-gray-600 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prix Partenaire</label>
                    <input type="text" disabled value={editForm.partnerPrice + " F"} className="w-full px-2 py-2 bg-gray-200 text-gray-600 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prix Public</label>
                    <input type="text" disabled value={editForm.publicPrice + " F"} className="w-full px-2 py-2 bg-gray-200 text-gray-600 border border-gray-200 rounded-lg text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Posologie</label>
                  <input type="text" disabled value={editForm.posology || ""} className="w-full px-3 py-2 bg-gray-200 text-gray-600 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                  <textarea disabled value={editForm.description || ""} rows={2} className="w-full px-3 py-2 bg-gray-200 text-gray-600 border border-gray-200 rounded-lg text-sm resize-none"></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">Quantité en stock</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editForm.quantity} 
                    onChange={e => setEditForm({...editForm, quantity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-white border-2 border-forest rounded-lg text-sm focus:ring-forest focus:border-forest font-bold" 
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-forest text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-forest-deep transition-all">
                    Enregistrer
                  </button>
                  <button type="button" onClick={() => setEditingIndex(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-300 transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
                {isLoadingProducts ? (
                  <div className="text-center py-10 text-gray-500">Chargement de votre stock...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">Aucun produit trouvé.</div>
                ) : (
                  products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image || `https://placehold.co/100x100?text=${encodeURIComponent(product.name.slice(0, 3))}`} alt="Produit" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 mb-0.5">
                      {product.pv} PV • <span className="text-gold font-semibold">{product.partnerPrice} F</span> / {product.publicPrice} F
                    </p>
                    <p className="text-xs text-gray-400 italic line-clamp-1 mb-1">
                      {product.posology}
                    </p>
                    <p className="text-xs text-gray-500 italic line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold mb-1 ${product.quantity > 0 ? 'text-forest' : 'text-gray-400'}`}>
                      Qté: {product.quantity}
                    </div>
                    <button 
                      onClick={() => handleEditProduct(idx)}
                      className="text-forest bg-forest/10 p-1.5 px-3 rounded-lg hover:bg-forest/20 transition-all text-xs font-semibold"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              ))
            )}
            </div>
          )}
          </div>
        )}

        {/* TAB: FORMATIONS */}
        {activeTab === "formations" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Mes Formations</h3>
              {!isAddingFormation && editingFormationIndex === null && (
                <button 
                  onClick={handleAddFormationClick}
                  className="bg-gold text-forest text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:brightness-110 transition-all flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Planifier
                </button>
              )}
            </div>

            {/* Form to edit or add formation */}
            {(isAddingFormation || editingFormationIndex !== null) ? (
              <form onSubmit={handleSaveFormation} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 mb-4 animate-in fade-in">
                <h4 className="font-bold text-gray-700 text-sm mb-2">{isAddingFormation ? "Nouvelle formation" : "Modifier la formation"}</h4>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Titre de la formation</label>
                  <input 
                    type="text" 
                    required 
                    value={formationForm.title} 
                    onChange={e => setFormationForm({...formationForm, title: e.target.value})}
                    placeholder="Ex: Présentation Plan de Compensation"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={formationForm.date} 
                      onChange={e => setFormationForm({...formationForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Heure</label>
                    <input 
                      type="time" 
                      required 
                      value={formationForm.time} 
                      onChange={e => setFormationForm({...formationForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom du formateur</label>
                  <input 
                    type="text" 
                    required 
                    value={formationForm.trainer} 
                    onChange={e => setFormationForm({...formationForm, trainer: e.target.value})}
                    placeholder="Ex: Dr. A. Marie"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" 
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-forest text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-forest-deep transition-all">
                    Enregistrer
                  </button>
                  <button type="button" onClick={() => { setIsAddingFormation(false); setEditingFormationIndex(null); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-300 transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            ) : null}

            {/* Formations List */}
            {formations.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <p className="text-sm text-gray-500 font-medium">Aucune formation programmée.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formations.map((form, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors relative group">
                    <button 
                      onClick={() => handleEditFormation(idx)}
                      className="absolute top-4 right-4 text-forest bg-forest/10 p-2 rounded-lg hover:bg-forest/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <h4 className="font-bold text-sm text-gray-800 pr-10">{form.title}</h4>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <p>📅 {form.date} à {form.time}</p>
                      <p>👨‍🏫 Formateur : {form.trainer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PAIEMENTS */}
        {activeTab === "paiement" && (
          <form onSubmit={handleSavePayment} className="space-y-4 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 mb-4">Module de Paiement</h3>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
              <div className="mt-0.5 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Activez ce module pour permettre aux partenaires d'ajouter vos produits au panier et de vous payer directement via Mobile Money depuis votre profil.
              </p>
            </div>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={paymentEnabled}
                  onChange={(e) => setPaymentEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
              </div>
              <span className="text-sm font-bold text-gray-700">Activer le paiement Mobile Money</span>
            </label>

            {paymentEnabled && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300 mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Réseau de réception</label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest">
                    <option>Wave Côte d'Ivoire</option>
                    <option>Orange Money</option>
                    <option>MTN MoMo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Numéro de réception</label>
                  <input type="tel" placeholder="Ex: 0102030405" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-forest focus:border-forest" />
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-forest text-white py-2.5 rounded-lg text-sm font-bold shadow hover:bg-forest-deep transition-all mt-4">
              Sauvegarder les paramètres
            </button>
          </form>
        )}

        {showSaveMessage && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100 text-center animate-in fade-in zoom-in duration-300">
            Modifications enregistrées !
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
