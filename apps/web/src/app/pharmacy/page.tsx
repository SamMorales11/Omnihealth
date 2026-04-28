// apps/web/src/app/pharmacy/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import AddMedicineModal from '@/components/AddMedicineModal'; // Impor Modal Tambah
import ManageMedicineModal from '@/components/ManageMedicineModal'; // Impor Modal Manajemen

// Data Simulasi Antrean Apotek (Tetap dipertahankan sesuai aslinya)
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
  const [medicines, setMedicines] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data stok obat dari Backend
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
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER UTAMA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">Farmasi & Apotek</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 text-left">Kelola antrean resep dan inventaris obat klinik.</p>
            </div>
          </div>
          
          <Link href="/dashboard" className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
            Kembali ke Dashboard
          </Link>
        </div>

        {/* BAGIAN 1: ANTREAN RESEP */}
        <div className="mb-16 text-left">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-left">
            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
            Antrean Persiapan Obat
          </h2>
          {prescriptions.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed text-left">
              <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">Tidak Ada Antrean Resep</h3>
              <p className="text-slate-400 dark:text-slate-500 mt-1">Semua resep telah berhasil diserahkan ke pasien.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors duration-500 text-left text-left">
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start text-left">
                    <div className="text-left">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 mb-2">
                        <svg className="w-3 h-3 mr-1 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {rx.status}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white text-left">{rx.patientName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium text-left">Dari: {rx.doctorName} • {rx.time}</p>
                    </div>
                    <div className="text-right text-right">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">No. Resep</p>
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 text-right">{rx.id}</p>
                    </div>
                  </div>
                  <div className="p-5 flex-grow text-left text-left">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 text-left">Daftar Obat (R/)</h4>
                    <ul className="space-y-4 text-left">
                      {rx.medicines.map((med, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 text-left text-left">
                          <div className="text-left">
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm text-left">{med.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic text-left">{med.dosage}</p>
                          </div>
                          <span className="font-black text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-left">{med.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 mt-auto text-left">
                    <button onClick={() => handleProcess(rx.id)} className="w-full py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-md flex justify-center items-center gap-2 text-left">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Tandai Selesai & Serahkan Obat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BAGIAN 2: GUDANG & STOK OBAT */}
        <div className="text-left">
          <div className="flex justify-between items-center mb-6 text-left">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 text-left">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              Inventaris & Stok Gudang
            </h2>
            {/* Tombol Tambah dipertahankan di bagian ini untuk manajemen stok */}
            <AddMedicineModal onRefresh={fetchMedicines} />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-left">
            <table className="w-full text-left text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Nama Obat</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Status Stok</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Satuan</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Harga Satuan</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-left">
                {medicines.length === 0 ? (
                  <tr className="text-left"><td colSpan={5} className="px-8 py-10 text-center text-slate-400 text-left">Belum ada data obat di database.</td></tr>
                ) : medicines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors text-left text-left">
                    <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white text-left">{m.name}</td>
                    <td className="px-8 py-5 text-left text-left text-left text-left">
                      <div className="flex items-center gap-3 text-left">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${m.stock <= m.threshold ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'} text-left`}>
                          {m.stock}
                        </span>
                        {m.stock <= m.threshold && <span className="text-[10px] font-bold text-rose-500 uppercase animate-pulse text-left">Stok Menipis!</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 text-left">{m.unit}</td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-700 dark:text-slate-300 text-left">Rp {parseInt(m.price).toLocaleString('id-ID')}</td>
                    <td className="px-8 py-5 text-right text-right">
                      <ManageMedicineModal medicine={m} onRefresh={fetchMedicines} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}