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

  // Otomatis isi form dengan data pasien yang sudah ada
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

    // Panggil fungsi update di service
    const success = await PatientService.updatePatient(patient.id, formData);
    
    if (success) {
      setIsOpen(false);
      router.refresh(); // Refresh tabel otomatis
    } else {
      alert('Gagal mengubah data pasien. Periksa koneksi Anda.');
    }
    
    setIsLoading(false);
  };

  return (
    <>
      {/* Tombol Teks "Edit" yang ada di dalam tabel */}
      <button 
        onClick={() => setIsOpen(true)}
        className="mr-4 text-indigo-600 transition-colors hover:text-indigo-900 font-medium"
      >
        Edit
      </button>

      {/* Latar Belakang Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          
          {/* Kotak Form */}
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl text-left">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Edit Data Pasien</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIK (16 Digit)</label>
                <input required type="text" maxLength={16} minLength={16}
                  value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input required type="text" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input required type="date" 
                  value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. HP</label>
                  <input type="tel" 
                    value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kota/Alamat</label>
                  <input type="text" 
                    value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black" />
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Batal
                </button>
                <button type="submit" disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
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