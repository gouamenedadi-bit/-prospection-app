"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/passwordReset";

export default function ForgotPasswordPage() {
  const [activeTab, setActiveTab] = useState<"partenaire" | "stockiste">("partenaire");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPasswordReset(email, activeTab);
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="space-y-6 flex flex-col items-center min-h-[60vh] justify-center">
      <style dangerouslySetInnerHTML={{ __html: `nav { pointer-events: none; opacity: 0.4; filter: grayscale(100%); }` }} />

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Mot de passe oublié</h2>
          <p className="text-sm text-gray-500 mt-1">On vous envoie un lien de réinitialisation par email</p>
        </div>

        {isSent ? (
          <div className="p-4 bg-green-50 text-green-700 text-sm rounded-lg text-center font-semibold">
            Si un compte existe avec cet email, un lien de réinitialisation vient de vous être envoyé. Vérifiez votre boîte mail (et vos spams).
          </div>
        ) : (
          <>
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-forest focus:border-forest"
                  placeholder="votre@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-md ${
                  activeTab === "partenaire" ? "bg-gold hover:bg-gold/90" : "bg-forest hover:bg-forest-deep"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
