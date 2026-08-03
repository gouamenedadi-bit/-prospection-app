"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AbonnementPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const plans = [
    { id: 0, duration: "14 jours", price: "Essai gratuit", popular: false },
    { id: 1, duration: "1 mois", price: "500 FCFA", popular: false },
    { id: 2, duration: "2 mois", price: "1 000 FCFA", popular: false },
    { id: 3, duration: "3 mois", price: "1 500 FCFA", popular: false },
    { id: 6, duration: "6 mois", price: "3 000 FCFA", popular: true },
    { id: 12, duration: "1 an", price: "5 000 FCFA", popular: false },
  ];

  return (
    <div className="space-y-6 pb-8">
      <style dangerouslySetInnerHTML={{__html: `nav { display: none !important; }`}} />
      <div className="bg-gradient-to-r from-forest to-forest-deep p-8 rounded-xl text-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-white font-heading relative z-10">Abonnement Premium</h2>
        <p className="text-white/90 mt-2 relative z-10 max-w-lg mx-auto">
          Débloquez toutes les fonctionnalités de l'application Prospections Longrich pour développer votre réseau plus rapidement.
        </p>
      </div>

      <div className="pt-2">
        <h3 className="text-xl font-bold text-ink font-heading text-center mb-6">Choisissez votre forfait</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                selectedPlan === plan.id ? 'border-forest shadow-md transform scale-105' : 'border-line shadow-sm hover:border-forest/50 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold text-forest-deep text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Le plus populaire
                </div>
              )}
              
              <div className="text-center">
                <div className="text-gray-500 font-semibold mb-2">Forfait</div>
                <div className="text-3xl font-bold text-forest font-heading mb-4">{plan.duration}</div>
                <div className="text-2xl font-bold text-ink">{plan.price}</div>
              </div>

              {selectedPlan === plan.id && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-forest text-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-line shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">Forfait sélectionné</p>
              <p className="font-bold text-forest text-lg">{plans.find(p => p.id === selectedPlan)?.duration} - {plans.find(p => p.id === selectedPlan)?.price}</p>
            </div>
            <button 
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto bg-forest text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-forest-deep transition-all"
            >
              Procéder au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
