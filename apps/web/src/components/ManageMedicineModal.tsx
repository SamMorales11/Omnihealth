// apps/web/src/components/ManageMedicineModal.tsx
"use client";
import { useState } from 'react';
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
  
  const [editData, setEditData] = useState({
    price: medicine.price,
    threshold: medicine.threshold
  });

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return toast.error("Jumlah harus lebih dari 0");

    const adjustment = type === 'add' ? qty : -qty;
    const newTotalStock = medicine.stock + adjustment;

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

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-slate-900/80 backdrop-blur-2xl p-12 rounded-[3rem] w-full max-w-lg border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={closeModal} 
                  className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-white mb-2 leading-tight">{medicine.name}</h2>
                <p className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">
                  Medicine Management Console
                </p>
              </div>
              
              <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stock Status</p>
                  <p className="text-2xl font-black text-white">{medicine.stock} <span className="text-slate-400 text-sm font-medium">{medicine.unit}</span></p>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black border ${medicine.stock <= medicine.threshold ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  {medicine.stock <= medicine.threshold ? 'LOW STOCK' : 'AVAILABLE'}
                </div>
              </div>

              {mode === 'menu' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setMode('restock')} 
                    className="w-full p-6 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-3xl font-bold tracking-wide text-sm flex items-center justify-between group transition-all hover:scale-[1.02] border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                        <AdjustmentsHorizontalIcon className="w-6 h-6" />
                      </div>
                      <span className="text-white/90">Stock Adjustment</span>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button 
                    onClick={() => setMode('edit')} 
                    className="w-full p-6 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-3xl font-bold tracking-wide text-sm flex items-center justify-between group transition-all hover:scale-[1.02] border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                        <PencilSquareIcon className="w-6 h-6" />
                      </div>
                      <span className="text-white/90">Edit Details</span>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button 
                    onClick={handleDelete} 
                    className="w-full p-6 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-3xl font-bold tracking-wide text-sm flex items-center justify-between group transition-all hover:scale-[1.02] border border-rose-500/20 shadow-lg shadow-rose-500/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400 group-hover:scale-110 transition-transform">
                        <TrashIcon className="w-6 h-6" />
                      </div>
                      <span className="text-white/90">Delete Medicine</span>
                    </div>
                  </button>
                </div>
              )}

              {mode === 'restock' && (
                <form onSubmit={handleUpdateStock} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex bg-slate-800/50 p-2 rounded-[2rem] mb-8 border border-white/5 shadow-inner">
                    <button 
                      type="button" 
                      onClick={() => setType('add')} 
                      className={`flex-1 py-4 text-xs font-bold rounded-2xl transition-all ${type === 'add' ? 'bg-emerald-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      ADD (+)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setType('sub')} 
                      className={`flex-1 py-4 text-xs font-bold rounded-2xl transition-all ${type === 'sub' ? 'bg-rose-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      SUBTRACT (-)
                    </button>
                  </div>
                  
                  <div className="relative group mb-8">
                    <label className="absolute -top-2.5 left-4 px-2 bg-slate-900 text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Adjustment Quantity</label>
                    <input 
                      autoFocus 
                      required 
                      type="number" 
                      placeholder="0" 
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 text-white placeholder:text-slate-600 transition-all text-center text-xl font-bold" 
                      onChange={e => setQty(parseInt(e.target.value))} 
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setMode('menu')} 
                      className="flex-1 py-5 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className={`flex-[2] py-5 text-white rounded-[1.5rem] font-bold tracking-wide transition-all hover:scale-[1.02] shadow-2xl ${type === 'add' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'}`}
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Stock Adjustment'}
                    </button>
                  </div>
                </form>
              )}

              {mode === 'edit' && (
                <form onSubmit={handleEdit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-2 bg-slate-900 text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Unit Price (IDR)</label>
                    <input 
                      required 
                      type="number" 
                      value={editData.price} 
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 text-white transition-all font-bold" 
                      onChange={e => setEditData({...editData, price: e.target.value})} 
                    />
                  </div>
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-2 bg-slate-900 text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Low Stock Threshold</label>
                    <input 
                      required 
                      type="number" 
                      value={editData.threshold} 
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 text-white transition-all font-bold" 
                      onChange={e => setEditData({...editData, threshold: parseInt(e.target.value)})} 
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setMode('menu')} 
                      className="flex-1 py-5 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-bold tracking-wide hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-600/30"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Updated Details'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}