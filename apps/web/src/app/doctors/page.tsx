// apps/web/src/app/doctors/page.tsx
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialist })
    });
    setName(''); setSpecialist('');
    fetchDoctors();
  };

  // TAMBAHAN BARU: Fungsi Hapus Dokter
  const handleDelete = async (id: number, docName: string) => {
    if (window.confirm(`Yakin ingin menghapus ${docName}?`)) {
      await fetch(`http://localhost:3001/api/doctors/${id}`, {
        method: 'DELETE'
      });
      fetchDoctors(); // Refresh tabel setelah dihapus
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Dokter</h1>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 hover:underline">Data Pasien</a>
          <a href="/appointments" className="text-indigo-600 hover:underline font-bold">Jadwal Antrean ➔</a>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4 border border-gray-200">
        <input required placeholder="Nama Dokter (Cth: Dr. Tirta)" value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 p-2 rounded flex-1 text-black focus:ring-blue-500 focus:border-blue-500" />
        <input required placeholder="Spesialisasi (Cth: Umum)" value={specialist} onChange={e => setSpecialist(e.target.value)} className="border border-gray-300 p-2 rounded flex-1 text-black focus:ring-blue-500 focus:border-blue-500" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors">+ Tambah Dokter</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokter</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Spesialisasi</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.specialist}</td>
                {/* TAMBAHAN BARU: Tombol Hapus */}
                <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                  <button 
                    onClick={() => handleDelete(d.id, d.name)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}