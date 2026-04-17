// apps/web/src/app/medicines/page.tsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('Tablet');
  const [price, setPrice] = useState('');
  const [threshold, setThreshold] = useState('10');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // 1. UPDATE: Fetch data dengan menyertakan Token JWT
  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('omni_token'); // Mengambil token dari localStorage
      
      const res = await fetch('http://localhost:3001/api/medicines', {
        headers: { 
          'Authorization': `Bearer ${token}` // Menyertakan token di header Authorization
        }
      });

      // Menangani jika akses ditolak (401 atau 403)
      if (res.status === 401 || res.status === 403) {
        toast.error('Sesi habis atau Anda tidak punya akses.');
        return;
      }

      const json = await res.json();
      setMedicines(json.data || []);
    } catch (error) {
      toast.error('Gagal memuat data inventaris obat.');
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  // 2. UPDATE: Menambah obat juga memerlukan Token JWT
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('omni_token'); // Mengambil token
      
      const res = await fetch('http://localhost:3001/api/medicines', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Menyertakan token di header
        },
        body: JSON.stringify({ 
          name, 
          stock: parseInt(stock), 
          unit, 
          price: parseFloat(price), 
          threshold: parseInt(threshold) 
        })
      });

      if (res.status === 401 || res.status === 403) {
        toast.error('Anda tidak memiliki izin untuk menambah data.');
        return;
      }

      if (!res.ok) throw new Error();

      setName(''); setStock(''); setPrice('');
      fetchMedicines();
      toast.success(`${name} berhasil ditambahkan ke inventaris!`);
    } catch (error) {
      toast.error('Gagal menambahkan obat. Periksa koneksi API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const processedMedicines = useMemo(() => {
    let result = [...medicines];
    if (searchTerm) {
      result = result.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterStatus === 'Stok Rendah') {
      result = result.filter(m => m.stock <= (m.threshold || 10));
    } else if (filterStatus === 'Stok Aman') {
      result = result.filter(m => m.stock > (m.threshold || 10));
    }
    return result;
  }, [medicines, searchTerm, filterStatus]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl shadow-lg transition-colors duration-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Inventaris Obat</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors duration-500">Kelola ketersediaan stok farmasi klinik secara real-time.</p>
            </div>
          </div>
          
          <div className="flex gap-4 bg-white dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-md transition-all">Dashboard</Link>
          </div>
        </div>

        {/* FORM INPUT OBAT BARU */}
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 mb-8 flex flex-col gap-6 relative z-20 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Nama Obat</label>
              <input required placeholder="Contoh: Paracetamol 500mg" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Jumlah Stok</label>
              <div className="flex gap-2">
                <input required type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" />
                <select value={unit} onChange={e => setUnit(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-2 outline-none">
                  <option>Tablet</option><option>Botol</option><option>Kapsul</option><option>Tube</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="bg-emerald-600 dark:bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {isSubmitting ? '...' : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>Tambah Obat</>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Harga per Unit (Rp)</label>
              <input required type="number" placeholder="5000" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Batas Stok Rendah (Threshold)</label>
              <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 outline-none transition-all" />
            </div>
          </div>
        </form>

        {/* TOOLBAR SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-500">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Cari nama obat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all text-sm" />
          </div>
          
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold outline-none transition-all cursor-pointer">
            <option>Semua</option><option>Stok Aman</option><option>Stok Rendah</option>
          </select>
        </div>

        {/* TABEL INVENTARIS */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Obat</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sisa Stok</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Harga / Unit</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                {processedMedicines.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">Data obat tidak ditemukan.</td></tr>
                ) : processedMedicines.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors duration-300 group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">
                      {m.stock} {m.unit}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatIDR(m.price)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {m.stock <= (m.threshold || 10) ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 uppercase tracking-tighter">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span> Stok Rendah
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-tighter">
                          Stok Aman
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <button className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-emerald-200">
                        Update Stok
                      </button>
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