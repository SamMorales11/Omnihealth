// apps/web/src/app/appointments/page.tsx
"use client";
import { useState, useEffect } from 'react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');

  const fetchData = async () => {
    const [apptRes, patRes, docRes] = await Promise.all([
      fetch('http://localhost:3001/api/appointments'),
      fetch('http://localhost:3001/api/patients'),
      fetch('http://localhost:3001/api/doctors')
    ]);
    
    setAppointments((await apptRes.json()).data);
    setPatients((await patRes.json()).data);
    setDoctors((await docRes.json()).data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: parseInt(patientId), doctorId: parseInt(doctorId), date })
    });
    setPatientId(''); setDoctorId(''); setDate('');
    fetchData(); 
  };

  // TAMBAHAN BARU: Fungsi Ubah Status Antrean
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (window.confirm(`Ubah status antrean menjadi ${newStatus}?`)) {
      await fetch(`http://localhost:3001/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData(); // Refresh tabel agar status langsung berubah
    }
  };

  // Helper untuk warna status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-800';
      case 'Dibatalkan': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800'; // Menunggu
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Jadwal Antrean Berobat</h1>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 hover:underline">← Data Pasien</a>
          <a href="/doctors" className="text-blue-600 hover:underline">Data Dokter</a>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow-sm mb-6 flex gap-4 items-end border border-gray-200">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Pilih Pasien</label>
          <select required value={patientId} onChange={e => setPatientId(e.target.value)} className="border border-gray-300 p-2.5 rounded-md w-full text-black focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">-- Pilih Pasien --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Pilih Dokter</label>
          <select required value={doctorId} onChange={e => setDoctorId(e.target.value)} className="border border-gray-300 p-2.5 rounded-md w-full text-black focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">-- Pilih Dokter --</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialist})</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Tanggal Berobat</label>
          <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 p-2.5 rounded-md w-full text-black focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition-colors h-[46px]">Buat Jadwal</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Dokter Pemeriksa</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(a.date).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-sm font-medium text-indigo-600 whitespace-nowrap">{a.patientName}</td>
                {/* Perbaikan Tanda Kurung Kosong */}
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{a.doctorName} {a.specialist && <span className="text-gray-400 text-xs">({a.specialist})</span>}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                {/* TAMBAHAN BARU: Tombol Selesai & Batal */}
                <td className="px-6 py-4 text-sm text-right whitespace-nowrap space-x-3">
                  {a.status === 'Menunggu' && (
                    <>
                      <button onClick={() => handleUpdateStatus(a.id, 'Selesai')} className="text-green-600 hover:text-green-900 font-medium">Selesaikan</button>
                      <button onClick={() => handleUpdateStatus(a.id, 'Dibatalkan')} className="text-red-600 hover:text-red-900 font-medium">Batalkan</button>
                    </>
                  )}
                  {a.status !== 'Menunggu' && (
                    <span className="text-gray-400 italic">Dikunci</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}