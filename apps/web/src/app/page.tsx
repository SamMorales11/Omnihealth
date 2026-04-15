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
    <main className="min-h-screen overflow-hidden relative selection:bg-indigo-500 selection:text-white bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* ORNAMEN BACKGROUND */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-screen overflow-hidden -z-10 pointer-events-none">
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
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 lg:pt-24 pb-32 relative z-10 min-h-[85vh]">
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
            
            {/* PORTAL SELECTION DENGAN IKON SESUAI CORETAN ANDA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-2xl mx-auto lg:mx-0">
              
              {/* Portal Pasien (Ikon HP) */}
              <Link href="/pendaftaran" className="group bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                      {/* IKON SMARTPHONE */}
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">Portal Pasien</h3>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    Ambil antrean mandiri secara online langsung dari HP Anda.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Daftar Sekarang
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </Link>

              {/* Portal Staf (Ikon Kolom Dashboard) */}
              <Link href="/dashboard" className="group bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-500/20">
                      {/* IKON KOLOM/DASHBOARD */}
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">Portal Staf</h3>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    Akses sistem khusus untuk operasional internal klinik.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center text-xs md:text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                  Masuk Sistem
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
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

      {/* FOOTER ENTERPRISE SEJATI - ANTI PATAH DENGAN FLEXBOX */}
      <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-full overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 w-full">
          
          {/* Pembungkus Induk Flexbox: Pasti menyamping di layar sedang ke atas */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 w-full">
            
            {/* Bagian Kiri: Brand & Deskripsi */}
            <div className="w-full lg:w-1/3 shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">OmniHealth</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Sistem Manajemen Klinik Terpadu. Menghadirkan efisiensi operasional dan pengalaman pasien yang modern dan tak tertandingi.
              </p>
            </div>

            {/* Bagian Kanan: Wadah 3 Kolom Menu yang sejajar paksa */}
            <div className="w-full lg:w-2/3 flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap justify-between gap-10 sm:gap-6">
              
              {/* Kolom Menu 1 */}
              <div className="flex-1 min-w-[140px]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Produk Utama</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Rekam Medis (EMR)</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Manajemen Antrean</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Apotek & Farmasi</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Integrasi Kasir</Link></li>
                </ul>
              </div>

              {/* Kolom Menu 2 */}
              <div className="flex-1 min-w-[140px]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Perusahaan</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tentang Kami</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Hubungi Tim Sales</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Karir & Peluang</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog & Edukasi</Link></li>
                </ul>
              </div>

              {/* Kolom Menu 3 */}
              <div className="flex-1 min-w-[140px]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Informasi Legal</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kebijakan Privasi</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Syarat & Ketentuan</Link></li>
                  <li>
                    <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                      Keamanan Data 
                      <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 shadow-sm">HIPAA</span>
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Garis Bawah Copyright */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} OmniHealth Systems. Hak Cipta Dilindungi.
            </p>
            <div className="flex justify-center gap-6">
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
      </footer>

    </main>
  );
}