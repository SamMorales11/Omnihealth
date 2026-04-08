// apps/web/src/components/DashboardCharts.tsx
"use client";
import { useMemo, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#4F46E5', '#0D9488', '#F59E0B', '#E11D48', '#8B5CF6', '#0284C7'];

export default function DashboardCharts({ appointments = [] }: { appointments?: any[] }) {
  // Setup pendeteksi Dark Mode untuk mewarnai SVG Chart
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';

  // Variabel Warna Dinamis (Terang vs Gelap)
  const gridColor = isDark ? '#334155' : '#F1F5F9'; // Garis panduan
  const axisColor = isDark ? '#94A3B8' : '#64748B'; // Teks tanggal/angka
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF'; // Latar tooltip
  const tooltipText = isDark ? '#F8FAFC' : '#1E293B'; // Teks tooltip

  const lineData = useMemo(() => {
    const counts: Record<string, number> = {};
    const safeAppointments = appointments || [];
    
    const sorted = [...safeAppointments]
      .filter(a => a && a.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(app => {
      const dateStr = new Date(app.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    return Object.keys(counts).map(date => ({ date, Pasien: counts[date] }));
  }, [appointments]);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    const safeAppointments = appointments || [];
    
    safeAppointments.forEach(app => {
      const spec = app.specialist || 'Umum';
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [appointments]);

  if (!appointments || appointments.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      
      {/* KARTU CHART 1 (LINE CHART) */}
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 transition-colors duration-500">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 transition-colors duration-500">Tren Kunjungan Pasien</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: axisColor }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderRadius: '16px', border: 'none', color: tooltipText, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                itemStyle={{ color: tooltipText }}
              />
              <Line type="monotone" dataKey="Pasien" stroke="#4F46E5" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#1E293B' : '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KARTU CHART 2 (PIE CHART) */}
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 transition-colors duration-500">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 transition-colors duration-500">Distribusi Spesialisasi</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none" animationDuration={1500}>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderRadius: '16px', border: 'none', color: tooltipText, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                itemStyle={{ fontWeight: 'bold' }} 
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: '500', color: axisColor, paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}