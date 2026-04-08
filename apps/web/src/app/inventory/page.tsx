// apps/web/src/app/inventory/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Data Simulasi Stok Obat
const initialMedicines = [
  { id: "MED-001", name: "Paracetamol 500mg", category: "Analgesik", stock: 150, unit: "Tablet", price: 1500, status: "Aman" },
  { id: "MED-002", name: "Ambroxol Syr 30mg/5ml", category: "Ekspektoran", stock: 12, unit: "Botol", price: 22500, status: "Menipis" },
  { id: "MED-003", name: "Azithromycin 500mg", category: "Antibiotik", stock: 0, unit: "Tablet", price: 15000, status: "Habis" },
  { id: "MED-004", name: "Loratadine 10mg", category: "Antihistamin", stock: 85, unit: "Tablet", price: 5000, status: "Aman" },
  { id: "MED-005", name: "Omeprazole 20mg", category: "Antasida", stock: 30, unit: "Kapsul", price: 3500, status: "Menipis" },
];

export default function InventoryPage() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [searchTerm, setSearchTerm] = useState('');

  // Menghitung statistik stok
  const totalItems = medicines.length;
  const lowStock = medicines.filter(m => m.status === "Menipis").length;
  const outOfStock = medicines.filter(m => m.status === "Habis").length;

  // Filter pencarian
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    med.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const handleRestock = (name: string) => {
    toast.success(`Permintaan restock untuk ${name} berhasil dikirim ke supplier!`);
  };

  // Badge Status Stok
  const getStockBadge = (status: string) => {
    switch (status) {
      case 'Aman': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700';
      case 'Menipis': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700';
      case 'Habis': return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-700';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-600 dark:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-200 dark:shadow-teal-900/40 transition-colors duration-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Stok Obat & Alkes</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-500">Kelola inventaris, pantau stok menipis, dan harga obat.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
              Dashboard
            </Link>
            <button className="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 dark:bg-teal-500 border border-transparent hover:bg-teal-700 dark:hover:bg-teal-600 rounded-xl shadow-md hover:shadow-lg hover:shadow-teal-200 dark:hover:shadow-teal-900/30 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah Baru
            </button>
          </div>
        </div>

        {/* KARTU STATISTIK STOK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 relative overflow-hidden transition-colors duration-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Item Aktif</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{totalItems} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Jenis</span></h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-amber-100 dark:border-amber-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 relative overflow-hidden transition-colors duration-500">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Stok Menipis (Peringatan)</p>
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">{lowStock} <span className="text-sm font-medium text-amber-500/70 dark:text-amber-400/70">Item</span></h3>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-rose-100 dark:border-rose-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 relative overflow-hidden transition-colors duration-500">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Stok Habis (Kritis)</p>
            <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400">{outOfStock} <span className="text-sm font-medium text-rose-500/70 dark:text-rose-400/70">Item</span></h3>
          </div>
        </div>

        {/* TABEL INVENTARIS */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-500">
          
          {/* TOOLBAR PENCARIAN */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 transition-colors duration-500">
            <div className="relative w-full max-w-md">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari nama obat atau kode item..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 transition-colors duration-500">
              <thead className="bg-slate-50 dark:bg-slate-800/80 transition-colors duration-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Info Obat</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sisa Stok</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Harga Jual</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/50 transition-colors duration-500">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">Data obat tidak ditemukan.</td>
                  </tr>
                ) : filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{med.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-600">{med.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm font-black ${med.stock === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {med.stock} <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">{med.unit}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatRupiah(med.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStockBadge(med.status)}`}>
                        {med.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center gap-3">
                        {(med.status === 'Menipis' || med.status === 'Habis') && (
                          <button 
                            type="button"
                            onClick={() => handleRestock(med.name)}
                            className="relative z-10 cursor-pointer px-4 py-2 bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-700 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md dark:shadow-none"
                          >
                            Restock
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => toast('Form Edit ' + med.name + ' dibuka!', { icon: '📝' })}
                          className="relative z-10 cursor-pointer px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg font-semibold text-sm transition-all"
                        >
                          Edit
                        </button>
                      </div>
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