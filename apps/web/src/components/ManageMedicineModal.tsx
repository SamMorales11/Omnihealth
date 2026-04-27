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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addQty, setAddQty] = useState(0);
  const [editData, setEditData] = useState({
    price: medicine.price,
    threshold: medicine.threshold
  });

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch(`http://127.0.0.1:3001/api/medicines/${medicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stock: medicine.stock + addQty })
      });
      if (res.ok) {
        toast.success(`Stok ${medicine.name} diperbarui!`);
        setIsOpen(false);
        setMode('menu');
        onRefresh();
      }
    } catch (error) {
      toast.error('Gagal memperbarui stok.');
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
        setIsOpen(false);
        onRefresh();
      }
    } catch (error) {
      toast.error('Gagal menghapus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 transition-all">
        Manajemen
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">{medicine.name}</h2>
            {mode === 'menu' && (
              <div className="space-y-3">
                <button onClick={() => setMode('restock')} className="w-full p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-sm text-left hover:bg-emerald-100 transition-colors">Update Stok (Restock)</button>
                <button onClick={handleDelete} className="w-full p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-sm text-left hover:bg-rose-100 transition-colors">Hapus Obat</button>
                <button onClick={() => setIsOpen(false)} className="w-full py-4 text-xs font-bold text-slate-400 uppercase">Tutup</button>
              </div>
            )}
            {mode === 'restock' && (
              <form onSubmit={handleRestock}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tambah Stok</label>
                <input required type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl mb-6 outline-none" onChange={e => setAddQty(parseInt(e.target.value))} />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setMode('menu')} className="flex-1 py-4 text-sm font-bold text-slate-500">Kembali</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold">Simpan</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}