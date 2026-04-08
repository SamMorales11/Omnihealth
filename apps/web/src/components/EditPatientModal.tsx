// apps/web/src/components/EditPatientModal.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types';
import { PatientService, CreatePatientInput } from '@/services/patient.service';

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

    const success = await PatientService.updatePatient(patient.id, formData);
    
    if (success) {
      setIsOpen(false);
      router.refresh(); 
    } else {
      alert('Gagal mengubah data pasien. Periksa koneksi Anda.');
    }
    
    setIsLoading(false);
  };

  return (
    <>
      {/* Tombol Teks "Edit" */}
      <button 
        onClick={() => setIsOpen(true)}
        className="mr-4 text-indigo-600 dark:text-indigo-400 transition-colors hover:text-indigo-900 dark:hover:text-indigo-300 font-medium"
      >
        Edit
      </button>

      {/* Latar Belakang Modal Blur Transparan */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          
          {/* Kotak Form */}
          <div className="w-full max-w-md p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-indigo-900/10 border border-transparent dark:border-slate-700 text-left transform transition-all animate-in zoom-in-95 duration-300">
            <h2 className="mb-6 text-xl font-extrabold text-slate-900 dark:text-white transition-colors duration-500">Edit Data Pasien</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider transition-colors duration-500">NIK (16 Digit)</label>
                <input required type="text" maxLength={16} minLength={16}
                  value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider transition-colors duration-500">Nama Lengkap</label>
                <input required type="text" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider transition-colors duration-500">Tanggal Lahir</label>
                <input required type="date" 
                  value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 outline-none transition-colors cursor-pointer [color-scheme:light] dark:[color-scheme:dark]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider transition-colors duration-500">No. HP</label>
                  <input type="tel" 
                    value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider transition-colors duration-500">Kota/Alamat</label>
                  <input type="text" 
                    value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 outline-none transition-colors" />
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                  Batal
                </button>
                <button type="submit" disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}