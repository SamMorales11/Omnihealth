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
    <main className="min-h-screen overflow-hidden relative selection:bg-indigo-500 selection:text-white bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col">
      
      {/* ORNAMEN BACKGROUND */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] transition-colors duration-500"></div>
        <div className="absolute top-60 -left-20 w-[30rem] h-[30rem] bg-teal-400/20 dark:bg-teal-600/20 rounded-full blur-[100px] transition-colors duration-500"></div>
      </div>

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 w-full">
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
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 lg:pt-24 pb-20 relative z-10 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-start">
          
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
            
            {/* PORTAL SELECTION - FIXED & ENHANCED VISUALS */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-10 w-full max-w-2xl mx-auto lg:mx-0">
              
              {/* Portal Pasien (REVISED VISUALS) */}
              <Link href="/pendaftaran" className="group relative overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:border-indigo-500/50 transition-all duration-500 flex flex-col justify-between h-full min-h-[280px] hover:-translate-y-1">
                {/* Subtle Hover Gradient Overlay */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div>
                  <div className="flex items-start mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-500/10 dark:to-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 relative z-10 tracking-tight">Portal Pasien</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                    Ambil antrean mandiri secara online langsung dari HP Anda. Cepat dan tanpa kertas.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 w-full flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all relative z-10">
                  Daftar Sekarang
                  <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </Link>

              {/* Portal Staf (REVISED VISUALS) */}
              <Link href="/dashboard" className="group relative overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] hover:border-teal-500/50 transition-all duration-500 flex flex-col justify-between h-full min-h-[280px] hover:-translate-y-1">
                {/* Subtle Hover Gradient Overlay */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div>
                  <div className="flex items-start mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-500/10 dark:to-teal-500/5 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100/50 dark:border-teal-500/20 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 relative z-10 tracking-tight">Portal Staf</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                    Akses sistem khusus untuk operasional internal klinik. Kelola data pasien secara real-time.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 w-full flex items-center text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:gap-2 transition-all relative z-10">
                  Masuk Sistem
                  <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </Link>

            </div>
          </div>

          {/* BAGIAN GAMBAR / MOCKUP TIDAK DISENTUH */}
          <div className="relative w-full flex justify-center lg:justify-end lg:pt-20">
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

      {/* FOOTER - TIDAK DISENTUH */}
      <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-500 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">OmniHealth</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Sistem Manajemen Klinik Terpadu.
              </p>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">
                &copy; {new Date().getFullYear()} OmniHealth Systems. Hak Cipta Dilindungi.
              </p>
            </div>

            {/* Links & Socials */}
            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8">
                <Link href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Kebijakan Privasi</Link>
                <Link href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Syarat & Ketentuan</Link>
                <Link href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Bantuan Support</Link>
              </div>
              
              <div className="flex items-center gap-5">
              <Link href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
              </Link>
            </div>

          </div>

          </div>
        </div>
      </footer>

    </main>
  );
}