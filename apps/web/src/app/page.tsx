// apps/web/src/app/page.tsx
"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Page() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Menentukan tema yang sedang aktif
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <main className="min-h-screen overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      
      {/* ORNAMEN BACKGROUND */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] transition-colors duration-500"></div>
        <div className="absolute top-60 -left-20 w-[30rem] h-[30rem] bg-teal-400/20 dark:bg-teal-600/20 rounded-full blur-[100px] transition-colors duration-500"></div>
      </div>

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transition-colors duration-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">OmniHealth</span>
        </div>

        <div className="flex items-center gap-4">
          {/* TOMBOL TOGGLE THEME */}
          {mounted && (
            <button
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300 shadow-inner"
              aria-label="Toggle Dark Mode"
            >
              {currentTheme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
          )}

          <Link href="/login" className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-sm duration-300">
            Portal Admin
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 lg:pt-24 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-center lg:text-left relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 transition-colors duration-500">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
              Sistem Manajemen Klinik #1
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6 transition-colors duration-500">
              Revolusi Layanan <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">
                Kesehatan Modern.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium transition-colors duration-500">
              Tinggalkan cara lama. OmniHealth mengintegrasikan pendaftaran pasien, jadwal dokter, dan analitik dalam satu platform cerdas yang aman dan secepat kilat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 duration-300">
                Masuk ke Sistem
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/30 to-teal-400/30 dark:from-indigo-600/20 dark:to-teal-500/20 rounded-[2.5rem] blur-2xl opacity-70 transition-colors duration-500"></div>
              
              <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                
                <div className="bg-slate-100/80 dark:bg-slate-950/80 px-4 py-3 flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-500">
                  <div className="w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500/80"></div>
                  <div className="ml-4 flex-1 flex justify-center">
                    <div className="bg-white/50 dark:bg-slate-800/50 px-4 py-1 rounded-md text-[10px] font-bold text-slate-400 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-colors duration-500">
                      app.omnihealth.com
                    </div>
                  </div>
                </div>

                <img 
                 src="/dashboard.jpeg" 
                 alt="OmniHealth Dashboard Preview" 
                 className="w-full h-auto object-cover dark:opacity-90 transition-opacity duration-500"
                />     
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}