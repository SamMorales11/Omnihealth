// apps/web/src/app/welcome/page.tsx
import Link from 'next/link';

export default function WelcomeHeroPage() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden relative">
      
      {/* ORNAMEN BACKGROUND (Efek Kaca & Gradien Premium) */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* NAVBAR SIMPLE */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">OmniHealth</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#fitur" className="hover:text-indigo-600 transition-colors">Fitur</a>
          <a href="#solusi" className="hover:text-indigo-600 transition-colors">Solusi Klinik</a>
          <a href="#harga" className="hover:text-indigo-600 transition-colors">Harga</a>
        </div>
        <Link href="/login" className="bg-white text-indigo-600 border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm">
          Portal Admin
        </Link>
      </nav>

      {/* HERO SECTION UTAMA */}
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 lg:pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* TEKS SEBELAH KIRI */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Sistem Manajemen Klinik #1
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight mb-6">
              Revolusi Layanan <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
                Kesehatan Modern.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Tinggalkan cara lama. OmniHealth mengintegrasikan pendaftaran pasien, jadwal dokter, dan rekam medis dalam satu platform cerdas yang aman dan secepat kilat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                Mulai Demo Gratis
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Lihat Cara Kerja
              </button>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Setup 5 Menit
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Keamanan Enkripsi
              </div>
            </div>
          </div>

          {/* VISUAL MOCKUP SEBELAH KANAN */}
          <div className="relative">
            {/* Dekorasi di Belakang Mockup */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-[2rem] blur opacity-30 animate-pulse"></div>
            
            {/* Jendela Browser Palsu */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Header Browser */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <div className="ml-4 bg-white px-3 py-1 rounded-md text-[10px] font-medium text-slate-400 border border-slate-200 w-full text-center">omnihealth-app.com</div>
              </div>
              
              {/* Isi Mockup (Miniatur Dashboard Anda) */}
              <div className="p-6 bg-[#F8FAFC]">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-32 h-6 bg-slate-200 rounded-md"></div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg mb-3"></div>
                    <div className="w-20 h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="w-12 h-6 bg-slate-800 rounded"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg mb-3"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="w-12 h-6 bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="bg-white h-32 rounded-xl border border-slate-100 shadow-sm p-4">
                   <div className="w-full h-2 bg-slate-100 rounded-full mb-3"></div>
                   <div className="w-3/4 h-2 bg-slate-100 rounded-full mb-3"></div>
                   <div className="w-5/6 h-2 bg-slate-100 rounded-full mb-3"></div>
                   <div className="w-1/2 h-2 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Widget Melayang Kecil */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce hover:animate-none">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Status Antrean</p>
                <p className="text-sm font-black text-slate-800">12 Pasien Selesai</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </main>
  );
}