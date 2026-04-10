// apps/web/src/app/doctors/page.tsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const specializationList = [
  { label: "Dokter Umum", prefix: "dr.", suffix: "" },
  { label: "Dokter Gigi", prefix: "drg.", suffix: "" },
  { label: "Penyakit Dalam", prefix: "dr.", suffix: "Sp.PD" },
  { label: "Kandungan & Ginekologi", prefix: "dr.", suffix: "Sp.OG" },
  { label: "Anak", prefix: "dr.", suffix: "Sp.A" },
  { label: "Bedah Umum", prefix: "dr.", suffix: "Sp.B" },
  { label: "Jantung & Pembuluh Darah", prefix: "dr.", suffix: "Sp.JP" },
  { label: "Saraf (Neurologi)", prefix: "dr.", suffix: "Sp.N" },
  { label: "Mata", prefix: "dr.", suffix: "Sp.M" },
  { label: "THT-KL", prefix: "dr.", suffix: "Sp.THT-KL" },
  { label: "Kulit dan Kelamin", prefix: "dr.", suffix: "Sp.KK" },
  { label: "Kesehatan Jiwa (Psikiatri)", prefix: "dr.", suffix: "Sp.KJ" },
  { label: "Paru", prefix: "dr.", suffix: "Sp.P" },
  { label: "Orthopaedi & Traumatologi", prefix: "dr.", suffix: "Sp.OT" }
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE BARU UNTUK FILTER & SORTING ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('Semua');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // --- STATE BARU UNTUK MODAL JADWAL ---
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/doctors');
      const json = await res.json();
      
      // Simulasi penambahan data jadwal (Mockup) ke dalam response API yang ada
      const docsWithSchedule = (json.data || []).map((doc: any) => ({
        ...doc,
        schedule: doc.id % 2 === 0 ? "Senin - Rabu (Pagi)" : "Kamis - Sabtu (Sore)"
      }));
      setDoctors(docsWithSchedule);

    } catch (error) {
      toast.error('Gagal memuat data dokter.');
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleSpecialistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    setSpecialist(selectedLabel);

    const specObj = specializationList.find(s => s.label === selectedLabel);
    
    if (specObj) {
      let cleanName = name
        .replace(/^(dr\.|drg\.)\s*/i, '')
        .replace(/,\s*Sp\.[a-zA-Z\-]+$/i, '')
        .trim();

      if (cleanName === '') {
        setName(`${specObj.prefix} `); 
      } else {
        let formattedName = `${specObj.prefix} ${cleanName}`;
        if (specObj.suffix) {
          formattedName += `, ${specObj.suffix}`;
        }
        setName(formattedName);
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('http://localhost:3001/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, specialist })
      });
      setName(''); setSpecialist('');
      fetchDoctors();
      toast.success('Tenaga medis berhasil ditambahkan!');
    } catch (error) {
      toast.error('Gagal menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, docName: string) => {
    if (window.confirm(`Yakin ingin memberhentikan ${docName} dari sistem?`)) {
      const deletePromise = fetch(`http://localhost:3001/api/doctors/${id}`, { method: 'DELETE' })
        .then(async (res) => {
          if (!res.ok) throw new Error('Tertaut dengan jadwal');
          fetchDoctors();
        });

      toast.promise(deletePromise, {
        loading: 'Menghapus data...',
        success: `${docName} berhasil dihapus!`,
        error: `Gagal. ${docName} masih memiliki antrean aktif.`,
      });
    }
  };

  // --- LOGIKA FILTER & SORTING ---
  const specialties = ['Semua', ...Array.from(new Set(doctors.map(doc => doc.specialist)))];

  const processedDoctors = useMemo(() => {
    let result = [...doctors];

    if (searchTerm) {
      result = result.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterSpecialty !== 'Semua') {
      result = result.filter(doc => doc.specialist === filterSpecialty);
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [doctors, searchTerm, filterSpecialty, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <span className="opacity-0 group-hover:opacity-50 ml-1">↕</span>;
    return <span className="ml-1 text-teal-500">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <main className="p-8 md:p-12 w-full min-h-screen bg-slate-50 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-600 dark:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-200 dark:shadow-teal-900/40 transition-colors duration-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Tenaga Medis</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors duration-500">Kelola daftar dokter dan spesialisasi klinik.</p>
            </div>
          </div>
          
          {/* MENU NAVIGASI KANAN */}
          <div className="flex gap-4 bg-white dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-500">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-md transition-all">Dashboard</Link>
            <Link href="/appointments" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-md transition-all">Jadwal Antrean ➔</Link>
          </div>
        </div>

        {/* FORM INPUT */}
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 transition-colors duration-500"></div>
          
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Spesialisasi</label>
            <div className="relative">
              <select required value={specialist} onChange={handleSpecialistChange} className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-500/20 focus:border-teal-500 block p-3 transition-all cursor-pointer font-medium outline-none [color-scheme:light] dark:[color-scheme:dark]">
                <option value="">-- Pilih Spesialisasi Dokter --</option>
                {specializationList.map((spec) => (
                  <option key={spec.label} value={spec.label}>
                    {spec.label} {spec.suffix && `(${spec.suffix})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider transition-colors duration-500">Nama Dokter (Otomatis)</label>
            <input 
              required 
              placeholder="Ketik nama dokter di sini..." 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-500/20 focus:border-teal-500 block p-3 transition-all font-medium outline-none" 
            />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-teal-600 dark:bg-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-200 dark:hover:shadow-teal-900/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 duration-300">
            {isSubmitting ? (
              <span className="animate-pulse">Menyimpan...</span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Simpan
              </>
            )}
          </button>
        </form>

        {/* TOOLBAR BARU: SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-500">
          <input 
            type="text" 
            placeholder="Cari nama dokter..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm"
          />
          
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 transition-colors duration-500">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 whitespace-nowrap">Filter:</span>
            <select 
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="py-3 bg-transparent text-slate-900 dark:text-white font-bold outline-none cursor-pointer text-sm w-full"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec} className="bg-white dark:bg-slate-900">{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABEL DOKTER */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 transition-colors duration-500">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm transition-colors duration-500">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500 cursor-pointer group hover:text-teal-500" onClick={() => handleSort('name')}>
                    Profil Dokter <SortIcon columnKey="name" />
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500 cursor-pointer group hover:text-teal-500" onClick={() => handleSort('specialist')}>
                    Spesialisasi <SortIcon columnKey="specialist" />
                  </th>
                  {/* KOLOM BARU DITAMBAHKAN */}
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">
                    Jadwal Praktek
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-500">Tindakan</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700 transition-colors duration-500">
                {processedDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-500">Tidak ada data dokter yang sesuai.</td>
                  </tr>
                ) : processedDoctors.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors duration-300 group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-sm transition-colors duration-500">
                          {d.name.replace(/^(dr\.|drg\.)\s*/i, '').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-500">{d.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors duration-500">ID: DOC-{d.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 transition-colors duration-500">
                        {d.specialist}
                      </span>
                    </td>
                    
                    {/* DATA KOLOM JADWAL BARU DITAMBAHKAN */}
                    <td className="px-8 py-5 whitespace-nowrap transition-colors duration-500">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors duration-500">
                          {d.schedule || <span className="text-slate-400 italic">Belum diatur</span>}
                        </span>
                        <button 
                          onClick={() => { setSelectedDoctor(d); setIsScheduleModalOpen(true); }}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-500/20 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Atur Jadwal"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </button>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleDelete(d.id, d.name)} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL ATUR JADWAL (BARU DITAMBAHKAN) */}
        {isScheduleModalOpen && selectedDoctor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-[2rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Atur Jadwal Praktek</h3>
              <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-6">{selectedDoctor.name}</p>
              
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hari Praktek</label>
                  <input type="text" placeholder="Misal: Senin - Rabu" defaultValue={selectedDoctor.schedule?.split(' (')[0]} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-medium transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jam Mulai</label>
                    <input type="time" defaultValue="08:00" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-medium transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jam Selesai</label>
                    <input type="time" defaultValue="14:00" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 font-medium transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsScheduleModalOpen(false)} className="flex-1 px-6 py-4 text-sm font-bold text-slate-600 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all">Batal</button>
                <button onClick={() => { toast.success('Jadwal disimpan!'); setIsScheduleModalOpen(false); }} className="flex-1 px-6 py-4 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-2xl transition-all shadow-lg shadow-teal-900/20">Simpan</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}