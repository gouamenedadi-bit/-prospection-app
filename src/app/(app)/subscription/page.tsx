"use client";

import { useState } from 'react';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handlePayment = async () => {
    setLoading(true);
    // Simulation d'appel à l'API de paiement (CinetPay/FedaPay)
    setTimeout(() => {
      setLoading(false);
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Abonnement Mensuel</h2>
        <p className="text-sm text-gray-500 mt-2">Activez votre visibilité sur la plateforme.</p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-green-800">Paiement Réussi !</h3>
          <p className="text-sm text-green-700">Votre compte est désormais visible pour tous les visiteurs pour les 30 prochains jours.</p>
          <button onClick={() => setStatus('idle')} className="text-green-800 font-semibold underline text-sm mt-4">Retour</button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">Forfait Standard</p>
              <p className="text-xs text-gray-500">Valable 1 mois</p>
            </div>
            <p className="text-xl font-bold text-green-700">2 000 FCFA</p>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">✅ Apparition sur la carte interactive</p>
            <p className="flex items-center gap-2">✅ Réception de leads (clients)</p>
            <p className="flex items-center gap-2">✅ Notifications SMS/WhatsApp</p>
          </div>

          <button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex justify-center items-center"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              "Payer via Mobile Money"
            )}
          </button>
          <div className="flex justify-center gap-4 opacity-50 mt-4">
            {/* Logos de paiement fictifs */}
            <span className="text-xs font-bold text-orange-500">Orange Money</span>
            <span className="text-xs font-bold text-yellow-500">MTN MoMo</span>
            <span className="text-xs font-bold text-blue-500">Wave</span>
          </div>
        </div>
      )}
    </div>
  );
}
