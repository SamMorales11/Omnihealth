// apps/web/src/app/rme/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  UserCircleIcon,
  DocumentTextIcon,
  BeakerIcon,
  IdentificationIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon,
  QueueListIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const ThermometerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75V4.5a3 3 0 116 0v8.25m-3 0v4.5m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
  </svg>
);

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
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER & NAVIGASI KEMBALI */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/appointments" className="group p-4 bg-slate-900 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-all duration-300">
              <ArrowLeftIcon className="w-6 h-6 text-slate-400 group-hover:text-slate-100 transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                Clinical Examination
              </h1>
              <p className="text-slate-500 font-extrabold tracking-widest uppercase text-xs mt-1">Electronic Medical Record • SOAP System</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-black text-xs tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ACTIVE SESSION
          </div>
        </div>


        {/* KARTU INFO PASIEN (Patient Banner) */}
        <div className="relative group overflow-hidden bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-4xl font-black text-slate-200 border border-slate-700 shadow-xl">
                  {appointmentData?.patientName?.charAt(0) || 'P'}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-slate-950 rounded-xl border border-slate-700 shadow-lg">
                  <UserCircleIcon className="w-6 h-6 text-slate-400" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-slate-50">{appointmentData?.patientName || 'Loading...'}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-slate-950/60 rounded-lg text-slate-400 text-xs font-extrabold tracking-widest uppercase border border-slate-800">
                    {appointmentData?.doctorName || 'Attending Physician'}
                  </span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span className="text-slate-300 text-sm font-black tracking-wide">{appointmentData?.specialist || '-'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none p-5 bg-slate-950/60 rounded-3xl border border-slate-800 text-center min-w-[120px]">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-1">Queue No</p>
                <p className="text-2xl font-black text-slate-200 italic">#{appointmentId?.padStart(3, '0') || '---'}</p>
              </div>
              <div className="flex-1 md:flex-none p-5 bg-slate-950/60 rounded-3xl border border-slate-800 text-center min-w-[120px]">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-1">Visit Date</p>
                <div className="flex items-center justify-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-black text-slate-200">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN 1: VITAL SIGN & ALERGI */}
        <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
              <HeartIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-50">Clinical Vitals</h3>
              <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">Baseline health metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative pt-3">
              <label className="absolute -top-1 left-4 px-2 bg-slate-900 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] z-10">Allergies</label>
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 focus-within:border-indigo-500/50 transition-all">
                <IdentificationIcon className="w-5 h-5 text-slate-600" />
                <input type="text" name="alergi" value={formData.alergi} onChange={handleChange} placeholder="None recorded" className="w-full bg-transparent text-sm font-bold text-slate-200 outline-none placeholder:text-slate-800" />
              </div>
            </div>
            <div className="relative pt-3">
              <label className="absolute -top-1 left-4 px-2 bg-slate-900 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] z-10">Blood Pressure</label>
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 focus-within:border-emerald-500/50 transition-all">
                <HeartIcon className="w-5 h-5 text-slate-600" />
                <input type="text" name="tekananDarah" value={formData.tekananDarah} onChange={handleChange} placeholder="120/80" className="w-full bg-transparent text-sm font-bold text-slate-200 outline-none placeholder:text-slate-800" />
                <span className="text-[10px] font-black text-slate-700">mmHg</span>
              </div>
            </div>
            <div className="relative pt-3">
              <label className="absolute -top-1 left-4 px-2 bg-slate-900 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] z-10">Temperature</label>
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 focus-within:border-emerald-500/50 transition-all">
                <ThermometerIcon className="w-5 h-5 text-slate-600" />
                <input type="text" name="suhu" value={formData.suhu} onChange={handleChange} placeholder="36.5" className="w-full bg-transparent text-sm font-bold text-slate-200 outline-none placeholder:text-slate-800" />
                <span className="text-[10px] font-black text-slate-700">°C</span>
              </div>
            </div>
            <div className="relative pt-3 text-left">
              <label className="absolute -top-1 left-4 px-2 bg-slate-900 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] z-10">Heart Rate</label>
              <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 focus-within:border-emerald-500/50 transition-all">
                <ClockIcon className="w-5 h-5 text-slate-600" />
                <input type="text" placeholder="80" className="w-full bg-transparent text-sm font-bold text-slate-200 outline-none placeholder:text-slate-800" />
                <span className="text-[10px] font-black text-slate-700">BPM</span>
              </div>
            </div>
          </div>
        </div>
        {/* FORMULIR UTAMA */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* BAGIAN 2: SOAP */}
          <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 md:p-10 space-y-10 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                <DocumentTextIcon className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-50">Clinical Documentation</h3>
                <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">SOAP Methodology</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Subjective */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg flex items-center justify-center font-black text-xs">S</span>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">Subjective</label>
                </div>
                <div className="relative group">
                  <textarea
                    required
                    name="subjective"
                    value={formData.subjective}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe patient's symptoms and complaints..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-[2rem] p-6 text-sm font-bold text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-900"
                  ></textarea>
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg flex items-center justify-center font-black text-xs">O</span>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">Objective</label>
                </div>
                <div className="relative group">
                  <textarea
                    required
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Physical findings, lab results, and observations..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-[2rem] p-6 text-sm font-bold text-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all resize-none placeholder:text-slate-900"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Assessment (ICD-10) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg flex items-center justify-center font-black text-xs">A</span>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">Assessment & Diagnosis</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <select
                    required
                    name="assessment_icd10"
                    value={formData.assessment_icd10}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-sm font-black text-slate-200 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">Select ICD-10 Code</option>
                    <option value="J00" className="bg-slate-900">J00 - Acute Nasopharyngitis</option>
                    <option value="A09" className="bg-slate-900">A09 - Gastroenteritis</option>
                    <option value="I10" className="bg-slate-900">I10 - Essential Hypertension</option>
                    <option value="E11" className="bg-slate-900">E11 - Type 2 Diabetes</option>
                    <option value="K30" className="bg-slate-900">K30 - Dyspepsia</option>
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                <div className="md:col-span-2 relative group">
                  <input
                    type="text"
                    placeholder="Additional diagnostic notes..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-sm font-black text-slate-200 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all placeholder:text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg flex items-center justify-center font-black text-xs">P</span>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">Plan</label>
              </div>
              <div className="relative group">
                <textarea
                  required
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Treatment plan, procedures, and patient instructions..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-[2rem] p-6 text-sm font-bold text-slate-200 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all resize-none placeholder:text-slate-900"
                ></textarea>
              </div>
            </div>
          </div>

          {/* BAGIAN 3 - E-PRESCRIBING */}
          <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                  <BeakerIcon className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-50">E-Prescribing</h3>
                  <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">Pharmacy Integration</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <select
                onChange={(e) => addMedicineToPrescription(e.target.value)}
                value=""
                className="w-full appearance-none bg-slate-950/60 border border-slate-800 rounded-[2rem] p-6 text-sm font-black text-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all cursor-pointer"
              >
                <option value="">Search Pharmacy Inventory...</option>
                {availableMedicines.map(m => (
                  <option key={m.id} value={m.id} disabled={m.stock <= 0} className="bg-slate-900">
                    {m.name} ({m.unit}) - Stock: {m.stock}
                  </option>
                ))}
              </select>
              <PlusIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 pointer-events-none" />
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedPrescription.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-slate-950/40 rounded-[2rem] border border-dashed border-slate-800"
                  >
                    <p className="text-sm text-slate-700 italic font-black uppercase tracking-widest">No medications added</p>
                  </motion.div>
                ) : (
                  selectedPrescription.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-950/60 border border-slate-800 rounded-[2rem] hover:border-slate-700 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-slate-100 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase">{item.unit}</p>
                      </div>
                      <div className="w-full md:w-28">
                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-1 bg-slate-900 text-[8px] font-extrabold text-slate-500 uppercase">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => {
                              const newVal = parseInt(e.target.value);
                              setSelectedPrescription(selectedPrescription.map((p, i) => i === idx ? { ...p, qty: newVal } : p));
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-black text-slate-200 text-center outline-none focus:border-emerald-500/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex-[2] w-full">
                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-1 bg-slate-900 text-[8px] font-extrabold text-slate-500 uppercase">Instructions</label>
                          <input
                            type="text"
                            value={item.instruction}
                            onChange={(e) => setSelectedPrescription(selectedPrescription.map((p, i) => i === idx ? { ...p, instruction: e.target.value } : p))}
                            placeholder="e.g. 3x1 after meal"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-black text-slate-200 outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-900"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPrescription(selectedPrescription.filter((_, i) => i !== idx))}
                        className="p-4 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col md:flex-row justify-end items-center gap-6 pb-20">
            <Link href="/appointments" className="text-sm font-extrabold text-slate-500 hover:text-slate-300 transition-colors tracking-widest uppercase">
              Discard Changes
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-5 bg-slate-100 text-slate-950 rounded-3xl font-black text-sm tracking-widest uppercase shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <IdentificationIcon className="w-5 h-5" />
              )}
              {isSubmitting ? 'Processing...' : 'Finalize Medical Record'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}