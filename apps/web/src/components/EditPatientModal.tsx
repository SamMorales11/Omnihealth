// apps/web/src/components/EditPatientModal.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types';
import { PatientService, CreatePatientInput } from '@/services/patient.service';
import toast from 'react-hot-toast';

interface EditPatientModalProps {
  patient: Patient;
}

export default function EditPatientModal({ patient }: EditPatientModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<CreatePatientInput>>({
    nik: patient.nik,
    name: patient.name,
    dob: patient.dob,
    phone: patient.phone || '',
    address: patient.address || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await PatientService.updatePatient(patient.id, formData);
      
      if (success) {
        toast.success('Data pasien berhasil diperbarui!');
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error('Gagal mengubah data pasien.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mr-4 text-indigo-400 transition-colors hover:text-indigo-300 font-bold text-sm"
      >
        Edit
      </button>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          
          {/* MODAL BOX */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-indigo-900/10 border border-transparent dark:border-slate-700 w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
            
            {/* HEADER MODAL - Diperbaiki rata kiri */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-500">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-blue-100 dark:bg-indigo-500/20 text-blue-600 dark:text-indigo-400 rounded-lg transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-white transition-colors duration-500 text-left">Perbarui Data Pasien</h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 transition-colors duration-500 text-left">Lakukan perubahan pada data identitas pasien.</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* BODY MODAL (FORM) - Diperbaiki rata kiri */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5 text-left">
              <div className="text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Nomor Induk Kependudukan (NIK)</label>
                <input 
                  required 
                  type="text" 
                  maxLength={16} 
                  minLength={16}
                  value={formData.nik} 
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  placeholder="Contoh: 3201012345678901" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 block p-3 transition-all outline-none" 
                />
              </div>

              <div className="text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Nama Lengkap Pasien</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Sesuai KTP..." 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 block p-3 transition-all outline-none" 
                />
              </div>

              <div className="text-left">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Tanggal Lahir</label>
                <input 
                  required 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 block p-3 transition-all outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="text-left">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">No. HP / Whatsapp</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.phone || ''} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="0812..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 block p-3 transition-all outline-none" 
                  />
                </div>
                <div className="text-left">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500 text-left">Kota / Domisili</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Contoh: Jakarta Selatan" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-indigo-500 block p-3 transition-all outline-none" 
                  />
                </div>
              </div>

              {/* FOOTER MODAL (TOMBOL) */}
              <div className="pt-4 flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-50 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-indigo-900/30 transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Menyimpan...</span>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}