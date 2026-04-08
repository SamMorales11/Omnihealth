// apps/web/src/app/pharmacy/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Data Simulasi Antrean Apotek
const initialPrescriptions = [
  {
    id: "RXP-001",
    patientName: "Ahmad Budi Santoso",
    doctorName: "dr. Sarah Jenkins",
    time: "10:45 WIB",
    medicines: [
      { name: "Paracetamol 500mg", dosage: "3 x 1 Tablet", qty: "10 Tablet" },
      { name: "Loratadine 10mg", dosage: "1 x 1 Tablet", qty: "5 Tablet" }
    ],
    status: "Menunggu Disiapkan"
  },
  {
    id: "RXP-002",
    patientName: "Siti Aminah",
    doctorName: "dr. Andi Wijaya",
    time: "11:15 WIB",
    medicines: [
      { name: "Ambroxol Syr 30mg/5ml", dosage: "3 x 1 Sendok Takar", qty: "1 Botol" },
      { name: "Azithromycin 500mg", dosage: "1 x 1 Tablet (Habiskan)", qty: "3 Tablet" }
    ],
    status: "Menunggu Disiapkan"
  }
];

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const handleProcess = (id: string) => {
    toast.success(`Resep ${id} berhasil diproses dan diserahkan ke pasien!`);
    // Hapus dari antrean (Simulasi status 'Selesai')
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Farmasi & Apotek</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Antrean penebusan resep dari ruang pemeriksaan dokter.</p>
            </div>
          </div>
          <Link href="/dashboard" className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
            Kembali ke Dashboard
          </Link>
        </div>

        {/* LIST ANTREAN RESEP */}
        {prescriptions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">Tidak Ada Antrean Resep</h3>
            <p className="text-slate-400 dark:text-slate-500 mt-1">Semua resep telah berhasil diserahkan ke pasien.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors duration-500">
                
                {/* Header Resep */}
                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 mb-2">
                      <svg className="w-3 h-3 mr-1 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {rx.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{rx.patientName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Dari: {rx.doctorName} • {rx.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">No. Resep</p>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{rx.id}</p>
                  </div>
                </div>

                {/* Daftar Obat */}
                <div className="p-5 flex-grow">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Daftar Obat (R/)</h4>
                  <ul className="space-y-4">
                    {rx.medicines.map((med, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{med.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic">{med.dosage}</p>
                        </div>
                        <span className="font-black text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{med.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer (Tombol Aksi) */}
                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <button 
                    onClick={() => handleProcess(rx.id)}
                    className="w-full py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Tandai Selesai & Serahkan Obat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}