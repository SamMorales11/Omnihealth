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
      alert('Gagal mengubah data pasien.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mr-4 text-indigo-400 transition-colors hover:text-indigo-300 font-bold text-sm"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="mb-6 text-xl font-black text-white">Edit Data Pasien</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NIK (16 Digit)</label>
                <input required type="text" maxLength={16} minLength={16}
                  value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                <input required type="text" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Lahir</label>
                <input required type="date" 
                  value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all [color-scheme:dark]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">No. HP</label>
                  <input type="tel" 
                    value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alamat</label>
                  <input type="text" 
                    value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
                  Batal
                </button>
                <button type="submit" disabled={isLoading}
                  className="flex-1 px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 disabled:opacity-50 transition-all">
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}