// apps/web/src/app/page.tsx
import { PatientService } from '@/services/patient.service';
import PatientTable from '@/components/PatientTable';
import AddPatientModal from '@/components/AddPatientModal';// <-- 1. Import komponen interaktifnya

export default async function DashboardPage() {
  // 1. Ambil data dari Backend Hono.js
  const patients = await PatientService.getAllPatients();

  // 2. Tampilkan UI
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard OmniHealth</h1>
            <p className="mt-1 text-sm text-gray-500">Manajemen Data Pasien Terpusat</p>
          </div>
          
          {/* 2. Tombol statis dihapus dan diganti dengan pemanggil Modal ini */}
          <AddPatientModal /> 
          
        </div>

        {/* Table Section */}
        <PatientTable patients={patients} />
        
      </div>
    </main>
  );
}