"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/app/actions/products";
import { getPendingPayments, validatePayment } from "@/app/actions/subscription";
import { getAllUsers } from "@/app/actions/adminUsers";
import { getAllAvis } from "@/app/actions/avis";

// Montants en F CFA avec séparateur de milliers français ("3 120").
const fcfa = (n: unknown) => (Number(n) || 0).toLocaleString("fr-FR");
const pvFmt = (n: unknown) => (Number(n) || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream";
const inputCls =
  "w-full px-3 py-2.5 bg-white border border-line rounded-lg text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-palm focus:ring-2 focus:ring-palm/20 transition-colors";
const labelCls = "block text-xs font-semibold text-ink-soft mb-1.5";

function Stamp({ pv }: { pv: unknown }) {
  // Le "cachet" PV : la valeur en points, signature visuelle du catalogue.
  return (
    <span className="inline-flex items-baseline gap-0.5 px-1.5 py-0.5 rounded-md border border-dashed border-gold bg-gold-light text-[#B4560B] font-mono text-[13px] font-semibold leading-none whitespace-nowrap">
      {pvFmt(pv)}
      <span className="text-[11px] tracking-wider">PV</span>
    </span>
  );
}

function RoleChip({ role }: { role: string }) {
  const isStockiste = role.toLowerCase() === "stockiste";
  return (
    <span
      className={`text-[13px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full leading-none ${
        isStockiste ? "bg-gold-light text-[#B4560B]" : "bg-palm-light text-palm"
      }`}
    >
      {isStockiste ? "Stockiste" : "Partenaire"}
    </span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-center py-12 px-6 text-sm text-ink-soft">{children}</div>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user?.role === "admin";

  const [activeTab, setActiveTab] = useState("products");

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
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

  // Utilisateurs réels (Stockistes + Partenaires)
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [memberFilter, setMemberFilter] = useState<"all" | "Partenaire" | "Stockiste">("all");
  const [memberSearch, setMemberSearch] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    const res = await getAllUsers();
    if (res.success && res.data) {
      setAllUsers(res.data);
    }
    setIsLoadingUsers(false);
  };

  // Chargé une première fois (pour les chiffres de l'en-tête, toujours visibles),
  // puis rechargé à chaque entrée sur l'onglet Utilisateurs pour rester à jour.
  useEffect(() => {
    if (isAuthenticated) loadUsers();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "users") loadUsers();
  }, [isAuthenticated, activeTab]);

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const stats = {
    newUsers: allUsers.filter((u) => new Date(u.createdAt) >= startOfMonth).length,
    totalStockistes: allUsers.filter((u) => u.role === "Stockiste").length,
    totalPartenaires: allUsers.filter((u) => u.role === "Partenaire").length,
    newPartenaires: allUsers.filter((u) => u.role === "Partenaire" && new Date(u.createdAt) >= startOfMonth).length,
  };

  // Abonnements en attente de validation
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [validatingId, setValidatingId] = useState<number | null>(null);

  const loadPendingPayments = async () => {
    setIsLoadingPayments(true);
    const res = await getPendingPayments();
    if (res.success && res.data) {
      setPendingPayments(res.data);
    }
    setIsLoadingPayments(false);
  };

  // Chargé dès la connexion : l'en-tête annonce les paiements à valider.
  useEffect(() => {
    if (isAuthenticated) loadPendingPayments();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "payments") {
      loadPendingPayments();
    }
  }, [isAuthenticated, activeTab]);

  // Avis des utilisateurs
  const [allAvis, setAllAvis] = useState<any[]>([]);
  const [isLoadingAvis, setIsLoadingAvis] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoadingAvis(true);
    getAllAvis().then((res) => {
      if (res.success && res.data) {
        setAllAvis(res.data);
      }
      setIsLoadingAvis(false);
    });
  }, [isAuthenticated, activeTab === "avis"]);

  const avgRating = allAvis.length ? allAvis.reduce((s, a) => s + (Number(a.rating) || 0), 0) / allAvis.length : 0;

  const handleValidatePayment = async (id: number) => {
    setValidatingId(id);
    const res = await validatePayment(id);
    if (res.success) {
      await loadPendingPayments();
    } else {
      alert(res.error || "Erreur lors de la validation.");
    }
    setValidatingId(null);
  };

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.")) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert(res.error || "Erreur lors de la suppression");
      }
    }
  };

  const handleAddClick = () => {
    setEditingProduct({ name: "", partnerPrice: "", publicPrice: "", pv: "", description: "", posology: "", image: "" });
    setIsAdding(true);
  };

  const goToTab = (id: string) => {
    setActiveTab(id);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: loginForm.email,
      password: loginForm.password,
      role: "admin",
    });
    if (res?.error) {
      setLoginError("Email ou mot de passe incorrect. Vérifiez la saisie ou utilisez « Mot de passe oublié ».");
    }
    setIsLoggingIn(false);
  };

  if (status === "loading") {
    return <div className="flex justify-center py-20 text-sm text-ink-soft">Chargement…</div>;
  }

  /* ───────────────────────── CONNEXION ───────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] py-6">
        <style dangerouslySetInnerHTML={{__html: `nav[data-bottom-nav] { pointer-events: none; opacity: 0.4; filter: grayscale(100%); }`}} />
        <div className="w-full bg-white rounded-2xl border border-line overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
          <div className="bg-forest-deep px-6 pt-7 pb-6 text-cream">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-gold">Espace administrateur</p>
            <h2 className="font-heading text-[28px] leading-tight mt-2">Connexion</h2>
            <p className="text-sm text-cream/70 mt-1">Catalogue, membres et abonnements de la plateforme.</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div role="alert" className="p-3 bg-[#FBE7DE] text-clay text-sm rounded-lg font-semibold">
                {loginError}
              </div>
            )}
            <div>
              <label htmlFor="admin-email" className={labelCls}>Email</label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                className={inputCls}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="text-xs font-semibold text-ink-soft">Mot de passe</label>
                <Link href="/admin/forgot-password" className={`text-xs font-semibold text-palm hover:text-forest underline-offset-2 hover:underline rounded ${focusRing}`}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showAdminPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className={`${inputCls} pr-11`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(v => !v)}
                  className={`absolute inset-y-0 right-0 flex items-center px-3 text-ink-soft/60 hover:text-ink rounded-r-lg ${focusRing}`}
                  aria-label={showAdminPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showAdminPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoggingIn} className={`w-full bg-forest text-cream font-bold py-3 rounded-xl hover:bg-forest-deep transition-colors mt-2 disabled:opacity-50 ${focusRing}`}>
              {isLoggingIn ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ───────────────────────── TABLEAU DE BORD ───────────────────────── */
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(productSearch.toLowerCase()));
  const pendingCount = pendingPayments.length;
  const today = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  const tabs = [
    { id: "products", label: "Catalogue", count: products.length, alert: false },
    { id: "users", label: "Membres", count: allUsers.length, alert: false },
    { id: "payments", label: "Paiements", count: pendingCount, alert: pendingCount > 0 },
    { id: "avis", label: "Avis", count: allAvis.length, alert: false },
  ];

  const margin = editingProduct
    ? (Number(String(editingProduct.publicPrice).replace(',', '.')) || 0) - (Number(String(editingProduct.partnerPrice).replace(',', '.')) || 0)
    : 0;
  const marginPct = editingProduct && Number(editingProduct.publicPrice) > 0 ? Math.round((margin / Number(editingProduct.publicPrice)) * 100) : 0;

  return (
    <div className="space-y-5 pb-8 -mx-1">
      {/* En-tête : ce qui demande une action, puis les chiffres du réseau */}
      <section className="relative overflow-hidden rounded-3xl bg-forest bg-linear-to-br from-forest via-[#0F8C5A] to-palm text-white shadow-[0_20px_45px_-25px_rgb(12_122_78/0.65)] rise-in">
        {/* Halos décoratifs, pour donner de la lumière au vert */}
        <span className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-[#7FE0B0]/15 blur-3xl" aria-hidden="true" />

        <div className="relative px-5 sm:px-7 pt-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[0.14em] text-[#FFD9B0] first-letter:uppercase">{today}</p>
            <h2 className="font-heading text-[30px] sm:text-[34px] leading-tight mt-1">Tableau de bord</h2>
            <p className="text-[15px] text-white/85 mt-1">Bienvenue dans votre espace administrateur.</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={`shrink-0 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-full px-4 py-2 transition-colors ${focusRing} focus-visible:ring-offset-forest`}
          >
            Se déconnecter
          </button>
        </div>

        <div className="relative px-5 sm:px-7 pt-5">
          {isLoadingPayments ? (
            <div className="h-14 rounded-2xl bg-white/10 animate-pulse" />
          ) : pendingCount > 0 ? (
            <button
              onClick={() => goToTab("payments")}
              className={`group w-full flex items-center justify-between gap-3 bg-gold text-white rounded-2xl px-5 py-4 text-left font-bold text-base shadow-[0_10px_25px_-12px_rgb(239_123_26/0.9)] hover:brightness-105 active:scale-[0.99] transition ${focusRing} focus-visible:ring-offset-forest`}
            >
              <span className="flex items-center gap-3">
                <span className="relative flex w-3 h-3" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-white/80 motion-safe:animate-ping" />
                  <span className="relative w-3 h-3 rounded-full bg-white" />
                </span>
                <span>
                  <span className="tabular-nums">{pendingCount}</span> paiement{pendingCount > 1 ? "s" : ""} à valider
                </span>
              </span>
              <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
            </button>
          ) : (
            <p className="flex items-center gap-2.5 rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-[15px] font-medium text-white">
              <span className="w-2 h-2 rounded-full bg-[#B6F0D2]" aria-hidden="true" />
              Aucun paiement en attente de validation.
            </p>
          )}
        </div>

        <dl className="relative grid grid-cols-2 desk:grid-cols-4 gap-3 px-5 sm:px-7 pt-5 pb-6">
          {[
            { label: "Partenaires", value: stats.totalPartenaires, extra: stats.newPartenaires ? `+${stats.newPartenaires} ce mois` : "aucun ce mois" },
            { label: "Stockistes", value: stats.totalStockistes, extra: "bureaux inscrits" },
            { label: "Inscriptions", value: stats.newUsers, extra: "ce mois-ci" },
            { label: "Produits", value: products.length, extra: "au catalogue" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="rise-in rounded-2xl bg-white/[0.13] border border-white/20 backdrop-blur-sm px-4 py-4 transition-colors hover:bg-white/20"
              style={{ ["--i" as string]: i + 2 } as React.CSSProperties}
            >
              <dt className="text-sm font-semibold text-white/90">{s.label}</dt>
              <dd className="mt-1.5">
                <span className="block text-[34px] leading-none font-bold tabular-nums">
                  {(s.label === "Produits" ? isLoading : isLoadingUsers) ? "–" : s.value}
                </span>
                <span className="block text-sm text-white/80 mt-1.5">{s.extra}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Onglets */}
      <div role="tablist" aria-label="Sections de l'administration" className="grid grid-cols-4 gap-1.5 bg-white border border-line p-1.5 rounded-2xl shadow-sm rise-in" style={{ ["--i" as string]: 6 } as React.CSSProperties}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => goToTab(tab.id)}
              className={`relative flex flex-col items-center gap-1 py-2.5 rounded-xl text-sm sm:text-[15px] font-bold transition-all duration-200 ${focusRing} ${
                active ? "bg-palm text-white shadow-[0_8px_18px_-10px_rgb(18_160_106/0.9)]" : "text-ink-soft hover:text-forest hover:bg-palm-light"
              }`}
            >
              {tab.label}
              <span
                className={`min-w-7 px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                  active ? "bg-white/25 text-white" : tab.alert ? "bg-gold-light text-gold-deep" : "bg-cream-deep text-ink-soft"
                }`}
              >
                {tab.count}
              </span>
              {tab.alert && !active && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-gold motion-safe:animate-pulse" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* ───── CATALOGUE ───── */}
      {activeTab === "products" && (
        <section className="space-y-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
          {editingProduct ? (
            <form onSubmit={handleSaveProduct} className="bg-white rounded-2xl border border-line overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-line bg-cream/60">
                <h3 className="font-bold text-ink">{isAdding ? "Nouveau produit" : "Modifier le produit"}</h3>
                <button type="button" onClick={() => setEditingProduct(null)} className={`text-ink-soft hover:text-ink p-1 rounded ${focusRing}`} aria-label="Fermer sans enregistrer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-cream border border-line rounded-xl flex items-center justify-center text-ink-soft/40 overflow-hidden shrink-0">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Photo du produit" className="w-full h-full object-contain" />
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor="product-image" className={labelCls}>Photo du produit</label>
                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-ink-soft file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest file:text-cream hover:file:bg-forest-deep"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="product-name" className={labelCls}>Nom du produit</label>
                  <input id="product-name" type="text" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className={inputCls} />
                </div>

                <fieldset className="rounded-xl border border-line p-3 space-y-3">
                  <legend className="px-1 text-xs font-semibold text-ink-soft">Prix et points</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="product-public" className={labelCls}>Prix public (F CFA)</label>
                      <input id="product-public" type="number" required inputMode="numeric" value={editingProduct.publicPrice} onChange={e => setEditingProduct({...editingProduct, publicPrice: e.target.value})} className={`${inputCls} font-mono`} />
                    </div>
                    <div>
                      <label htmlFor="product-partner" className={labelCls}>Prix partenaire (F CFA)</label>
                      <input id="product-partner" type="number" required inputMode="numeric" value={editingProduct.partnerPrice} onChange={e => setEditingProduct({...editingProduct, partnerPrice: e.target.value})} className={`${inputCls} font-mono`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <label htmlFor="product-pv" className={labelCls}>PV (points)</label>
                      <input id="product-pv" type="number" step="0.1" inputMode="decimal" value={editingProduct.pv || ""} onChange={e => setEditingProduct({...editingProduct, pv: e.target.value})} className={`${inputCls} font-mono`} />
                    </div>
                    <p className={`text-xs pb-2.5 ${margin < 0 ? "text-clay font-semibold" : "text-ink-soft"}`}>
                      Marge partenaire :{" "}
                      <span className="font-mono font-semibold text-ink">{fcfa(margin)} F</span>
                      {marginPct !== 0 && <span className="font-mono"> ({marginPct} %)</span>}
                    </p>
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="product-posology" className={labelCls}>Posologie / utilisation</label>
                  <input id="product-posology" type="text" value={editingProduct.posology || ""} onChange={e => setEditingProduct({...editingProduct, posology: e.target.value})} className={inputCls} placeholder="Ex. 2 comprimés matin et soir" />
                </div>

                <div>
                  <label htmlFor="product-description" className={labelCls}>Description et indications</label>
                  <textarea id="product-description" required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} rows={4} className={inputCls} />
                </div>
              </div>

              <div className="flex justify-end gap-2 px-4 py-3 border-t border-line bg-cream/60">
                <button type="button" onClick={() => setEditingProduct(null)} className={`px-4 py-2 text-sm font-semibold text-ink-soft bg-white border border-line rounded-lg hover:text-ink ${focusRing}`}>Annuler</button>
                <button type="submit" disabled={isSaving} className={`px-4 py-2 text-sm font-bold text-cream bg-forest rounded-lg hover:bg-forest-deep disabled:opacity-50 ${focusRing}`}>
                  {isSaving ? "Enregistrement…" : isAdding ? "Ajouter le produit" : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="w-4 h-4 text-ink-soft/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input
                    type="search"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher un produit"
                    aria-label="Rechercher un produit"
                    className={`${inputCls} pl-9`}
                  />
                </div>
                <button onClick={handleAddClick} className={`shrink-0 bg-forest text-cream text-sm font-bold px-3.5 rounded-lg hover:bg-forest-deep transition-colors flex items-center gap-1.5 ${focusRing}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  Ajouter
                </button>
              </div>

              {/* La liste de prix */}
              <div className="bg-white rounded-2xl border border-line overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-cream/70 border-b border-line font-mono text-[12px] uppercase tracking-[0.14em] text-ink-soft">
                  <span>Produit</span>
                  <span>Public / Partenaire</span>
                </div>

                {isLoading ? (
                  <Empty>Chargement du catalogue…</Empty>
                ) : filteredProducts.length === 0 ? (
                  <Empty>
                    {productSearch ? (
                      <>Aucun produit ne correspond à « <span className="font-semibold text-ink">{productSearch}</span> ». Vérifiez l'orthographe ou ajoutez-le au catalogue.</>
                    ) : (
                      <>Le catalogue est vide. Ajoutez un premier produit pour qu'il apparaisse aux partenaires et stockistes.</>
                    )}
                  </Empty>
                ) : (
                  <ul className="divide-y divide-line">
                    {filteredProducts.map((product) => (
                      <li key={product.id} className="group flex gap-3 px-3 py-3 hover:bg-cream/50 transition-colors">
                        <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center text-ink-soft/30 overflow-hidden shrink-0">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-contain" loading="lazy" />
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[15px] font-semibold text-ink leading-snug line-clamp-2">{product.name}</h4>
                            <div className="text-right shrink-0 font-mono tabular-nums leading-tight">
                              <div className="text-[15px] font-semibold text-forest">{fcfa(product.publicPrice)}<span className="text-[12px] text-ink-soft font-normal"> F</span></div>
                              <div className="text-[13px] text-ink-soft">{fcfa(product.partnerPrice)} F</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Stamp pv={product.pv} />
                              <span className="text-[13px] text-ink-soft truncate">{product.posology || "Posologie non renseignée"}</span>
                            </div>
                            <div className="flex shrink-0 -mr-1">
                              <button onClick={() => handleEditClick(product)} className={`p-1.5 rounded-md text-ink-soft/60 hover:text-forest hover:bg-palm-light ${focusRing}`} aria-label={`Modifier ${product.name}`} title="Modifier">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className={`p-1.5 rounded-md text-ink-soft/60 hover:text-clay hover:bg-[#FBE7DE] ${focusRing}`} aria-label={`Supprimer ${product.name}`} title="Supprimer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* ───── MEMBRES ───── */}
      {activeTab === "users" && (
        <section className="bg-white rounded-3xl border border-line overflow-hidden shadow-[0_12px_35px_-25px_rgb(12_122_78/0.45)] rise-in">
          <header className="px-5 sm:px-6 pt-5 pb-4 border-b border-line space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="section-title text-[22px]">Membres inscrits</h3>
                <p className="text-[15px] text-ink-soft mt-1">
                  <strong className="text-ink tabular-nums">{stats.totalPartenaires}</strong> partenaires ·{" "}
                  <strong className="text-ink tabular-nums">{stats.totalStockistes}</strong> stockistes ·{" "}
                  <strong className="text-palm tabular-nums">{allUsers.filter((u) => u.isActive).length}</strong> actifs
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <svg className="w-5 h-5 text-ink-soft/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="search"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Nom ou téléphone"
                  aria-label="Rechercher un membre par nom ou téléphone"
                  className="w-full pl-11 pr-3 py-3 bg-cream border border-line rounded-xl text-[15px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-palm focus:ring-2 focus:ring-palm/20 transition-colors"
                />
              </div>
              <div className="flex gap-1.5" role="group" aria-label="Filtrer par type de membre">
                {([
                  ["all", "Tous"],
                  ["Partenaire", "Partenaires"],
                  ["Stockiste", "Stockistes"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMemberFilter(id)}
                    aria-pressed={memberFilter === id}
                    className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${focusRing} ${
                      memberFilter === id ? "bg-forest text-white" : "bg-cream text-ink-soft hover:text-forest hover:bg-palm-light"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </header>
          {isLoadingUsers ? (
            <Empty>Chargement des membres…</Empty>
          ) : allUsers.length === 0 ? (
            <Empty>Aucun membre inscrit pour l'instant. Les partenaires et stockistes apparaîtront ici dès leur inscription.</Empty>
          ) : (() => {
            const q = memberSearch.trim().toLowerCase();
            const qDigits = memberSearch.replace(/\D/g, "");
            const shown = allUsers.filter(
              (u) =>
                (memberFilter === "all" || u.role === memberFilter) &&
                (!q || String(u.name ?? "").toLowerCase().includes(q) || (qDigits.length >= 2 && String(u.phone ?? "").replace(/\D/g, "").includes(qDigits)))
            );
            if (shown.length === 0) return <Empty>Aucun membre ne correspond à cette recherche.</Empty>;
            return (
              <ul className="divide-y divide-line">
                {shown.map((user, i) => {
                  const initials = String(user.name ?? "?").trim().split(/\s+/).map((p: string) => p[0]).slice(0, 2).join("").toUpperCase();
                  const isStockiste = String(user.role).toLowerCase() === "stockiste";
                  return (
                    <li
                      key={`${user.role}-${user.id}`}
                      className="rise-in group px-5 sm:px-6 py-4 flex items-center gap-4 transition-colors hover:bg-palm-light/50"
                      style={{ ["--i" as string]: i } as React.CSSProperties}
                    >
                      <span
                        className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-base font-bold transition-transform group-hover:scale-105 ${
                          isStockiste ? "bg-gold-light text-gold-deep" : "bg-palm-light text-forest"
                        }`}
                        aria-hidden="true"
                      >
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <p className="font-bold text-[17px] text-ink truncate capitalize">{String(user.name ?? "").toLowerCase()}</p>
                          <RoleChip role={user.role} />
                        </div>
                        <p className="text-[15px] text-ink-soft mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                          <a href={`tel:${user.phone}`} className="font-semibold text-ink hover:text-palm tabular-nums">{user.phone}</a>
                          <span>Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
                          user.isActive ? "bg-palm-light text-forest" : "bg-clay-light text-clay"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-palm" : "bg-clay"}`} aria-hidden="true" />
                        {user.isActive ? "Actif" : "Expiré"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            );
          })()}
        </section>
      )}

      {/* ───── PAIEMENTS ───── */}
      {activeTab === "payments" && (
        <section className="space-y-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
          <div className="px-1">
            <h3 className="font-bold text-ink">Abonnements à valider</h3>
            <p className="text-xs text-ink-soft mt-0.5">Vérifiez la réception du paiement avant de valider : l'abonnement est activé immédiatement.</p>
          </div>
          {isLoadingPayments ? (
            <div className="bg-white rounded-2xl border border-line"><Empty>Chargement des paiements…</Empty></div>
          ) : pendingPayments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-line"><Empty>Aucun paiement en attente. Les nouvelles demandes d'abonnement apparaîtront ici.</Empty></div>
          ) : (
            pendingPayments.map((payment) => (
              <article key={payment.id} className="bg-white rounded-2xl border border-line border-l-4 border-l-gold p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xl font-semibold text-ink tabular-nums">{fcfa(payment.amount)} <span className="text-xs text-ink-soft font-normal">F CFA</span></p>
                    <p className="text-sm font-semibold text-ink mt-0.5">{payment.planLabel}{payment.provider === "wave" ? " · payé par Wave (à vérifier dans Wave)" : ""}</p>
                  </div>
                  <span className="shrink-0 text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-light text-[#B4560B]">En attente</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-ink-soft">
                  <span className="font-semibold text-ink truncate">{payment.accountName}</span>
                  <RoleChip role={payment.accountType} />
                  <span className="font-mono ml-auto shrink-0">{new Date(payment.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <button
                  onClick={() => handleValidatePayment(payment.id)}
                  disabled={validatingId === payment.id}
                  className={`w-full mt-3 bg-forest text-cream text-sm font-bold py-2.5 rounded-xl hover:bg-forest-deep transition-colors disabled:opacity-50 ${focusRing}`}
                >
                  {validatingId === payment.id ? "Validation…" : "Valider le paiement"}
                </button>
              </article>
            ))
          )}
        </section>
      )}

      {/* ───── AVIS ───── */}
      {activeTab === "avis" && (
        <section className="bg-white rounded-2xl border border-line overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
          <header className="px-4 py-3 border-b border-line flex items-end justify-between gap-3">
            <div>
              <h3 className="font-bold text-ink">Avis des membres</h3>
              <p className="text-xs text-ink-soft mt-0.5"><span className="font-mono">{allAvis.length}</span> avis reçus</p>
            </div>
            {allAvis.length > 0 && (
              <p className="text-right">
                <span className="font-mono text-2xl font-semibold text-ink">{avgRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}</span>
                <span className="text-xs text-ink-soft"> / 5</span>
              </p>
            )}
          </header>
          {isLoadingAvis ? (
            <Empty>Chargement des avis…</Empty>
          ) : allAvis.length === 0 ? (
            <Empty>Aucun avis pour l'instant. Les membres peuvent en laisser un depuis leur tableau de bord.</Empty>
          ) : (
            <ul className="divide-y divide-line">
              {allAvis.map((avis) => (
                <li key={avis.id} className="px-4 py-3">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-semibold text-sm text-ink truncate">{avis.accountName}</p>
                      <RoleChip role={avis.accountType} />
                    </div>
                    <div className="flex gap-0.5 shrink-0" aria-label={`${avis.rating} sur 5`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-3.5 h-3.5 ${star <= avis.rating ? "text-gold" : "text-line"}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {avis.comment && <p className="text-sm text-ink mt-1.5 leading-relaxed">{avis.comment}</p>}
                  <p className="font-mono text-[13px] text-ink-soft mt-1.5">{new Date(avis.createdAt).toLocaleDateString("fr-FR")}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
