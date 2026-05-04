// apps/web/src/app/pendaftaran/page.tsx
"use client";

import { useState } from 'react';
import { Smartphone, CheckCircle2, Building2 } from 'lucide-react';


export default function PendaftaranMandiriPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    poli: 'Poli Umum',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi loading API
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2); // Pindah ke layar QR Code
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-500">
      
      {/* Container mirip layar HP */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Header App */}
        <div className="bg-indigo-600 p-8 text-center rounded-b-[2rem] shadow-lg relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/30">
             <Building2 size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">OmniHealth Portal</h1>
          <p className="text-indigo-200 text-sm font-medium mt-1">Pendaftaran Antrean Mandiri</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            /* STEP 1: FORM PENDAFTARAN */
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">NIK Pasien</label>
                <input required type="text" maxLength={16} placeholder="16 Digit NIK KTP"
                  value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input required type="text" placeholder="Nama sesuai KTP"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-medium" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tujuan Poliklinik</label>
                <select 
                  value={formData.poli} onChange={(e) => setFormData({...formData, poli: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all font-bold cursor-pointer appearance-none">
                  <option>Poli Umum</option>
                  <option>Poli Gigi</option>
                  <option>Poli Anak</option>
                  <option>Poli Penyakit Dalam</option>
                </select>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting ? 'Memproses...' : 'Ambil Nomor Antrean'}
              </button>
            </form>
          ) : (
            /* STEP 2: TIKET QR CODE */
            <div className="text-center animate-in zoom-in-95 duration-500 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={32} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Pendaftaran Sukses!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Tunjukkan QR Code ini kepada resepsionis klinik saat Anda tiba.</p>

              {/* Box QR Code (Mockup SVG) */}
              <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 dark:border-slate-800 shadow-xl inline-block mb-8">
                <svg className="w-48 h-48 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  {/* Ini adalah Mockup QR Code sederhana. Nanti bisa diganti dengan library react-qr-code */}
                  <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v3h-3v-3zm-3 0h2v2h-2v-2zm0-5h6v2h-6v-2zM10 3h2v6h-2V3zm0 8h11v2H10v-2zm0 4h2v6h-2v-6zm-7-2h6v2H3v-2zm0-2h4v2H3v-2z"/>
                </svg>
                <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor Antrean Anda</p>
                  <p className="text-4xl font-black text-indigo-600 mt-1">A-024</p>
                </div>
              </div>

              <button onClick={() => setStep(1)} className="text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
                Daftarkan Pasien Lain
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-slate-400 dark:text-slate-500 text-xs mt-8 font-medium">&copy; 2026 OmniHealth Systems</p>
    </main>
  );
}