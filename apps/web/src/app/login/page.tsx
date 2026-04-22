// apps/web/src/app/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Cookies from 'js-cookie'; 

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Menggunakan 127.0.0.1 untuk stabilitas koneksi lokal
      const res = await fetch('http://127.0.0.1:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Simpan di localStorage untuk kebutuhan halaman Medicines
        localStorage.setItem('omni_token', data.token);
        localStorage.setItem('user-role', data.user.role);
        
        // 2. PERBAIKAN: Nama cookie diubah menjadi 'auth-token' agar SAMA dengan middleware.ts
        Cookies.set('auth-token', data.token, { expires: 1 }); 
        
        toast.success(`Selamat datang kembali, ${data.user.fullName}!`);
        
        // 3. Matikan status loading sebelum redirect
        setIsLoading(false); 
        
        // 4. Redirect paksa untuk melewati pengecekan Middleware secara bersih
        window.location.href = '/dashboard';
      } else {
        toast.error(data.message || 'Username atau password salah');
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Gagal terhubung ke server. Pastikan backend menyala.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-4 relative transition-colors duration-500">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300 bg-white/80 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md transition-all shadow-sm border border-slate-200 dark:border-slate-700 z-20 group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Kembali
      </Link>

      <div className="absolute top-0 w-full h-1/2 bg-indigo-600 dark:bg-indigo-900 rounded-b-[100px] shadow-2xl -z-10"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">OmniHealth Security</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium text-center">Masuk untuk mengelola klinik Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="text" 
            required 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
          />
          <input 
            type="password" 
            required 
            placeholder="Kata Sandi" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
          />
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-indigo-600 text-white rounded-xl font-bold py-4 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 italic">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </span>
            ) : 'Masuk ke Sistem'}
          </button>
        </form>
      </div>
    </main>
  );
}