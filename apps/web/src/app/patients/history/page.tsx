// apps/web/src/app/patients/history/page.tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';

// Data Simulasi Riwayat Medis
const medicalHistory = [
  {
    id: 1,
    date: "12 April 2026",
    doctor: "dr. Sarah Jenkins, Sp.PD",
    subjective: "Demam naik turun selama 3 hari, mual, dan nyeri sendi.",
    objective: "Suhu: 38.5°C, TD: 110/70, Nadi: 98x/menit. Terdapat ruam kemerahan di lengan.",
    assessment: "A90 - Dengue fever [classical dengue]",
    plan: "Paracetamol 500mg 3x1, Cek Darah Lengkap (Trombosit), Istirahat total.",
    status: "Selesai"
  },
  {
    id: 2,
    date: "05 Februari 2026",
    doctor: "dr. Andi Wijaya",
    subjective: "Batuk berdahak sudah 1 minggu, sedikit sesak napas.",
    objective: "Suhu: 37.2°C, TD: 120/80. Auskultasi: ronki positif di paru kanan.",
    assessment: "J06.9 - Acute upper respiratory infection, unspecified",
    plan: "Ambroxol 30mg 3x1, Azithromycin 500mg 1x1 (selama 3 hari).",
    status: "Selesai"
  }
];

export default function PatientHistoryPage() {
  const [expandedId, setExpandedId] = useState<number | null>(1); // Buka rekam medis terbaru secara default

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Riwayat Medis</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-500">Arsip rekam medis komprehensif pasien.</p>
            </div>
          </div>
        </div>

        {/* PROFIL PASIEN */}
        <div className="bg-indigo-600 dark:bg-indigo-900/50 rounded-2xl p-8 mb-8 shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-transparent dark:border-indigo-500/30 transition-colors duration-500">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black">A</div>
            <div>
              <h2 className="text-2xl font-bold">Ahmad Budi Santoso</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-indigo-100 text-sm font-medium">
                <span>Laki-laki, 32 Tahun</span>
                <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                <span>Gol. Darah: O</span>
                <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                <span>Alergi: Seafood</span>
              </div>
            </div>
          </div>
          <Link href="/rme" className="px-5 py-2.5 bg-white text-indigo-600 dark:bg-indigo-500 dark:text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all border border-transparent dark:border-indigo-400">
            + RME Baru
          </Link>
        </div>

        {/* TIMELINE RIWAYAT (SOAP) */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors duration-500">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Riwayat Kunjungan Sebelumnya
          </h3>
          
          {medicalHistory.map((record) => (
            <div key={record.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              
              {/* Header Kartu (Klik untuk Buka/Tutup) */}
              <div 
                onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl font-bold text-sm text-center min-w-[80px]">
                    <span className="block text-xs font-medium opacity-80">TGL</span>
                    {record.date.split(' ')[0]} {record.date.split(' ')[1].substring(0,3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{record.assessment.split(' - ')[1]}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{record.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-xs font-bold">
                    ICD-10: {record.assessment.split(' - ')[0]}
                  </span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedId === record.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Isi Detail SOAP (Terbuka Jika di-Klik) */}
              {expandedId === record.id && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">Subjective</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">{record.subjective}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-500 dark:text-teal-400 uppercase tracking-wider mb-1">Objective</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">{record.objective}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1">Plan (Tindakan & Resep Obat)</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-500/20">{record.plan}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}