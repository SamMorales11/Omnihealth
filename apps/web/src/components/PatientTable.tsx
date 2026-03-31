// apps/web/src/components/PatientTable.tsx
"use client"; 

import { Patient } from '@/types';
import { PatientService } from '@/services/patient.service';
import { useRouter } from 'next/navigation';
import EditPatientModal from './EditPatientModal'; // <-- 1. Import komponen Edit di sini

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter();

  // Fungsi Eksekusi Hapus
  const handleDelete = async (id: number, name: string) => {
    const isConfirm = window.confirm(`Apakah Anda yakin ingin menghapus data pasien: ${name}?`);
    
    if (isConfirm) {
      const success = await PatientService.deletePatient(id);
      if (success) {
        router.refresh(); // Memperbarui tabel secara otomatis
      } else {
        alert("Gagal menghapus data. Pastikan endpoint Backend sudah dibuat.");
      }
    }
  };

  if (!patients || patients.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
        Belum ada data pasien yang terdaftar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">NIK</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nama Pasien</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tanggal Lahir</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">No. Telepon</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Alamat</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="transition-colors hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{patient.nik}</td>
              <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{patient.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(patient.dob).toLocaleDateString('id-ID')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{patient.phone || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{patient.address || '-'}</td>
              
              {/* Kolom Tombol Aksi */}
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                
                {/* 2. Tombol alert diganti dengan memanggil Modal Edit */}
                <EditPatientModal patient={patient} />

                <button 
                  onClick={() => handleDelete(patient.id, patient.name)}
                  className="text-red-600 transition-colors hover:text-red-900"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}