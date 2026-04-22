// apps/web/src/app/dashboard/page.tsx
import PatientTable from '@/components/PatientTable';
import AddPatientModal from '@/components/AddPatientModal';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import LogoutButton from '@/components/LogoutButton';
import NotificationBell from '@/components/NotificationBell';
import { cookies } from 'next/headers'; 

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  try {
    // PERBAIKAN: Tambahkan 'await' sebelum cookies() karena sekarang bersifat async
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const [patRes, docRes, apptRes] = await Promise.all([
      fetch('http://127.0.0.1:3001/api/patients', { headers, cache: 'no-store' }),
      fetch('http://127.0.0.1:3001/api/doctors', { headers, cache: 'no-store' }),
      fetch('http://127.0.0.1:3001/api/appointments', { headers, cache: 'no-store' })
    ]);

    if (patRes.status === 401 || docRes.status === 401 || apptRes.status === 401) {
      console.error("Akses ditolak: Token tidak valid atau kadaluarsa.");
      return { patients: [], appointments: [], stats: { totalPatients: 0, totalDoctors: 0, waitingAppointments: 0 } };
    }

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
    console.error("Gagal mengambil data dashboard:", error);
    return { patients: [], appointments: [], stats: { totalPatients: 0, totalDoctors: 0, waitingAppointments: 0 } };
  }
}

export default async function DashboardPage() {
  const { patients, appointments, stats } = await getDashboardData();

  return (
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col gap-8 relative z-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-2xl shadow-lg transition-colors duration-500">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Dashboard Central</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manajemen data klinik terpadu OmniHealth.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <LogoutButton />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
            <Link href="/patients/history" className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">Riwayat</Link>
            <Link href="/pharmacy" className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">Apotek</Link>
            <Link href="/billing" className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">Kasir</Link>
            <Link href="/doctors" className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">Dokter</Link>
            <Link href="/appointments" className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 dark:bg-indigo-500 rounded-xl hover:bg-indigo-700 transition-all shadow-md">Antrean ➔</Link>
          </div>
        </div>

        <div className="h-10 md:h-14 w-full"></div>

        {/* KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-blue-500/30 group relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Total Pasien</p>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.totalPatients}</h3>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Peningkatan dari bulan lalu</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-teal-500/30 group relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Total Dokter</p>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.totalDoctors}</h3>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tenaga medis aktif saat ini</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-rose-500/30 group relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Antrean Menunggu</p>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.waitingAppointments}</h3>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pasien menunggu panggilan</p>
            </div>
          </div>
        </div>

        <div className="w-full min-h-[400px] mb-10">
          <DashboardCharts appointments={appointments} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors duration-500 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Direktori Pasien</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola informasi personal pasien terdaftar.</p>
            </div>
            <AddPatientModal />
          </div>
          <PatientTable patients={patients} />
        </div>

      </div>
    </main>
  );
}