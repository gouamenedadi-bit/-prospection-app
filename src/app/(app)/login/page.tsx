"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"partenaire" | "stockiste">("partenaire");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: activeTab,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
    } else {
      // Redirect to correct dashboard
      if (activeTab === "partenaire") {
        router.push("/dashboard/partner");
      } else {
        router.push("/dashboard/stockiste");
      }
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center min-h-[60vh] justify-center">
      <style dangerouslySetInnerHTML={{__html: `nav { pointer-events: none; opacity: 0.4; filter: grayscale(100%); }`}} />
      
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-300">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Connexion</h2>
          <p className="text-sm text-gray-500 mt-1">Accédez à votre espace membre</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("partenaire")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "partenaire" ? "bg-white text-gold shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Partenaire
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stockiste")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "stockiste" ? "bg-white text-forest shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Stockiste
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-semibold">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-md ${
              activeTab === "partenaire" ? "bg-gold hover:bg-gold/90" : "bg-forest hover:bg-forest-deep"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Pas encore de compte ? <br />
            {activeTab === "partenaire" ? (
              <Link href="/register/partner" className="text-gold font-bold hover:underline">S'inscrire comme Partenaire</Link>
            ) : (
              <Link href="/register/stockiste" className="text-forest font-bold hover:underline">S'inscrire comme Stockiste</Link>
            )}
          </p>
        </div>
      </div>
      
      <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 mt-4">
        Retour à l'accueil
      </Link>
    </div>
  );
}
