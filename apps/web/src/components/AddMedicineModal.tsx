// apps/web/src/components/AddMedicineModal.tsx
"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BeakerIcon, 
  ScaleIcon, 
  BanknotesIcon, 
  Squares2X2Icon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function AddMedicineModal({ onRefresh }: { onRefresh: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    unit: 'Tablet',
    price: '',
    threshold: 10
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = Cookies.get('auth-token');
      const res = await fetch('http://127.0.0.1:3001/api/medicines', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Obat berhasil didaftarkan!');
        setIsOpen(false);
        onRefresh();
      }
    } catch (error) {
      toast.error('Gagal menyimpan data obat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 group"
      >
        <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
        <span>Tambah Stok Baru</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[2.5rem] w-full max-w-lg border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-3xl font-black text-white mb-8">Input Obat Baru</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Medicine Name */}
                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Nama Obat</label>
                  <div className="relative flex items-center">
                    <BeakerIcon className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      required 
                      type="text" 
                      placeholder="Misal: Amoxicillin 500mg" 
                      className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 text-white placeholder:text-slate-600 hover:bg-white/[0.07]" 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Stock Quantity */}
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Jumlah Stok</label>
                    <div className="relative flex items-center">
                      <ScaleIcon className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        required 
                        type="number" 
                        placeholder="0" 
                        className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 text-white placeholder:text-slate-600 hover:bg-white/[0.07]" 
                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                      />
                    </div>
                  </div>

                  {/* Unit Selection */}
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Satuan</label>
                    <div className="relative flex items-center">
                      <Squares2X2Icon className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <select 
                        className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 text-white appearance-none hover:bg-white/[0.07]" 
                        onChange={e => setFormData({...formData, unit: e.target.value})}
                      >
                        <option value="Tablet" className="bg-slate-900">Tablet</option>
                        <option value="Botol" className="bg-slate-900">Botol</option>
                        <option value="Strip" className="bg-slate-900">Strip</option>
                        <option value="Tube" className="bg-slate-900">Tube</option>
                        <option value="Kapsul" className="bg-slate-900">Kapsul</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Input */}
                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 px-2 bg-[#0f172a] text-[10px] font-bold text-indigo-400 uppercase tracking-widest z-10">Harga Satuan</label>
                  <div className="relative flex items-center">
                    <BanknotesIcon className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <div className="flex w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-400/50 transition-all hover:bg-white/[0.07]">
                      <div className="pl-12 pr-4 flex items-center justify-center border-r border-white/10 text-slate-400 text-sm font-bold">Rp</div>
                      <input 
                        required 
                        type="number" 
                        placeholder="5000" 
                        className="flex-1 px-4 py-5 bg-transparent outline-none text-white placeholder:text-slate-600" 
                        onChange={e => setFormData({...formData, price: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    className="flex-1 py-5 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Memproses...' : 'Simpan Obat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}