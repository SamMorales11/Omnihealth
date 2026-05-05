// apps/web/src/components/ManageMedicineModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import portal
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AdjustmentsHorizontalIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ManageMedicineModalProps {
  medicine: any;
  onRefresh: () => void;
}

export default function ManageMedicineModal({ medicine, onRefresh }: ManageMedicineModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'menu' | 'restock' | 'edit'>('menu');
  const [type, setType] = useState<'add' | 'sub'>('add');
  const [qty, setQty] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false); // Untuk memastikan portal hanya render di client
  
  const [editData, setEditData] = useState({
    price: medicine.price,
    threshold: medicine.threshold
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return toast.error("Jumlah harus lebih dari 0");
    const adjustment = type === 'add' ? qty : -qty;
    const newTotalStock = medicine.stock + adjustment;
    if (newTotalStock < 0) return toast.error("Gagal: Stok akhir tidak boleh kurang dari nol!");

    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch(`http://127.0.0.1:3001/api/medicines/${medicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stock: newTotalStock })
      });
      if (res.ok) {
        toast.success(`Stok berhasil diperbarui!`);
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

  // Komponen Modal yang akan dilempar keluar lewat Portal
  const ModalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-900/95 backdrop-blur-3xl p-10 rounded-[3rem] w-full max-w-md border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-6 right-6">
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">{medicine.name}</h2>
              <p className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase mt-1">Medicine Console</p>
            </div>
            <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between text-left">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock Status</p>
                <p className="text-2xl font-black text-white italic">{medicine.stock} <span className="text-slate-500 text-sm font-bold uppercase">{medicine.unit}</span></p>
              </div>
              <div className={`px-4 py-2 rounded-2xl text-[10px] font-black border ${medicine.stock <= medicine.threshold ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {medicine.stock <= medicine.threshold ? 'LOW STOCK' : 'AVAILABLE'}
              </div>
            </div>

            {mode === 'menu' && (
              <div className="space-y-4">
                <button onClick={() => setMode('restock')} className="w-full group flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><AdjustmentsHorizontalIcon className="w-6 h-6" /></div>
                    <span className="font-bold text-white/90">Stock Adjustment</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-emerald-500/50" />
                </button>
                <button onClick={() => setMode('edit')} className="w-full group flex items-center justify-between p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><PencilSquareIcon className="w-6 h-6" /></div>
                    <span className="font-bold text-white/90">Edit Details</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-indigo-500/50" />
                </button>
                <button onClick={handleDelete} className="w-full p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/20 transition-all font-bold text-rose-500 text-left flex items-center gap-4">
                  <div className="p-3 bg-rose-500/10 rounded-xl"><TrashIcon className="w-6 h-6" /></div>
                  Delete Medicine
                </button>
              </div>
            )}

            {mode === 'restock' && (
              <form onSubmit={handleUpdateStock} className="space-y-8">
                <div className="flex bg-slate-800/50 p-2 rounded-2xl border border-white/5">
                  <button type="button" onClick={() => setType('add')} className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${type === 'add' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>ADD (+)</button>
                  <button type="button" onClick={() => setType('sub')} className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${type === 'sub' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}>SUB (-)</button>
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Quantity</label>
                  <input autoFocus required type="number" placeholder="0" className="w-full p-6 bg-slate-950/50 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-white text-center text-3xl font-black italic" onChange={e => setQty(parseInt(e.target.value))} />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setMode('menu')} className="flex-1 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white">Batal</button>
                  <button type="submit" disabled={isSubmitting} className={`flex-[2] py-4 text-white rounded-2xl font-black uppercase tracking-wider transition-all hover:scale-[1.02] ${type === 'add' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-600/20'}`}>{isSubmitting ? '...' : 'Confirm'}</button>
                </div>
              </form>
            )}

            {mode === 'edit' && (
              <form onSubmit={handleEdit} className="space-y-6">
                <div className="relative text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Price (IDR)</label>
                  <input required type="number" value={editData.price} className="w-full p-5 bg-slate-950/50 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-bold" onChange={e => setEditData({...editData, price: e.target.value})} />
                </div>
                <div className="relative text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Low Stock Threshold</label>
                  <input required type="number" value={editData.threshold} className="w-full p-5 bg-slate-950/50 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-bold" onChange={e => setEditData({...editData, threshold: parseInt(e.target.value)})} />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setMode('menu')} className="flex-1 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-wider transition-all shadow-indigo-600/20">{isSubmitting ? '...' : 'Save'}</button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2.5 bg-slate-900 dark:bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:border-indigo-500 transition-all uppercase tracking-widest"
      >
        Manajemen
      </button>

      {/* Render modal di luar hirarki DOM normal menggunakan Portal */}
      {mounted && createPortal(ModalContent, document.body)}
    </>
  );
}