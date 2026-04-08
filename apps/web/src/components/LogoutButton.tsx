// apps/web/src/components/LogoutButton.tsx
"use client";
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const handleLogout = () => {
    // 1. Hapus Kunci (Cookie) dari browser
    Cookies.remove('auth-token', { path: '/' }); 
    
    // 2. Tampilkan notifikasi
    toast.success('Berhasil keluar dari sistem.');
    
    // 3. Paksa browser untuk memuat ulang dan pindah ke halaman Login (Hard Navigation)
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout} 
      className="px-5 py-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-white dark:hover:text-white bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 dark:hover:bg-rose-600 rounded-lg transition-all border border-rose-100 dark:border-rose-500/20 hover:border-rose-600 dark:hover:border-rose-600"
    >
      Keluar (Logout)
    </button>
  );
}