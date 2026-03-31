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
    // Ambil semua data sekaligus
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

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: parseInt(patientId), doctorId: parseInt(doctorId), date })
    });
    fetchData(); // Refresh data
  };

  return (
    <main className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Jadwal Berobat</h1>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 hover:underline">Pasien</a>
          <a href="/doctors" className="text-blue-600 hover:underline">Dokter</a>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Pilih Pasien</label>
          <select required value={patientId} onChange={e => setPatientId(e.target.value)} className="border p-2 rounded w-full text-black">
            <option value="">-- Pilih --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Pilih Dokter</label>
          <select required value={doctorId} onChange={e => setDoctorId(e.target.value)} className="border p-2 rounded w-full text-black">
            <option value="">-- Pilih --</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialist})</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
          <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded w-full text-black" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 h-[42px]">Buat Jadwal</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="text-left p-4 text-gray-600">Tanggal</th><th className="text-left p-4 text-gray-600">Pasien</th><th className="text-left p-4 text-gray-600">Dokter</th><th className="text-left p-4 text-gray-600">Status</th></tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} className="border-b">
                <td className="p-4 text-black">{new Date(a.date).toLocaleDateString('id-ID')}</td>
                <td className="p-4 font-medium text-blue-600">{a.patientName}</td>
                <td className="p-4 text-gray-700">{a.doctorName}</td>
                <td className="p-4"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}