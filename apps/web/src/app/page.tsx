// apps/web/src/app/page.tsx
"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Page() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted) return null;

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
          <div className="w-10 h-10 bg-slate-900 text-indigo-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-500/30 transition-colors duration-500">
            {/* Ikon Activity (Raw SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">OmniHealth</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300 shadow-inner"
            aria-label="Toggle Dark Mode"
          >
            {currentTheme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            )}
          </button>

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
            
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-10 w-full max-w-2xl mx-auto lg:mx-0">
              {/* Portal Pasien */}
              <Link href="/pendaftaran" className="group relative overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:border-indigo-500/50 transition-all duration-500 flex flex-col justify-between h-full min-h-[280px] hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div>
                  <div className="flex items-start mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-500/10 dark:to-indigo-500/5 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 relative z-10 tracking-tight">Portal Pasien</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                    Ambil antrean mandiri secara online langsung dari HP Anda. Cepat dan tanpa kertas.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 w-full flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all relative z-10">
                  Daftar Sekarang
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </Link>

              {/* Portal Staf */}
              <Link href="/dashboard" className="group relative overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] hover:border-teal-500/50 transition-all duration-500 flex flex-col justify-between h-full min-h-[280px] hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div>
                  <div className="flex items-start mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-500/10 dark:to-teal-500/5 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100/50 dark:border-teal-500/20 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="m12 14 4-4"></path><path d="m3.34 19 8.66-8.66"></path><path d="m3.34 19 8.66-8.66"></path><circle cx="14.5" cy="9.5" r="4.5"></circle><path d="m19 14.5-4.5-4.5"></path><path d="m18.42 15.61-3-3"></path><path d="M10 18H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path></svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 relative z-10 tracking-tight">Portal Staf</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                    Akses sistem khusus untuk operasional internal klinik. Kelola data pasien secara real-time.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 w-full flex items-center text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:gap-2 transition-all relative z-10">
                  Masuk Sistem
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </Link>
            </div>
          </div>

          {/* FLOATING BENTO UI */}
          <div className="relative w-full flex justify-center lg:justify-end lg:pt-20">
            <div className="relative w-full max-w-2xl h-[450px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

              {/* CARD 1: ANALYTICS */}
              <div className="absolute top-0 right-0 w-[90%] bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/15 -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-700 group cursor-default animate-[float_6s_ease-in-out_infinite]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Analytics Central</p>
                    <h4 className="text-xl font-black text-white tracking-tight">Patient Trends</h4>
                  </div>
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  </div>
                </div>
                <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 100">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient>
                  </defs>
                  <path d="M0,80 C50,85 80,40 120,55 C160,70 200,20 250,45 C300,70 350,15 400,30" fill="none" stroke="url(#line-grad)" strokeWidth="5" strokeLinecap="round" filter="url(#glow)" className="animate-[dash_4s_ease-in-out_infinite]" />
                  <circle cx="120" cy="55" r="5" fill="#6366f1" className="animate-pulse" />
                  <circle cx="250" cy="45" r="5" fill="#22d3ee" className="animate-pulse" />
                </svg>
                <div className="flex gap-6 mt-8">
                  <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10"><p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Avg. Visitors</p><p className="text-2xl font-black text-white">1,284</p></div>
                  <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10"><p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Growth</p><p className="text-2xl font-black text-emerald-400">+24%</p></div>
                </div>
              </div>

              {/* CARD 2: PHARMACY */}
              <div className="absolute bottom-4 left-[-20px] w-[58%] bg-slate-950/80 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-7 shadow-2xl shadow-teal-500/10 hover:translate-y-[-12px] transition-all duration-500 z-20 group cursor-default animate-[float_8s_ease-in-out_infinite_1s]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-teal-500/15 text-teal-400 rounded-2xl border border-teal-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">Pharmacy Stock</h4>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2.5"><span>Paracetamol</span><span className="text-emerald-400">85%</span></div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[85%] group-hover:w-[92%] transition-all duration-1000 shadow-[0_0_10px_#10b981]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2.5"><span>Amoxicillin</span><span className="text-amber-400">42%</span></div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full w-[42%] group-hover:w-[55%] transition-all duration-1000 shadow-[0_0_10px_#f59e0b]"></div></div>
                  </div>
                </div>
              </div>

              {/* CARD 3: PATIENT PROFILE */}
              <div className="absolute top-[40%] right-[-30px] w-[48%] bg-slate-900/90 backdrop-blur-3xl border border-slate-700/50 rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-500/20 hover:translate-y-[-15px] transition-all duration-500 z-30 cursor-default animate-[float_7s_ease-in-out_infinite_0.5s]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-slate-900 shadow-2xl overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white mt-1"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-lg"></div>
                  </div>
                  <h4 className="font-black text-white text-xl tracking-tight mb-1">Andi Simon</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Patient ID: #8201</p>
                  <div className="w-full py-3.5 px-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(79,70,229,0.1)] group-hover:shadow-indigo-500/30 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">In Consultation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-500 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 text-indigo-400 rounded-xl flex items-center justify-center shadow-md border border-indigo-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">OmniHealth</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sistem Manajemen Klinik Terpadu.</p>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">&copy; 2026 OmniHealth Systems. Hak Cipta Dilindungi.</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-8 w-full md:w-auto">
              <div className="flex flex-wrap items-center justify-start md:justify-end gap-6 sm:gap-8">
                <Link href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Kebijakan Privasi</Link>
                <Link href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Syarat & Ketentuan</Link>
                <Link href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Bantuan Support</Link>
              </div>
              
              <div className="flex items-center gap-8">
                <Link href="#" className="group flex flex-col items-start md:items-end gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">Twitter</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-all" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </Link>
                <Link href="#" className="group flex flex-col items-start md:items-end gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">LinkedIn</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-all" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}