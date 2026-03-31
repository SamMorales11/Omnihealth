// apps/web/src/components/PatientTable.tsx
import { Patient } from '../types';

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
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
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">NIK</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nama Pasien</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tanggal Lahir</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">No. Telepon</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Alamat</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}