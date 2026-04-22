// apps/web/src/app/appointments/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Cookies from 'js-cookie'; // REVISI: Impor Cookies untuk mengambil token

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE UNTUK CUSTOM DROPDOWNS ---
  const [isPatientOpen, setIsPatientOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const patientRef = useRef<HTMLDivElement>(null);
  const doctorRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (patientRef.current && !patientRef.current.contains(event.target as Node)) {
        setIsPatientOpen(false);
      }
      if (doctorRef.current && !doctorRef.current.contains(event.target as Node)) {
        setIsDoctorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      // REVISI: Ambil token dan sertakan di header Authorization
      const token = Cookies.get('auth-token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [apptRes, patRes, docRes] = await Promise.all([
        fetch('http://127.0.0.1:3001/api/appointments', { headers }),
        fetch('http://127.0.0.1:3001/api/patients', { headers }),
        fetch('http://127.0.0.1:3001/api/doctors', { headers })
      ]);
      
      setAppointments((await apptRes.json()).data || []);
      setPatients((await patRes.json()).data || []);
      setDoctors((await docRes.json()).data || []);
    } catch (error) {
      toast.error('Gagal memuat data dari server.');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) return toast.error('Pilih pasien dan dokter terlebih dahulu');
    setIsSubmitting(true);
    
    try {
      // REVISI: Ambil token dan sertakan di header Authorization
      const token = Cookies.get('auth-token');
      await fetch('http://127.0.0.1:3001/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientId: parseInt(patientId), doctorId: parseInt(doctorId), date })
      });
      setPatientId(''); setDoctorId(''); setDate('');
      fetchData(); 
      toast.success('Jadwal Antrean berhasil dibuat!');
    } catch (error) {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (window.confirm(`Ubah status antrean menjadi ${newStatus}?`)) {
      // REVISI: Ambil token dan sertakan di header Authorization
      const token = Cookies.get('auth-token');
      const updatePromise = fetch(`http://127.0.0.1:3001/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      }).then((res) => {
        if (!res.ok) throw new Error();
        fetchData();
      });

      toast.promise(updatePromise, {
        loading: 'Memperbarui status...',
        success: `Status berhasil diubah menjadi ${newStatus}!`,
        error: 'Gagal memperbarui status.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai': 
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'Dibatalkan': 
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      default: 
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-colors duration-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Manajemen Antrean</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors duration-500">Atur jadwal pemeriksaan pasien dan dokter dengan mudah.</p>
            </div>
          </div>
          
          <div className="flex gap-4 bg-white dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-500">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-md transition-all">Dashboard</Link>
            <Link href="/doctors" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-md transition-all">Data Dokter</Link>
          </div>
        </div>

        {/* FORM AREA */}
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end relative z-20 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 dark:bg-indigo-500 rounded-l-2xl transition-colors duration-500"></div>
          
          <div className="flex-1 w-full" ref={patientRef}>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Pilih Pasien</label>
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsPatientOpen(!isPatientOpen)}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 transition-all font-medium outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <span className={patientId ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}>
                  {patients.find(p => p.id.toString() === patientId)?.name || '-- Pilih Pasien --'}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isPatientOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {isPatientOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[120] overflow-hidden animate-in zoom-in-95 duration-200 origin-top">
                  <div className="max-h-60 overflow-y-auto py-2">
                    {patients.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setPatientId(p.id.toString()); setIsPatientOpen(false); }}
                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center justify-between
                          ${patientId === p.id.toString() 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <span>{p.name}</span>
                        {patientId === p.id.toString() && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.6)]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full" ref={doctorRef}>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Dokter Pemeriksa</label>
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsDoctorOpen(!isDoctorOpen)}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3 transition-all font-medium outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <span className={doctorId ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}>
                  {doctors.find(d => d.id.toString() === doctorId) ? `${doctors.find(d => d.id.toString() === doctorId).name} (${doctors.find(d => d.id.toString() === doctorId).specialist})` : '-- Pilih Dokter --'}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDoctorOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {isDoctorOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[120] overflow-hidden animate-in zoom-in-95 duration-200 origin-top">
                  <div className="max-h-60 overflow-y-auto py-2">
                    {doctors.map(d => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => { setDoctorId(d.id.toString()); setIsDoctorOpen(false); }}
                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center justify-between
                          ${doctorId === d.id.toString() 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <span>{d.name} ({d.specialist})</span>
                        {doctorId === d.id.toString() && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.6)]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Tanggal</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-all cursor-pointer outline-none [color-scheme:light] dark:[color-scheme:dark]" />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 duration-300">
            {isSubmitting ? <span className="animate-pulse">Memproses...</span> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>Buat Jadwal</>}
          </button>
        </form>

        {/* TABEL AREA */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 overflow-hidden relative z-10 transition-colors duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 transition-colors duration-500">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm transition-colors duration-500">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">Tanggal</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">Pasien</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">Dokter Pemeriksa</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">Status</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700 transition-colors duration-500">
                {appointments.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-500">Belum ada jadwal antrean terdaftar.</td></tr>
                ) : appointments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors duration-300 group">
                    <td className="px-8 py-5 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors duration-500">{formatDate(a.date)}</td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs transition-colors duration-500">{a.patientName.charAt(0).toUpperCase()}</div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-500">{a.patientName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-md transition-colors duration-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-500">{a.doctorName}</p>
                          {a.specialist && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 transition-colors duration-500">{a.specialist}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-colors duration-500 ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      {a.status === 'Menunggu' ? (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link href={`/rme`} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-lg text-xs font-bold transition-colors">Isi RME</Link>
                          <button onClick={() => handleUpdateStatus(a.id, 'Selesai')} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-colors">Selesai</button>
                          <button onClick={() => handleUpdateStatus(a.id, 'Dibatalkan')} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/30 rounded-lg text-xs font-bold transition-colors">Batal</button>
                        </div>
                      ) : <span className="text-slate-400 dark:text-slate-500 italic text-xs font-medium transition-colors duration-500">Terkunci</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}