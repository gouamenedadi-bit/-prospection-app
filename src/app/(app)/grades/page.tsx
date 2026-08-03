export default function GradesCompensations() {
  const grades = [
    { gradeTitle: "DIRECTEUR", level: "5", suffix: "ÉTOILES", pv: "60 000 000 PV", conditions: "Min 3 pieds (1 Dir. 3 étoiles/pied)", color: "bg-yellow-500", textColor: "text-white" },
    { gradeTitle: "DIRECTEUR", level: "4", suffix: "ÉTOILES", pv: "20 000 000 PV", conditions: "Min 3 pieds (1 Dir. 2 étoiles/pied)", color: "bg-yellow-400", textColor: "text-yellow-900" },
    { gradeTitle: "DIRECTEUR", level: "3", suffix: "ÉTOILES", pv: "9 000 000 PV", conditions: "Min 3 pieds (1 Dir. 1 étoile/pied)", color: "bg-yellow-300", textColor: "text-yellow-900" },
    { gradeTitle: "DIRECTEUR", level: "2", suffix: "ÉTOILES", pv: "3 750 000 PV", conditions: "Min 3 pieds (Diamant 7/pied)", color: "bg-yellow-200", textColor: "text-yellow-900" },
    { gradeTitle: "DIRECTEUR", level: "1", suffix: "ÉTOILE", pv: "1 500 000 PV", conditions: "Min 3 pieds (Diamant 6/pied)", color: "bg-yellow-100", textColor: "text-yellow-900" },
    { gradeTitle: "DIAMANT", level: "7", suffix: "", pv: "450 000 PV", conditions: "Min 3 pieds (Diamant 5/pied)", color: "bg-blue-600", textColor: "text-white" },
    { gradeTitle: "DIAMANT", level: "6", suffix: "", pv: "225 000 PV", conditions: "Min 2 pieds (Diamant 5/pied)", color: "bg-blue-500", textColor: "text-white" },
    { gradeTitle: "DIAMANT", level: "5", suffix: "", pv: "75 000 PV", conditions: "Min 2 pieds (Diamant 4/pied)", color: "bg-blue-400", textColor: "text-white" },
    { gradeTitle: "DIAMANT", level: "4", suffix: "", pv: "15 000 PV", conditions: "Min 2 pieds (Diamant 3/pied)", color: "bg-blue-300", textColor: "text-blue-900" },
    { gradeTitle: "DIAMANT", level: "3", suffix: "", pv: "3 600 PV", conditions: "Min 2 pieds (Diamant 2/pied)", color: "bg-blue-200", textColor: "text-blue-900" },
    { gradeTitle: "DIAMANT", level: "2", suffix: "", pv: "1 680 PV", conditions: "Aucune", color: "bg-gray-400", textColor: "text-white" },
    { gradeTitle: "DIAMANT", level: "1", suffix: "", pv: "720 PV", conditions: "Aucune", color: "bg-gray-300", textColor: "text-gray-900" },
    { gradeTitle: "PRÉ-DIAMANT", level: "2", suffix: "", pv: "240 PV", conditions: "Aucune", color: "bg-gray-200", textColor: "text-gray-900" },
    { gradeTitle: "PRÉ-DIAMANT", level: "1", suffix: "", pv: "165 PV", conditions: "Aucune", color: "bg-gray-100", textColor: "text-gray-900" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-forest to-forest-deep p-6 rounded-xl text-center shadow-md">
        <h2 className="text-2xl font-bold text-white font-heading">Grades Longrich</h2>
        <p className="text-sm text-white/90 mt-2">Découvrez les niveaux d'évolution, les PV requis et les conditions sur les branches.</p>
      </div>

      <div className="space-y-3">
        {grades.map((item, i) => {
          let categoryTitle = null;
          if (i === 0) categoryTitle = "DIRECTEURS + ÉTOILES";
          if (i === 5) categoryTitle = "LES DIAMANTS";

          return (
            <div key={i} className="flex flex-col gap-3">
              {categoryTitle && (
                <div className="pt-2 pb-1 text-center">
                  <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide border-b-2 border-gold inline-block pb-1">{categoryTitle}</h3>
                </div>
              )}
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 transition-all transform hover:scale-105 hover:shadow-lg duration-300 cursor-pointer">
                {/* Badge de grade avec chiffre centré */}
                <div className={`flex flex-col items-center justify-center min-w-[90px] h-[90px] px-1 rounded-lg shadow-inner ${item.color} ${item.textColor} flex-shrink-0 border border-black/5`}>
                  <span className="text-[9px] uppercase font-bold opacity-90 tracking-wider">{item.gradeTitle}</span>
                  <span className="text-3xl font-black leading-none my-1 drop-shadow-sm">{item.level}</span>
                  {item.suffix && <span className="text-[9px] uppercase font-bold opacity-90 tracking-wider">{item.suffix}</span>}
                </div>
                
                <div className="flex flex-col flex-1 gap-2">
                  <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Volume (PV)</span>
                    <span className="text-base font-black text-green-700 tracking-wide">{item.pv}</span>
                  </div>
                  
                  <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-600 uppercase font-bold block mb-1">Conditions</span>
                    <span className="text-sm text-gray-800 font-bold leading-relaxed">{item.conditions}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
