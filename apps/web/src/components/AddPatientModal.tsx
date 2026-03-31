// apps/web/src/components/AddPatientModal.tsx
"use client"; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PatientService, CreatePatientInput } from '../services/patient.service';

export default function AddPatientModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreatePatientInput>({
    nik: '', name: '', dob: '', phone: '', address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await PatientService.createPatient(formData);
    
    if (success) {
      setIsOpen(false); 
      setFormData({ nik: '', name: '', dob: '', phone: '', address: '' }); 
      router.refresh(); // Menyuruh Next.js me-refresh tabel secara otomatis
    } else {
      alert('Gagal menambahkan pasien. Periksa kembali data atau koneksi Anda.');
    }
    
    setIsLoading(false);
  };

  return (
    <>
      {/* Tombol Pemicu */}
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
      >
        + Tambah Pasien
      </button>

      {/* Latar Belakang Modal (Gelap) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          
          {/* Kotak Form */}
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Tambah Pasien Baru</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIK (16 Digit)</label>
                <input required type="text" maxLength={16} minLength={16}
                  value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black" 
                  placeholder="Contoh: 3201012345678901" />
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}