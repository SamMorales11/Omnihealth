// apps/web/src/components/DashboardCharts.tsx
"use client";
import { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// Palet Warna Premium untuk Grafik
const COLORS = ['#4F46E5', '#0D9488', '#F59E0B', '#E11D48', '#8B5CF6', '#0284C7'];

export default function DashboardCharts({ appointments }: { appointments: any[] }) {
  
  // 1. OLAH DATA: Grafik Garis (Tren Kunjungan Harian)
  const lineData = useMemo(() => {
    const counts: Record<string, number> = {};
    // Urutkan berdasarkan tanggal terlama ke terbaru
    const sorted = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(app => {
      const dateStr = new Date(app.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    return Object.keys(counts).map(date => ({ date, Pasien: counts[date] }));
  }, [appointments]);

  // 2. OLAH DATA: Grafik Lingkaran (Distribusi Spesialisasi)
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach(app => {
      // Jika data spesialis kosong, anggap sebagai Umum
      const spec = app.specialist || 'Umum';
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [appointments]);

  // Sembunyikan area grafik jika belum ada data sama sekali
  if (!appointments || appointments.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      
      {/* CHART 1: Tren Kunjungan (Line Chart) */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-extrabold text-slate-800 mb-6">Tren Kunjungan Pasien</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="Pasien" 
                stroke="#4F46E5" 
                strokeWidth={4} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }} 
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: Distribusi Poli (Pie Chart) */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-extrabold text-slate-800 mb-6">Distribusi Spesialisasi</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold', color: '#1E293B' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: '500', paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}