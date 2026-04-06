// apps/web/src/app/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses pengecekan ke server (jeda 1 detik)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Kredensial Admin Utama
    if (email === 'admin@omnihealth.com' && password === 'admin123') {
      Cookies.set('auth-token', 'super-secret-admin-token', { expires: 1 });
      toast.success('Login berhasil! Selamat datang, Admin.');
      
      // Arahkan ke rute Dashboard yang baru
      router.push('/dashboard');
    } else {
      toast.error('Akses Ditolak! Email atau Password salah.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative">
      
      {/* TOMBOL KEMBALI KE BERANDA (Tambahan Baru) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm font-bold text-indigo-100 hover:text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl backdrop-blur-md transition-all border border-indigo-500/30 z-20 group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali
      </Link>

      {/* Ornamen Latar Belakang */}
      <div className="absolute top-0 w-full h-1/2 bg-indigo-600 rounded-b-[100px] shadow-2xl overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100 p-8 md:p-10 transform transition-all">
        
        {/* Logo & Judul */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">OmniHealth Security</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium text-center">Silakan masuk menggunakan kredensial administrator Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Alamat Email</label>
            <input 
              type="email" 
              required 
              placeholder="admin@omnihealth.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block p-3.5 transition-all outline-none" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kata Sandi</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block p-3.5 transition-all outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-indigo-600 text-white rounded-xl font-bold py-4 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
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

        <div className="mt-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Data Login Demo:</p>
          <p className="text-xs font-bold text-slate-700 mt-1">Email: <span className="text-indigo-600">admin@omnihealth.com</span></p>
          <p className="text-xs font-bold text-slate-700">Password: <span className="text-indigo-600">admin123</span></p>
        </div>
      </div>
      
      <p className="mt-8 text-xs font-medium text-slate-400 z-10">© 2026 OmniHealth System. All rights reserved.</p>
    </main>
  );
}