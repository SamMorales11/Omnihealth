"use client";
import { useState, useEffect } from 'react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [specialist, setSpecialist] = useState('');

  const fetchDoctors = async () => {
    const res = await fetch('http://localhost:3001/api/doctors');
    const json = await res.json();
    setDoctors(json.data);
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialist })
    });
    setName(''); setSpecialist('');
    fetchDoctors();
  };

  return (
    <main className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Dokter</h1>
        <a href="/" className="text-blue-600 hover:underline">← Kembali ke Pasien</a>
      </div>

      {/* Form Singkat */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
        <input required placeholder="Nama Dokter" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded flex-1 text-black" />
        <input required placeholder="Spesialisasi" value={specialist} onChange={e => setSpecialist(e.target.value)} className="border p-2 rounded flex-1 text-black" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">+ Tambah</button>
      </form>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="text-left p-4 text-gray-600">Nama</th><th className="text-left p-4 text-gray-600">Spesialisasi</th></tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id} className="border-b"><td className="p-4 text-black">{d.name}</td><td className="p-4 text-gray-600">{d.specialist}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}