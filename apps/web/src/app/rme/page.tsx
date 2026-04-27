// apps/web/src/app/rme/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function RMEPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id'); 
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // REVISI: State untuk manajemen obat
  const [availableMedicines, setAvailableMedicines] = useState<any[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<any[]>([]);

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

  // Mengambil data pasien/antrean berdasarkan ID dari URL
  useEffect(() => {
    if (appointmentId) {
      const fetchAppointment = async () => {
        try {
          const token = Cookies.get('auth-token');
          const res = await fetch(`http://127.0.0.1:3001/api/appointments/${appointmentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.data) setAppointmentData(json.data);
        } catch (error) {
          console.error("Gagal memuat data pasien.");
        }
      };
      fetchAppointment();
    }
  }, [appointmentId]);

  // Mengambil daftar obat dari inventaris farmasi
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = Cookies.get('auth-token');
        const res = await fetch('http://127.0.0.1:3001/api/medicines', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        setAvailableMedicines(json.data || []);
      } catch (error) {
        console.error("Gagal memuat daftar obat.");
      }
    };
    fetchMedicines();
  }, []);

  // Fungsi menambahkan obat ke daftar resep
  const addMedicineToPrescription = (medicineId: string) => {
    if (!medicineId) return;
    const med = availableMedicines.find(m => m.id.toString() === medicineId);
    if (med && !selectedPrescription.some(p => p.id === med.id)) {
      setSelectedPrescription([...selectedPrescription, { ...med, qty: 1, instruction: '' }]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // REVISI: Fungsi simpan data nyata ke database dan potong stok
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentData) return toast.error("Data antrean tidak ditemukan.");
    
    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');

      // 1. Simpan Data Resep & Potong Stok Obat
      const rxRes = await fetch('http://127.0.0.1:3001/api/prescriptions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentId: parseInt(appointmentId || '0'),
          patientId: appointmentData.patientId,
          doctorId: appointmentData.doctorId,
          items: selectedPrescription.map(item => ({
            medicineId: item.id,
            quantity: item.qty,
            instruction: item.instruction
          }))
        })
      });

      if (!rxRes.ok) throw new Error();

      // 2. Update Status Antrean menjadi 'Selesai'
      await fetch(`http://127.0.0.1:3001/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Selesai' })
      });

      toast.success('Rekam Medis & Resep berhasil disimpan!');
      window.location.href = '/appointments'; // Kembali ke daftar antrean
    } catch (error) {
      toast.error('Gagal menyimpan data medis. Periksa koneksi backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-left">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER & NAVIGASI KEMBALI */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 text-left">
            <Link href="/appointments" className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div className="text-left">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500 text-left">Rekam Medis Elektronik</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-500 text-left">Formulir SOAP & Tindakan Medis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-500/20 font-bold text-sm transition-colors duration-500 text-left">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Sesi Pemeriksaan Aktif
          </div>
        </div>

        {/* KARTU INFO PASIEN (Patient Banner) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-500 text-left">
          <div className="flex items-center gap-5 text-left">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-2xl rounded-2xl flex items-center justify-center transition-colors duration-500">
              {appointmentData?.patientName?.charAt(0) || 'P'}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-500 text-left">
                {appointmentData?.patientName || 'Memuat data...'}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-500 text-left">
                <span>{appointmentData?.doctorName || 'Dokter Pemeriksa'}</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span>{appointmentData?.specialist || '-'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto text-left">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 flex-1 md:flex-none transition-colors duration-500 text-left">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">Antrean</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 text-left">#{appointmentId?.padStart(3, '0') || '---'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 flex-1 md:flex-none transition-colors duration-500 text-left">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">Tanggal</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 text-left">Hari Ini</p>
            </div>
          </div>
        </div>

        {/* FORMULIR UTAMA */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* BAGIAN 1: VITAL SIGN & ALERGI */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-500 text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-500 text-left">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              Tanda Vital & Riwayat Alergi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="md:col-span-1 text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Riwayat Alergi (Obat/Makanan)</label>
                <input type="text" name="alergi" value={formData.alergi} onChange={handleChange} placeholder="Contoh: Amoxicillin, Seafood..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-colors duration-500" />
              </div>
              <div className="text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Tekanan Darah (mmHg)</label>
                <input type="text" name="tekananDarah" value={formData.tekananDarah} onChange={handleChange} placeholder="120/80" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-colors duration-500" />
              </div>
              <div className="text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Suhu Tubuh (°C)</label>
                <input type="text" name="suhu" value={formData.suhu} onChange={handleChange} placeholder="36.5" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-colors duration-500" />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: SOAP */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-500 text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-500 text-left">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Pemeriksaan Klinis (SOAP)
            </h3>
            
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="text-left">
                  <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Subjective (Keluhan Utama)</label>
                  <textarea required name="subjective" value={formData.subjective} onChange={handleChange} rows={4} placeholder="Keluhan yang dirasakan pasien..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none resize-none transition-colors duration-500"></textarea>
                </div>
                <div className="text-left">
                  <label className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Objective (Hasil Pemeriksaan Fisik)</label>
                  <textarea required name="objective" value={formData.objective} onChange={handleChange} rows={4} placeholder="Hasil pemeriksaan fisik/lab oleh dokter..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none resize-none transition-colors duration-500"></textarea>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-500 text-left">
                <label className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-3 block uppercase tracking-wider transition-colors duration-500 text-left">Assessment (Diagnosis & ICD-10)</label>
                <div className="flex flex-col md:flex-row gap-4 text-left">
                  <div className="md:w-1/3 text-left">
                    <select required name="assessment_icd10" value={formData.assessment_icd10} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none cursor-pointer transition-colors duration-500 text-left">
                      <option value="">Pilih Kode ICD-10</option>
                      <option value="J00">J00 - Nasofaringitis akut (Common Cold)</option>
                      <option value="A09">A09 - Diare dan gastroenteritis</option>
                      <option value="I10">I10 - Hipertensi esensial (primer)</option>
                      <option value="E11">E11 - Diabetes mellitus tipe 2</option>
                      <option value="K30">K30 - Dispepsia</option>
                    </select>
                  </div>
                  <div className="md:w-2/3 text-left">
                    <input type="text" placeholder="Catatan tambahan diagnosis..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none transition-colors duration-500" />
                  </div>
                </div>
              </div>

              <div className="text-left">
                <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Plan (Tatalaksana & Tindakan Medis)</label>
                <textarea required name="plan" value={formData.plan} onChange={handleChange} rows={4} placeholder="Rencana pengobatan, tindakan, atau anjuran medis..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-3 outline-none resize-none transition-colors duration-500"></textarea>
              </div>
            </div>
          </div>

          {/* BAGIAN 3 - E-PRESCRIBING (INPUT RESEP) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-500 text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-500 text-left">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              E-Prescribing (Input Resep Obat)
            </h3>

            <div className="flex flex-col md:flex-row gap-4 mb-8 text-left">
              <div className="flex-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block text-left">Cari Obat di Inventaris Farmasi</label>
                <select
                  onChange={(e) => addMedicineToPrescription(e.target.value)}
                  value=""
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer text-left"
                >
                  <option value="">-- Klik untuk memilih obat --</option>
                  {availableMedicines.map(m => (
                    <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                      {m.name} ({m.unit}) - Stok: {m.stock}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 text-left">
              {selectedPrescription.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">Belum ada obat yang dipilih dalam resep.</p>
              ) : (
                selectedPrescription.map((item, idx) => (
                  <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-left-2 duration-300 text-left">
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-white text-left">{item.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black text-left">{item.unit}</p>
                    </div>
                    <div className="w-full md:w-24 text-left">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => {
                          const newVal = parseInt(e.target.value);
                          setSelectedPrescription(selectedPrescription.map((p, i) => i === idx ? { ...p, qty: newVal } : p));
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-center outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        placeholder="Qty"
                      />
                    </div>
                    <div className="flex-1 w-full text-left">
                      <input
                        type="text"
                        value={item.instruction}
                        onChange={(e) => setSelectedPrescription(selectedPrescription.map((p, i) => i === idx ? { ...p, instruction: e.target.value } : p))}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        placeholder="Aturan Pakai (misal: 3x1 sehari sesudah makan)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPrescription(selectedPrescription.filter((_, i) => i !== idx))}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TOMBOL SIMPAN */}
          <div className="flex justify-end gap-4 pb-10 text-left">
            <Link href="/appointments" className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
              Batal
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? 'Menyimpan Data...' : 'Simpan Rekam Medis & Resep'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}