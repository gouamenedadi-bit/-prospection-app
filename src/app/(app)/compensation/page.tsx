export default function CompensationPlanPage() {
  const gains = [
    { type: "PAIEMENT ESPÈCE", num: "1", title: "Vente Directe", details: "Bénéfice immédiat sur la vente au détail", color: "bg-green-500", textColor: "text-white" },
    { type: "PAIEMENT ESPÈCE", num: "2", title: "Parrainage", details: "Bonus sur l'inscription de nouveaux partenaires", color: "bg-green-500", textColor: "text-white" },
    { type: "PAIEMENT ESPÈCE", num: "3", title: "Performance", details: "Bonus calculé sur le volume de groupe", color: "bg-green-500", textColor: "text-white" },
    { type: "PAIEMENT ESPÈCE", num: "4", title: "Développement", details: "Prime d'évolution de votre réseau", color: "bg-green-500", textColor: "text-white" },
    { type: "PAIEMENT ESPÈCE", num: "5", title: "Leadership", details: "Rémunération sur le succès de vos leaders", color: "bg-green-500", textColor: "text-white" },
    { type: "PAIEMENT ESPÈCE", num: "6", title: "Maintenance", details: "Bonus lié à la consommation mensuelle", color: "bg-green-500", textColor: "text-white" },
    { type: "RÉCOMPENSE NATURE", num: "7", title: "Voyages", details: "Des voyages internationaux tous frais payés", color: "bg-blue-600", textColor: "text-white" },
    { type: "RÉCOMPENSE NATURE", num: "8", title: "Voitures", details: "Des véhicules neufs offerts par la compagnie", color: "bg-blue-600", textColor: "text-white" },
    { type: "RÉCOMPENSE NATURE", num: "9", title: "Bourse d'étude", details: "Bourse MBA d'une valeur de 30 Millions FCFA", color: "bg-blue-600", textColor: "text-white" },
    { type: "RÉCOMPENSE NATURE", num: "10", title: "Immobilier", details: "Un chèque de 90 Millions FCFA pour une villa", color: "bg-blue-600", textColor: "text-white" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-center shadow-md">
        <h2 className="text-2xl font-bold text-white font-heading">Plan de Compensation</h2>
        <p className="text-sm text-white/90 mt-2">Découvrez les 10 manières d'être rémunéré chez Longrich.</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 text-center">Paiement en Espèce</h3>
        <div className="space-y-3">
          {gains.slice(0, 6).map((item, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 transition-all transform hover:scale-105 hover:shadow-lg duration-300 cursor-pointer">
              {/* Badge de gain avec chiffre centré */}
              <div className={`flex flex-col items-center justify-center min-w-[90px] h-[90px] px-1 rounded-lg shadow-inner ${item.color} ${item.textColor} flex-shrink-0 border border-black/5`}>
                <span className="text-[9px] uppercase font-bold opacity-90 tracking-wider">BONUS</span>
                <span className="text-4xl font-black leading-none my-1 drop-shadow-sm">{item.num}</span>
              </div>
              
              <div className="flex flex-col flex-1 gap-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">{item.type}</span>
                  <span className="text-base font-black text-green-700 tracking-wide">{item.title}</span>
                </div>
                
                <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                  <span className="text-xs text-blue-600 uppercase font-bold block mb-1">Détails</span>
                  <span className="text-sm text-gray-800 font-bold leading-relaxed">{item.details}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 text-center">Paiement en Nature</h3>
        <div className="space-y-3">
          {gains.slice(6).map((item, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 transition-all transform hover:scale-105 hover:shadow-lg duration-300 cursor-pointer">
              <div className={`flex flex-col items-center justify-center min-w-[90px] h-[90px] px-1 rounded-lg shadow-inner ${item.color} ${item.textColor} flex-shrink-0 border border-black/5`}>
                <span className="text-[9px] uppercase font-bold opacity-90 tracking-wider">BONUS</span>
                <span className="text-4xl font-black leading-none my-1 drop-shadow-sm">{item.num}</span>
              </div>
              
              <div className="flex flex-col flex-1 gap-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">{item.type}</span>
                  <span className="text-base font-black text-green-700 tracking-wide">{item.title}</span>
                </div>
                
                <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                  <span className="text-xs text-blue-600 uppercase font-bold block mb-1">Détails</span>
                  <span className="text-sm text-gray-800 font-bold leading-relaxed">{item.details}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
