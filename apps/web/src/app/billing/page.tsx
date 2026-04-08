// apps/web/src/app/billing/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Data Simulasi Tagihan
const initialInvoices = [
  {
    id: "INV-2604-001",
    patientName: "Ahmad Budi Santoso",
    date: "08 Apr 2026, 11:30 WIB",
    status: "Belum Dibayar",
    items: [
      { name: "Konsultasi Dokter Spesialis (dr. Sarah Jenkins)", type: "Jasa Medis", price: 200000 },
      { name: "Cek Gula Darah Sewaktu", type: "Tindakan Lab", price: 45000 },
      { name: "Paracetamol 500mg (10 Tab)", type: "Obat-obatan", price: 15000 },
      { name: "Loratadine 10mg (5 Tab)", type: "Obat-obatan", price: 25000 }
    ]
  },
  {
    id: "INV-2604-002",
    patientName: "Siti Aminah",
    date: "08 Apr 2026, 11:45 WIB",
    status: "Belum Dibayar",
    items: [
      { name: "Konsultasi Dokter Umum (dr. Andi Wijaya)", type: "Jasa Medis", price: 100000 },
      { name: "Ambroxol Syr 30mg/5ml", type: "Obat-obatan", price: 22500 },
      { name: "Azithromycin 500mg (3 Tab)", type: "Obat-obatan", price: 45000 }
    ]
  }
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedId, setSelectedId] = useState<string>(initialInvoices[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cari tagihan yang sedang dipilih
  const selectedInvoice = invoices.find(inv => inv.id === selectedId);
  
  // Hitung Total Harga
  const subtotal = selectedInvoice?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  const tax = subtotal * 0.11; // PPN 11% (Opsional, tergantung kebijakan klinik)
  const grandTotal = subtotal + tax;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulasi proses ke backend/payment gateway
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInvoices(invoices.map(inv => 
      inv.id === selectedId ? { ...inv, status: "Lunas" } : inv
    ));
    
    toast.success('Pembayaran Berhasil! Tagihan telah Lunas.');
    setIsProcessing(false);
  };

  const handlePrint = () => {
    toast('Memproses cetak struk...', { icon: '🖨️' });
    // Logika window.print() bisa ditaruh di sini nanti
  };

  return (
    <main className="p-6 md:p-10 w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-600 dark:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200 dark:shadow-rose-900/40 transition-colors duration-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Kasir & Penagihan</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-500">Pusat pembayaran layanan medis dan resep apotek.</p>
            </div>
          </div>
          <Link href="/dashboard" className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: DAFTAR TAGIHAN */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Antrean Tagihan</h3>
            
            {invoices.map((inv) => (
              <div 
                key={inv.id} 
                onClick={() => setSelectedId(inv.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  selectedId === inv.id 
                    ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 dark:border-rose-500 shadow-md' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/50 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className={`font-bold text-lg transition-colors ${selectedId === inv.id ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-white'}`}>
                      {inv.patientName}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{inv.id}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    inv.status === 'Lunas' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {inv.date}
                </p>
              </div>
            ))}
          </div>

          {/* KOLOM KANAN: DETAIL INVOICE (STRUK) */}
          <div className="lg:col-span-7">
            {selectedInvoice ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_20px_50px_rgb(0,0,0,0.05)] dark:shadow-slate-900/20 overflow-hidden flex flex-col h-full transition-colors duration-500">
                
                {/* Header Struk */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center transition-colors duration-500">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 transition-colors">Detail Faktur</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ID: {selectedInvoice.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Tanggal Cetak</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedInvoice.date}</p>
                  </div>
                </div>

                {/* Info Pasien */}
                <div className="px-8 py-6 flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-700 transition-colors duration-500">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Ditagihkan Kepada</p>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedInvoice.patientName}</h3>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-500/20 font-bold text-sm">
                    Klinik OmniHealth
                  </div>
                </div>

                {/* Daftar Item */}
                <div className="p-8 flex-grow">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                        <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deskripsi Layanan & Obat</th>
                        <th className="pb-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4">
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.type}</p>
                          </td>
                          <td className="py-4 text-right font-bold text-sm text-slate-800 dark:text-slate-200">
                            {formatRupiah(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total & Pembayaran */}
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 transition-colors duration-500">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                      <span>PPN (11%)</span>
                      <span>{formatRupiah(tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span>Total Bayar</span>
                      <span className="text-rose-600 dark:text-rose-400">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>

                  {selectedInvoice.status === 'Lunas' ? (
                    <div className="flex gap-4">
                      <div className="flex-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 py-4 rounded-xl font-black text-center flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-500/30">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        TAGIHAN LUNAS
                      </div>
                      <button onClick={handlePrint} className="px-6 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"></path></svg>
                        Cetak Struk
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handlePayment} 
                      disabled={isProcessing}
                      className="w-full py-4 bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30 flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <span className="animate-pulse">Memproses Pembayaran...</span>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                          Proses Pembayaran ({formatRupiah(grandTotal)})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="font-medium">Pilih tagihan di sebelah kiri untuk melihat detail.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}