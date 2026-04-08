// apps/web/src/app/dashboard/page.tsx
import PatientTable from '@/components/PatientTable';
import AddPatientModal from '@/components/AddPatientModal';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    const [patRes, docRes, apptRes] = await Promise.all([
      fetch('http://localhost:3001/api/patients', { cache: 'no-store' }),
      fetch('http://localhost:3001/api/doctors', { cache: 'no-store' }),
      fetch('http://localhost:3001/api/appointments', { cache: 'no-store' })
    ]);

    const patJson = await patRes.json();
    const docJson = await docRes.json();
    const apptJson = await apptRes.json();

    const waiting = apptJson.data?.filter((a: any) => a.status === 'Menunggu').length || 0;

    return {
      patients: patJson.data || [],
      appointments: apptJson.data || [],
      stats: {
        totalPatients: patJson.data?.length || 0,
        totalDoctors: docJson.data?.length || 0,
        waitingAppointments: waiting
      }
    };
  } catch (error) {
    return { patients: [], appointments: [], stats: { totalPatients: 0, totalDoctors: 0, waitingAppointments: 0 } };
  }
}

export default async function DashboardPage() {
  const { patients, appointments, stats } = await getDashboardData();

  return (
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-600 dark:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-indigo-900/40 transition-colors duration-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Dashboard Central</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors duration-500">Ringkasan sistem & manajemen data klinik terpadu.</p>
            </div>
          </div>
          
          {/* MENU NAVIGASI KANAN (Sudah ditambahkan Apotek & Riwayat) */}
          <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm items-center transition-colors duration-500">
            <Link href="/patients/history" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-lg transition-all">Riwayat Pasien</Link>
            <Link href="/pharmacy" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg transition-all">Apotek</Link>
            <Link href="/doctors" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700 rounded-lg transition-all">Data Dokter</Link>
            <Link href="/appointments" className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg transition-all">Jadwal Antrean ➔</Link>
            <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 transition-colors duration-500"></div> 
            <LogoutButton />
          </div>
        </div>

        {/* KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 relative overflow-hidden transition-colors duration-500">
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors duration-500">Total Pasien</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white transition-colors duration-500">{stats.totalPatients}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 relative overflow-hidden transition-colors duration-500">
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors duration-500">Total Dokter</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white transition-colors duration-500">{stats.totalDoctors}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 relative overflow-hidden transition-colors duration-500">
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors duration-500">Antrean Menunggu</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white transition-colors duration-500">{stats.waitingAppointments}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* GRAFIK */}
        <DashboardCharts appointments={appointments} />

        {/* TABEL DIREKTORI */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 p-8 transition-colors duration-500 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 transition-colors duration-500">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-500">Direktori Pasien Terdaftar</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-500">Kelola data rekam medis dan informasi personal pasien.</p>
            </div>
            <AddPatientModal />
          </div>
          <PatientTable patients={patients} />
        </div>

      </div>
    </main>
  );
}