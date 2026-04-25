// apps/web/src/app/dashboard/page.tsx
"use client";
import { useState, useEffect } from 'react';
import PatientTable from '@/components/PatientTable';
import AddPatientModal from '@/components/AddPatientModal';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import LogoutButton from '@/components/LogoutButton';
import NotificationBell from '@/components/NotificationBell';
import Cookies from 'js-cookie'; // REVISI: Menggunakan Client-side Cookies

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    patients: [],
    appointments: [],
    stats: { totalPatients: 0, totalDoctors: 0, waitingAppointments: 0, completionRate: 0 }
  });
  const [loading, setLoading] = useState(true);

  // REVISI: Fungsi ambil data real-time
  const refreshData = async () => {
    try {
      const token = Cookies.get('auth-token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [patRes, apptRes, anaRes] = await Promise.all([
        fetch('http://127.0.0.1:3001/api/patients', { headers }),
        fetch('http://127.0.0.1:3001/api/appointments', { headers }),
        fetch('http://127.0.0.1:3001/api/analytics', { headers })
      ]);

      const [patients, appointments, analytics] = await Promise.all([
        patRes.json(), apptRes.json(), anaRes.json()
      ]);

      setData({
        patients: patients.data || [],
        appointments: appointments.data || [],
        stats: analytics.stats,
        doctorPerformance: analytics.doctorPerformance
      });
    } catch (error) {
      console.error("Gagal sinkronisasi data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // REVISI: Implementasi Polling Real-Time setiap 10 detik
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-slate-500">Sinkronisasi Sistem...</div>;

  return (
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-left">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col gap-8 relative z-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-2xl shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">Dashboard Central</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-left">Data diperbarui secara otomatis.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="h-14"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10 text-left">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/30">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 text-left">Total Pasien</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white text-left">{data.stats.totalPatients}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 text-left">Terdaftar di sistem</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-teal-500/30">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 text-left">Efisiensi Klinik</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white text-left">{data.stats.completionRate}%</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 text-left">Penyelesaian antrean hari ini</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-rose-500/30">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 text-left">Antrean Aktif</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white text-left">{data.stats.waitingAppointments}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 text-left">Pasien dalam ruang tunggu</p>
          </div>
        </div>

        <div className="w-full mb-10">
          <DashboardCharts appointments={data.appointments} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 text-left">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-left">Direktori Pasien</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-left">Kelola informasi personal pasien.</p>
            </div>
            <AddPatientModal />
          </div>
          <PatientTable patients={data.patients} />
        </div>

      </div>
    </main>
  );
}