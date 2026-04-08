// apps/web/src/app/rme/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RMEPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Simulasi Form RME
  const [formData, setFormData] = useState({
    alergi: '',
    tekananDarah: '',
    suhu: '',
    subjective: '',
    objective: '',
    assessment_icd10: '',
    plan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi penyimpanan ke database
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Rekam Medis (SOAP) berhasil disimpan!');
    setIsSubmitting(false);
  };

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER & NAVIGASI KEMBALI */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/appointments" className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Rekam Medis Elektronik</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-500">Formulir SOAP & Tindakan Medis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-500/20 font-bold text-sm transition-colors duration-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Sesi Pemeriksaan Aktif
          </div>
        </div>

        {/* KARTU INFO PASIEN (Patient Banner) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-500">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-2xl rounded-2xl flex items-center justify-center transition-colors duration-500">A</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-500">Ahmad Budi Santoso</h2>
              <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-500">
                <span>Laki-laki, 32 Tahun</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span>NIK: 3201012345678901</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 flex-1 md:flex-none transition-colors duration-500">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Antrean</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">#004</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 flex-1 md:flex-none transition-colors duration-500">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tanggal</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">Hari Ini</p>
            </div>
          </div>
        </div>

        {/* FORMULIR UTAMA */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* BAGIAN 1: VITAL SIGN & ALERGI */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-500">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-500">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              Tanda Vital & Riwayat Alergi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Riwayat Alergi (Obat/Makanan)</label>
                <input type="text" name="alergi" value={formData.alergi} onChange={handleChange} placeholder="Contoh: Amoxicillin, Seafood..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-colors duration-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Tekanan Darah (mmHg)</label>
                <input type="text" name="tekananDarah" value={formData.tekananDarah} onChange={handleChange} placeholder="120/80" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-colors duration-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Suhu Tubuh (°C)</label>
                <input type="text" name="suhu" value={formData.suhu} onChange={handleChange} placeholder="36.5" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-colors duration-500" />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: SOAP */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-500">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-500">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Pemeriksaan Klinis (SOAP)
            </h3>
            
            <div className="space-y-6">
              {/* S & O */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Subjective (Keluhan Utama)</label>
                  <textarea required name="subjective" value={formData.subjective} onChange={handleChange} rows={4} placeholder="Keluhan yang dirasakan pasien..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none resize-none transition-colors duration-500"></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Objective (Hasil Pemeriksaan Fisik)</label>
                  <textarea required name="objective" value={formData.objective} onChange={handleChange} rows={4} placeholder="Hasil pemeriksaan fisik/lab oleh dokter..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none resize-none transition-colors duration-500"></textarea>
                </div>
              </div>

              {/* A (Assessment & ICD-10) */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-500">
                <label className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-3 block uppercase tracking-wider transition-colors duration-500">Assessment (Diagnosis & ICD-10)</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/3">
                    <select required name="assessment_icd10" value={formData.assessment_icd10} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none cursor-pointer transition-colors duration-500">
                      <option value="">Pilih Kode ICD-10</option>
                      <option value="J00">J00 - Nasofaringitis akut (Common Cold)</option>
                      <option value="A09">A09 - Diare dan gastroenteritis</option>
                      <option value="I10">I10 - Hipertensi esensial (primer)</option>
                      <option value="E11">E11 - Diabetes mellitus tipe 2</option>
                      <option value="K30">K30 - Dispepsia</option>
                    </select>
                  </div>
                  <div className="md:w-2/3">
                    <input type="text" placeholder="Catatan tambahan diagnosis..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none transition-colors duration-500" />
                  </div>
                </div>
              </div>

              {/* P (Plan) */}
              <div>
                <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Plan (Tatalaksana & Resep Obat)</label>
                <textarea required name="plan" value={formData.plan} onChange={handleChange} rows={4} placeholder="Rencana pengobatan, tindakan, atau resep obat..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-3 outline-none resize-none transition-colors duration-500"></textarea>
              </div>
            </div>
          </div>

          {/* TOMBOL SIMPAN */}
          <div className="flex justify-end gap-4 pb-10">
            <Link href="/appointments" className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
              Batal
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? 'Menyimpan Data...' : 'Simpan Rekam Medis'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}