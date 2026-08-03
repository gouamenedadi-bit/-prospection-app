"use client";

import { useState, useEffect, useTransition } from "react";
import { getProducts, createProduct, updateProduct } from "@/app/actions/products";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  
  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startTransition] = useTransition();

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const res = await getProducts();
      if (res.success && res.data) {
        setProducts(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      }
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  // Fake data for demonstration
  const stats = {
    totalUsers: 128,
    newUsers: 12,
    totalStockistes: 14,
    totalPartenaires: 114,
    newPartenaires: 8,
    totalRevenue: "485 000 FCFA"
  };

  const users = [
    { id: 1, name: "Kouassi Marc", phone: "0708091011", role: "Stockiste", date: "28/07/2026", status: "Actif" },
    { id: 2, name: "Aya K.", phone: "0504030201", role: "Partenaire", date: "29/07/2026", status: "Actif" },
    { id: 3, name: "Issa T.", phone: "0102030405", role: "Partenaire", date: "30/07/2026", status: "En attente" },
  ];

  const payments = [
    { id: "TRX-1092", amount: "23 000 FCFA", buyer: "Issa T.", stockiste: "Kouassi Marc", method: "Orange Money", date: "30/07/2026", status: "Validé" },
    { id: "TRX-1093", amount: "8 500 FCFA", buyer: "Aya K.", stockiste: "Fatou D.", method: "Wave", date: "31/07/2026", status: "Validé" },
    { id: "TRX-1094", amount: "15 000 FCFA", buyer: "Jean P.", stockiste: "Kouassi Marc", method: "MTN Money", date: "31/07/2026", status: "Échoué" },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct({ ...editingProduct, image: data.url });
      } else {
        alert("Erreur lors de l'upload de l'image");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      const productData = {
        name: editingProduct.name,
        partnerPrice: Number(String(editingProduct.partnerPrice).replace(',', '.')) || 0,
        publicPrice: Number(String(editingProduct.publicPrice).replace(',', '.')) || 0,
        pv: Number(String(editingProduct.pv).replace(',', '.')) || 0,
        description: editingProduct.description || "",
        posology: editingProduct.posology || "",
        image: editingProduct.image || null,
      };

      if (isAdding) {
        const res = await createProduct(productData);
        if (res.success && res.data) {
          setProducts([res.data, ...products]);
          setEditingProduct(null);
          setIsAdding(false);
        } else {
          alert(res.error || "Erreur de création");
        }
      } else {
        const res = await updateProduct(editingProduct.id, productData);
        if (res.success && res.data) {
          setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
          setEditingProduct(null);
          setIsAdding(false);
        } else {
          alert(res.error || "Erreur de mise à jour");
        }
      }
    });
  };

  const handleEditClick = (product: any) => {
    setEditingProduct({...product});
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setEditingProduct({ name: "", partnerPrice: "", publicPrice: "", pv: "", description: "", posology: "", image: "" });
    setIsAdding(true);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setIsAuthenticated(true);
    }
  };

  const [loginStep, setLoginStep] = useState("login"); // "login", "forgot_password", "reset_code", "new_password"
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <style dangerouslySetInnerHTML={{__html: `nav { pointer-events: none; opacity: 0.4; filter: grayscale(100%); }`}} />
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-300">
          
          {loginStep === "login" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Accès Administrateur</h2>
                <p className="text-sm text-gray-500 mt-1">Veuillez vous connecter pour continuer</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email / Login</label>
                  <input 
                    type="email" 
                    required 
                    value={loginForm.email}
                    onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                  <input 
                    type="password" 
                    required 
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setLoginStep("forgot_password")} className="text-xs font-bold text-forest hover:underline">Mot de passe oublié ?</button>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-2">
                  Se connecter
                </button>
              </form>
            </>
          )}

          {loginStep === "forgot_password" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Mot de passe oublié</h2>
                <p className="text-sm text-gray-500 mt-1">Entrez votre email pour recevoir un code de réinitialisation.</p>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); setLoginStep("reset_code"); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Adresse Email</label>
                  <input 
                    type="email" 
                    required 
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="votre@email.com"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2">
                  Envoyer le code
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setLoginStep("login")} className="text-sm font-bold text-gray-500 hover:text-gray-900">Retour à la connexion</button>
                </div>
              </form>
            </>
          )}

          {loginStep === "reset_code" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Code de vérification</h2>
                <p className="text-sm text-gray-500 mt-1">Un code a été envoyé à <strong>{resetEmail || "votre email"}</strong>.</p>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); setLoginStep("new_password"); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Code à 6 chiffres</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-center tracking-widest text-lg font-bold"
                    placeholder="000000"
                  />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors mt-2">
                  Vérifier le code
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setLoginStep("forgot_password")} className="text-sm font-bold text-gray-500 hover:text-gray-900">Renvoyer le code</button>
                </div>
              </form>
            </>
          )}

          {loginStep === "new_password" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-forest/20 text-forest rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Nouveau mot de passe</h2>
                <p className="text-sm text-gray-500 mt-1">Veuillez définir votre nouveau mot de passe.</p>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); setLoginStep("login"); setLoginForm({...loginForm, password: ""}); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-forest text-white font-bold py-3 rounded-lg hover:bg-forest-deep transition-colors mt-2">
                  Enregistrer et se connecter
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Admin */}
      <div className="bg-gray-900 p-6 rounded-xl text-white shadow-md text-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-500/30">Accès Restreint Admin</span>
        </div>
        <h2 className="text-xl font-bold font-heading relative z-10">Super Panel Admin</h2>
        <p className="text-xs text-gray-400 mt-1 relative z-10">Gestion exclusive des produits et de la plateforme</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto no-scrollbar">
        {[
          { id: "products", label: "Gestion des Produits" },
          { id: "users", label: "Utilisateurs" },
          { id: "payments", label: "Paiements" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingProduct(null); setIsAdding(false); }}
            className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-gray-900 text-white shadow-md" 
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-h-[400px]">
        
        {/* TAB: PRODUITS */}
        {activeTab === "products" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Base de données Produits ({products.length})</h3>
              <button onClick={handleAddClick} className="bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Ajouter un produit
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Chargement des produits...</div>
            ) : editingProduct ? (
              <form onSubmit={handleSaveProduct} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-800">{isAdding ? "Nouveau Produit" : "Modifier le Produit"}</h4>
                  <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                
                {/* Image upload */}
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                  <div className="w-20 h-20 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden relative group">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Produit" className="w-full h-full object-contain" />
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Photo du produit</p>
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nom du produit</label>
                  <input type="text" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Prix Partenaire (F CFA)</label>
                    <input type="number" required value={editingProduct.partnerPrice} onChange={e => setEditingProduct({...editingProduct, partnerPrice: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Prix Public (F CFA)</label>
                    <input type="number" required value={editingProduct.publicPrice} onChange={e => setEditingProduct({...editingProduct, publicPrice: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PV (Points)</label>
                  <input type="number" step="0.1" value={editingProduct.pv || ""} onChange={e => setEditingProduct({...editingProduct, pv: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Posologie / Utilisation</label>
                  <input type="text" value={editingProduct.posology || ""} onChange={e => setEditingProduct({...editingProduct, posology: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description et indications</label>
                  <textarea required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                  <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                    {isSaving ? "Enregistrement..." : "Enregistrer le produit"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{product.name} <span className="text-green-600 font-bold ml-1 text-xs">({product.pv || 0} PV)</span></h4>
                        <div className="text-xs text-gray-600 mt-0.5 truncate max-w-[200px]">{product.posology || "Aucune posologie"}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">Public: {product.publicPrice} F</span>
                          <span className="text-[10px] text-gray-500 font-medium">Partenaire: {product.partnerPrice} F</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleEditClick(product)} className="text-gray-400 hover:text-gray-900 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: UTILISATEURS */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2">Utilisateurs inscrits</h3>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'Stockiste' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 border-t border-gray-100 pt-2 mt-1">
                    <span>Inscrit le {user.date}</span>
                    <span className={`${user.status === 'Actif' ? 'text-green-500' : 'text-orange-500'}`}>• {user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PAIEMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2">Historique des paiements</h3>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{payment.amount}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{payment.buyer} ➔ {payment.stockiste}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${payment.status === 'Validé' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 border-t border-gray-100 pt-2 mt-1">
                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{payment.method}</span>
                    <span>{payment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STATS TABLE SECTION EN BAS */}
      <div className="mt-8">
        <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Tableau des Statistiques
        </h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Indicateur</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm text-gray-800">Partenaires Longrich inscrits</p>
                  <p className="text-xs text-gray-500 mt-1">Total des partenaires validés</p>
                </td>
                <td className="p-4 text-right">
                  <span className="text-lg font-black text-gray-900">{stats.totalPartenaires}</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm text-gray-800">Stockistes inscrits</p>
                  <p className="text-xs text-gray-500 mt-1">Bureaux de distribution actifs</p>
                </td>
                <td className="p-4 text-right">
                  <span className="text-lg font-black text-gray-900">{stats.totalStockistes}</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm text-gray-800">Nouveaux partenaires inscrits</p>
                  <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-sm font-bold">{stats.newPartenaires}</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm text-gray-800">Nouveaux utilisateurs</p>
                  <p className="text-xs text-gray-500 mt-1">Inscriptions globales récentes</p>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-sm font-bold">{stats.newUsers}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
