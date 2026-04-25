// apps/web/src/components/DashboardCharts.tsx
"use client";
import { useMemo, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#4F46E5', '#0D9488', '#F59E0B', '#E11D48', '#8B5CF6', '#0284C7'];

export default function DashboardCharts({ appointments = [] }: { appointments?: any[] }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';

  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#64748b' : '#94a3b8';

  // REVISI: Logika tren kunjungan yang lebih cerdas (Grouping per Tanggal)
  const trendData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    const today = new Date();
    
    // Inisialisasi 7 hari terakhir agar grafik tidak kosong jika data sedikit
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dailyMap[d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })] = 0;
    }

    appointments.forEach(app => {
      const dateKey = new Date(app.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (dailyMap[dateKey] !== undefined) {
        dailyMap[dateKey]++;
      }
    });

    return Object.keys(dailyMap).map(date => ({ date, Pasien: dailyMap[date] }));
  }, [appointments]);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach(app => {
      const spec = app.specialist || 'Umum';
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [appointments]);

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
      
      {/* AREA CHART: Tren Kunjungan Pasien */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm text-left">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 text-left">Tren Kunjungan (7 Hari)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorPasien" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="Pasien" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorPasien)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART: Distribusi Spesialisasi */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm text-left">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 text-left">Beban Kerja Spesialisasi</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" animationDuration={2000}>
                {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}