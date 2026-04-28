// apps/web/src/components/ManageMedicineModal.tsx
"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface ManageMedicineModalProps {
  medicine: any;
  onRefresh: () => void;
}

export default function ManageMedicineModal({ medicine, onRefresh }: ManageMedicineModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'menu' | 'restock' | 'edit'>('menu');
  const [type, setType] = useState<'add' | 'sub'>('add'); // REVISI: Tambahkan tipe penyesuaian
  const [qty, setQty] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editData, setEditData] = useState({
    price: medicine.price,
    threshold: medicine.threshold
  });

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return toast.error("Jumlah harus lebih dari 0");

    // REVISI: Hitung total stok akhir berdasarkan tipe
    const adjustment = type === 'add' ? qty : -qty;
    const newTotalStock = medicine.stock + adjustment;

    // Validasi agar stok tidak minus
    if (newTotalStock < 0) {
      return toast.error("Gagal: Stok akhir tidak boleh kurang dari nol!");
    }

    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch(`http://127.0.0.1:3001/api/medicines/${medicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stock: newTotalStock })
      });

      if (res.ok) {
        toast.success(`Stok ${medicine.name} berhasil ${type === 'add' ? 'ditambah' : 'dikurangi'}!`);
        closeModal();
        onRefresh();
      }
    } catch (error) {
      toast.error('Gagal memperbarui stok.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch(`http://127.0.0.1:3001/api/medicines/${medicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        toast.success('Data obat diperbarui.');
        closeModal();
        onRefresh();
      }
    } catch (error) {
      toast.error('Gagal memperbarui data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus ${medicine.name}?`)) return;
    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch(`http://127.0.0.1:3001/api/medicines/${medicine.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Obat dihapus.');
        closeModal();
        onRefresh();
      }
    } catch (error) {
      toast.error('Gagal menghapus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setMode('menu');
    setQty(0);
    setType('add');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 transition-all"
      >
        Manajemen
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 text-left">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 text-left">{medicine.name}</h2>
            <p className="text-xs font-medium text-slate-500 mb-8 tracking-wide uppercase text-left">Stok Saat Ini: {medicine.stock} {medicine.unit}</p>
            
            {mode === 'menu' && (
              <div className="space-y-3">
                <button onClick={() => setMode('restock')} className="w-full p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-sm text-left hover:bg-emerald-100 transition-colors flex items-center justify-between group">
                  Penyesuaian Stok
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </button>
                <button onClick={() => setMode('edit')} className="w-full p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl font-bold text-sm text-left hover:bg-blue-100 transition-colors flex items-center justify-between group">
                  Edit Detail Obat
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </button>
                <button onClick={handleDelete} className="w-full p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-sm text-left hover:bg-rose-100 transition-colors">
                  Hapus Obat
                </button>
                <button onClick={closeModal} className="w-full py-4 text-xs font-bold text-slate-400 uppercase">Tutup</button>
              </div>
            )}

            {mode === 'restock' && (
              <form onSubmit={handleUpdateStock} className="animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6 text-left">
                  <button type="button" onClick={() => setType('add')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === 'add' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'}`}>TAMBAH (+)</button>
                  <button type="button" onClick={() => setType('sub')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === 'sub' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500'}`}>KURANG (-)</button>
                </div>
                
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-left">Jumlah Penyesuaian</label>
                <input autoFocus required type="number" placeholder="0" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setQty(parseInt(e.target.value))} />
                
                <div className="flex gap-3 text-left">
                  <button type="button" onClick={() => setMode('menu')} className="flex-1 py-4 text-sm font-bold text-slate-500">Kembali</button>
                  <button type="submit" disabled={isSubmitting} className={`flex-1 py-4 text-white rounded-2xl font-bold ${type === 'add' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    {isSubmitting ? 'Proses...' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}

            {mode === 'edit' && (
              <form onSubmit={handleEdit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 text-left">Harga Jual (Rp)</label>
                  <input required type="number" value={editData.price} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" onChange={e => setEditData({...editData, price: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 text-left">Batas Minimum Stok</label>
                  <input required type="number" value={editData.threshold} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" onChange={e => setEditData({...editData, threshold: parseInt(e.target.value)})} />
                </div>
                <div className="flex gap-3 pt-4 text-left">
                  <button type="button" onClick={() => setMode('menu')} className="flex-1 py-4 text-sm font-bold text-slate-500">Kembali</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold">Simpan</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}