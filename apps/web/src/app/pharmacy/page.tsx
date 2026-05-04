// apps/web/src/app/pharmacy/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import AddMedicineModal from '@/components/AddMedicineModal';
import ManageMedicineModal from '@/components/ManageMedicineModal';
import { 
  BeakerIcon, 
  ClipboardDocumentCheckIcon, 
  ClockIcon, 
  UserIcon,
  ArrowLongLeftIcon,
  CubeIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

// Data Simulasi Antrean Apotek
const initialPrescriptions = [
  {
    id: "RXP-001",
    patientName: "Ahmad Budi Santoso",
    doctorName: "dr. Sarah Jenkins",
    time: "10:45 WIB",
    medicines: [
      { name: "Paracetamol 500mg", dosage: "3 x 1 Tablet", qty: "10 Tablet", type: "tablet" },
      { name: "Loratadine 10mg", dosage: "1 x 1 Tablet", qty: "5 Tablet", type: "tablet" }
    ],
    status: "Menunggu Disiapkan"
  },
  {
    id: "RXP-002",
    patientName: "Siti Aminah",
    doctorName: "dr. Andi Wijaya",
    time: "11:15 WIB",
    medicines: [
      { name: "Ambroxol Syr 30mg/5ml", dosage: "3 x 1 Sendok Takar", qty: "1 Botol", type: "syrup" },
      { name: "Azithromycin 500mg", dosage: "1 x 1 Tablet (Habiskan)", qty: "3 Tablet", type: "tablet" }
    ],
    status: "Menunggu Disiapkan"
  }
];

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [medicines, setMedicines] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch('http://127.0.0.1:3001/api/medicines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setMedicines(json.data || []);
    } catch (error) {
      toast.error('Gagal memuat data inventaris obat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMedicines(); 
  }, []);

  const handleProcess = (id: string) => {
    toast.success(`Resep ${id} berhasil diproses dan diserahkan ke pasien!`);
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER UTAMA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20">
              <CheckBadgeIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Pharmacy & Dispensary</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-[0.2em]">Queue Management & Inventory</p>
            </div>
          </div>
          
          <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all shadow-sm group">
            <ArrowLongLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* BAGIAN 1: ANTREAN RESEP */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <div className="w-3 h-8 bg-emerald-500 rounded-full"></div>
              Prescription Preparation Queue
            </h2>
            <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">
              {prescriptions.length} Orders Pending
            </div>
          </div>

          {prescriptions.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-slate-200 dark:border-white/5 border-dashed">
              <ClipboardDocumentCheckIcon className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-600">Queue is Empty</h3>
              <p className="text-slate-400 dark:text-slate-500 mt-2">All prescriptions have been successfully dispensed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col group transition-all hover:border-white/10">
                  {/* Patient Header */}
                  <div className="p-8 pb-6 flex justify-between items-start border-b border-white/5">
                    <div className="flex gap-5">
                      <div className="p-4 bg-indigo-500/10 rounded-2xl">
                        <UserIcon className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white leading-tight">{rx.patientName}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs font-medium text-slate-400">Dr. {rx.doctorName.replace('dr. ', '')}</p>
                          <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <ClockIcon className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{rx.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end text-emerald-400/50 mb-1">
                        <HashtagIcon className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Prescription ID</span>
                      </div>
                      <p className="text-xl font-black text-emerald-400">{rx.id}</p>
                    </div>
                  </div>

                  {/* Medicines List */}
                  <div className="p-8 pt-6 flex-grow">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <BeakerIcon className="w-3 h-3" />
                      Medicines to Prepare (R/)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rx.medicines.map((med, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-slate-800 rounded-xl">
                              {med.type === 'syrup' ? (
                                <BeakerIcon className="w-5 h-5 text-indigo-400" />
                              ) : (
                                <ClipboardDocumentCheckIcon className="w-5 h-5 text-emerald-400" />
                              )}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                              QTY: {med.qty.split(' ')[0]}
                            </span>
                          </div>
                          <p className="font-bold text-white text-sm line-clamp-1">{med.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{med.dosage}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-8 bg-white/[0.02] border-t border-white/5 mt-auto">
                    <button 
                      onClick={() => handleProcess(rx.id)} 
                      className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-bold text-sm transition-all shadow-xl shadow-emerald-600/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-3 group"
                    >
                      <CheckBadgeIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
                      Dispense & Mark as Finished
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BAGIAN 2: GUDANG & STOK OBAT */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-3 h-8 bg-indigo-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Pharmacy Inventory</h2>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">Real-time Stock Monitoring</p>
              </div>
            </div>
            <AddMedicineModal onRefresh={fetchMedicines} />
          </div>

          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Medicine Identity</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Stock Status</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Unit</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Unit Price</th>
                    <th className="px-10 py-6 text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center">
                        <CubeIcon className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <span className="text-slate-400 dark:text-slate-600 font-bold">Inventory Database Empty</span>
                      </td>
                    </tr>
                  ) : medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 group-hover:text-indigo-400 transition-colors">
                            <CubeIcon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black border ${
                            m.stock <= m.threshold 
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {m.stock} {m.unit}
                          </div>
                          {m.stock <= m.threshold && (
                            <div className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase tracking-tighter animate-pulse">
                              <ExclamationCircleIcon className="w-3 h-3" />
                              Low Stock!
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{m.unit}</td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                          <BanknotesIcon className="w-4 h-4 text-slate-400" />
                          Rp {parseInt(m.price).toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <ManageMedicineModal medicine={m} onRefresh={fetchMedicines} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
