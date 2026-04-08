// apps/web/src/components/PatientTable.tsx
"use client"; 

import { Patient } from '@/types';
import { PatientService } from '@/services/patient.service';
import { useRouter } from 'next/navigation';
import EditPatientModal from './EditPatientModal';

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter();

  const handleDelete = async (id: number, name: string) => {
    const isConfirm = window.confirm(`Apakah Anda yakin ingin menghapus data pasien: ${name}?`);
    
    if (isConfirm) {
      const success = await PatientService.deletePatient(id);
      if (success) {
        router.refresh(); 
      } else {
        alert("Gagal menghapus data. Pastikan endpoint Backend sudah dibuat.");
      }
    }
  };

  if (!patients || patients.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors duration-500">
        Belum ada data pasien yang terdaftar.
      </div>
    );
  }

  return (
    // Wadah Tabel
    <div className="overflow-x-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors duration-500">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 transition-colors duration-500">
        <thead className="bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
          <tr>
            <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-slate-500 dark:text-slate-400 uppercase transition-colors duration-500">NIK</th>
            <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-slate-500 dark:text-slate-400 uppercase transition-colors duration-500">Nama Pasien</th>
            <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-slate-500 dark:text-slate-400 uppercase transition-colors duration-500">Tanggal Lahir</th>
            <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-slate-500 dark:text-slate-400 uppercase transition-colors duration-500">No. Telepon</th>
            <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-slate-500 dark:text-slate-400 uppercase transition-colors duration-500">Alamat</th>
            <th className="px-6 py-3 text-xs font-bold tracking-wider text-right text-slate-500 dark:text-slate-400 uppercase transition-colors duration-500">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700 transition-colors duration-500">
          {patients.map((patient) => (
            <tr key={patient.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 duration-300">
              <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200 whitespace-nowrap transition-colors duration-500">{patient.nik}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors duration-500">{patient.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap transition-colors duration-500">
                {new Date(patient.dob).toLocaleDateString('id-ID')}
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap transition-colors duration-500">{patient.phone || '-'}</td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">{patient.address || '-'}</td>
              
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap flex justify-end gap-3 items-center">
                
                <EditPatientModal patient={patient} />

                <button 
                  onClick={() => handleDelete(patient.id, patient.name)}
                  className="text-rose-600 dark:text-rose-400 transition-colors hover:text-rose-800 dark:hover:text-rose-300"
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