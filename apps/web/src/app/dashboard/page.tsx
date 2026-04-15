// apps/web/src/app/dashboard/page.tsx
import PatientTable from '@/components/PatientTable';
import AddPatientModal from '@/components/AddPatientModal';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import LogoutButton from '@/components/LogoutButton';
import NotificationBell from '@/components/NotificationBell';

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
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DASHBOARD - FIXED: Ditambahkan relative z-50 agar notifikasi muncul di depan */}
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
            <div className="absolute -right-6 -bottom-6 text-blue-500/10 group-hover:text-blue-500/20 transition-all duration-500 group-hover:scale-110 pointer-events-none">
              <svg className="w-36 h-36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Total Pasien</p>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.totalPatients}</h3>
                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/20 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                  12%
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Peningkatan dari bulan lalu</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-teal-500/30 group relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-teal-500/10 group-hover:text-teal-500/20 transition-all duration-500 group-hover:scale-110 pointer-events-none">
              <svg className="w-36 h-36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Total Dokter</p>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.totalDoctors}</h3>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm">
                  Tetap
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tenaga medis aktif saat ini</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-rose-500/30 group relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-rose-500/10 group-hover:text-rose-500/20 transition-all duration-500 group-hover:scale-110 pointer-events-none">
              <svg className="w-36 h-36" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Antrean Menunggu</p>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.waitingAppointments}</h3>
                {stats.waitingAppointments > 0 ? (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-300 dark:border-rose-500/20 shadow-sm animate-pulse">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Perlu Tindakan
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/20 shadow-sm">
                    Kondusif
                  </span>
                )}
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