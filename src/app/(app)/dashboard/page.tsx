"use client";

import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-forest to-forest-deep rounded-xl p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold mb-2 font-heading">Bienvenue Partenaire !</h2>
        <p className="text-sm opacity-90">Développez votre réseau et suivez vos performances en Côte d'Ivoire.</p>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-ink font-heading m-0">Accès Rapide</h3>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors bg-red-50 px-2 py-1.5 rounded-lg"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Se déconnecter
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <a href="/stockiste/products" className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group">
            <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <span className="text-sm font-bold text-ink">Liste des produits</span>
          </a>
          <a href="/stockistes" className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group">
            <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            <span className="text-sm font-bold text-ink">Stockistes</span>
          </a>
          <a href="/health" className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group">
            <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <span className="text-sm font-bold text-ink">Soins & Bien-être</span>
          </a>
          <a href="/stockiste/formations" className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group">
            <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <span className="text-sm font-bold text-ink">Formations</span>
          </a>
          <a href="/grades" className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group">
            <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
            <span className="text-sm font-bold text-ink">Grades</span>
          </a>
          {/* Nouveau: Plan de Compensation */}
          <a href="/compensation" className="bg-white p-4 rounded-xl shadow-sm border border-line flex flex-col items-center text-center hover:bg-cream transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 group">
            <div className="w-12 h-12 bg-palm-light rounded-full flex items-center justify-center text-palm mb-2 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span className="text-sm font-bold text-ink">Plan de Compensation</span>
          </a>
        </div>
      </div>

      {/* Actualités */}
      <div>
        <h3 className="font-semibold text-ink mb-3 font-heading">Dernières informations</h3>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-line">
          <p className="text-ink-soft text-sm italic">Aucune nouveauté pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
