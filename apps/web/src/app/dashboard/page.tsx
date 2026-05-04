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
import { Users, Activity, Clock, ArrowUpRight, ArrowDownRight, LayoutGrid } from 'lucide-react';



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
                <LayoutGrid className="w-7 h-7" />
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
          {/* CARD 1: TOTAL PASIEN */}
          <div className="animate-in fade-in zoom-in-95 duration-500 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border-l-[4px] border-l-indigo-500 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-6 right-6 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Users size={24} />
            </div>
            
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Total Pasien</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black text-white tracking-tight">{data.stats.totalPatients}</h3>
              <span className="text-xs font-bold text-slate-500">Jiwa</span>
            </div>
            
            <p className="text-sm font-medium text-slate-400 mt-2 mb-6">12 Pasien baru minggu ini</p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                <ArrowUpRight size={12} />
                +12%
              </div>
              <span className="text-[10px] font-medium text-slate-500 italic">from last month</span>
            </div>
          </div>

          {/* CARD 2: EFISIENSI KLINIK */}
          <div className="animate-in fade-in zoom-in-95 duration-700 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border-l-[4px] border-l-emerald-500 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-6 right-6 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Activity size={24} />
            </div>
            
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Efisiensi Klinik</p>
            <h3 className="text-5xl font-black text-white mb-4 tracking-tight">{data.stats.completionRate}%</h3>
            
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.stats.completionRate}%` }}
              ></div>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                <ArrowUpRight size={12} />
                +2%
              </div>
              <span className="text-[10px] font-medium text-slate-500 italic">higher than yesterday</span>
            </div>
          </div>

          {/* CARD 3: ANTREAN AKTIF */}
          <div className="animate-in fade-in zoom-in-95 duration-1000 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border-l-[4px] border-l-amber-500 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-6 right-6 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-amber-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Clock size={24} />
            </div>
            
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Antrean Aktif</p>
            <h3 className="text-5xl font-black text-white tracking-tight">{data.stats.waitingAppointments}</h3>
            <p className="text-xs font-bold text-amber-500 mt-2 mb-6">Estimasi waktu tunggu: 15 menit</p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                <ArrowDownRight size={12} />
                -3%
              </div>
              <span className="text-[10px] font-medium text-slate-500 italic">from peak hours</span>
            </div>
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