// apps/web/src/app/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

// PASTIKAN ADA KATA 'default' DI SINI
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Panggil API Login yang asli di port 3001
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Simpan token ke localStorage dengan kunci 'omni_token'
        localStorage.setItem('omni_token', data.token);
        localStorage.setItem('user-role', data.user.role);
        
        toast.success(`Selamat datang kembali, ${data.user.fullName}!`);
        
        // 3. Arahkan ke Dashboard
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Akses Ditolak! Periksa kredensial Anda.');
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Gagal terhubung ke server API. Pastikan Backend menyala.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-4 relative transition-colors duration-500">
      
      {/* TOMBOL KEMBALI KE BERANDA */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl backdrop-blur-md transition-all shadow-sm border border-slate-200 dark:border-slate-700 z-20 group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali
      </Link>

      <div className="absolute top-0 w-full h-1/2 bg-indigo-600 dark:bg-indigo-900 rounded-b-[100px] shadow-2xl overflow-hidden -z-10 transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 p-8 md:p-10 transform transition-colors duration-500">
        
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner transition-colors duration-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">OmniHealth Security</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium text-center transition-colors duration-500">Gunakan akun staff Anda untuk mengakses sistem inventaris.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 transition-colors duration-500">Username</label>
            <input 
              type="text" 
              required 
              placeholder="Masukkan username staff"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 transition-all outline-none" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 transition-colors duration-500">Kata Sandi</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 transition-all outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-indigo-600 text-white rounded-xl font-bold py-4 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span className="animate-pulse flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Memverifikasi...
              </span>
            ) : (
              'Masuk ke Sistem'
            )}
          </button>
        </form>

        <div className="mt-8 text-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic">Catatan: Gunakan akun yang sudah didaftarkan di database melalui rute /api/auth/register.</p>
        </div>
      </div>
      
      <p className="mt-8 text-xs font-medium text-slate-400 dark:text-slate-500 z-10 transition-colors duration-500">© 2026 OmniHealth System. All rights reserved.</p>
    </main>
  );
}