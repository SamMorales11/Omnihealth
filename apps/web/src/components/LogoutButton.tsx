// apps/web/src/components/LogoutButton.tsx
"use client";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Hapus Kunci (Cookie) dari browser
    Cookies.remove('auth-token');
    
    // 2. Tampilkan notifikasi
    toast.success('Berhasil keluar dari sistem.');
    
    // 3. Tendang kembali ke halaman Login
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogout} 
      className="px-5 py-2 text-sm font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-all border border-rose-100 hover:border-rose-600"
    >
      Keluar (Logout)
    </button>
  );
}