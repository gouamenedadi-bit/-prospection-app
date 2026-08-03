"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const getNavClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center min-w-[4.5rem] flex-1 transition-all duration-300 ${
      isActive ? "text-forest scale-110 font-bold drop-shadow-sm" : "text-ink-soft hover:text-forest"
    }`;
  };

  return (
    <div className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col relative overflow-hidden mx-auto">
      {/* Header */}
      <header className="bg-forest text-white p-4 shadow-md sticky top-0 z-50 flex justify-center items-center">
        <h1 className="text-xl font-bold font-heading text-center">Prospection Longrich</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 bg-cream">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-line sticky bottom-0 z-50">
        <style dangerouslySetInnerHTML={{__html:`.no-scrollbar::-webkit-scrollbar{display:none;}`}} />
        <div className="flex overflow-x-auto no-scrollbar gap-1 px-2 items-center h-16 text-[10px]" style={{scrollbarWidth:'none'}}>
          
          <a href="/dashboard" className={getNavClass("/dashboard")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="truncate w-full text-center">Accueil</span>
          </a>

          <a href="/health" className={getNavClass("/health")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span className="truncate w-full text-center">Soins</span>
          </a>

          <a href="/grades" className={getNavClass("/grades")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            <span className="truncate w-full text-center">Grades</span>
          </a>

          <a href="/compensation" className={getNavClass("/compensation")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
            <span className="truncate w-full text-center">Compensation</span>
          </a>

          <a href="/stockiste/products" className={getNavClass("/stockiste/products")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span className="truncate w-full text-center">Produits</span>
          </a>

          <a href="/stockistes" className={getNavClass("/stockistes")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="truncate w-full text-center">Stockistes</span>
          </a>

          <a href="/dashboard/stockiste" className={getNavClass("/dashboard/stockiste")}>
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="truncate w-full text-center">Profil</span>
          </a>
          
        </div>
      </nav>
    </div>
  );
}
