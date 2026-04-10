// apps/web/src/components/NotificationBell.tsx
"use client";

import { useState, useRef, useEffect } from 'react';

// Simulasi Data Notifikasi
const initialNotifications = [
  { id: 1, title: 'Antrean Baru', message: 'Pasien Budi Santoso telah mendaftar di Poli Umum.', time: '5 mnt lalu', unread: true, type: 'info' },
  { id: 2, title: 'Pembayaran Lunas', message: 'Invoice INV-2604-001 senilai Rp 260.000 telah dibayar.', time: '12 mnt lalu', unread: true, type: 'success' },
  { id: 3, title: 'Peringatan Stok', message: 'Stok Azithromycin 500mg telah habis.', time: '1 jam lalu', unread: false, type: 'warning' },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Tutup dropdown jika klik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>;
      case 'warning': return <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TOMBOL LONCENG */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        
        {/* BADGE MERAH JIKA ADA UNREAD */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL (SOLID DARK) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
          
          {/* HEADER DROPDOWN (SOLID DARK) */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
            <h3 className="font-black text-slate-900 dark:text-white text-lg">Notifikasi</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                Tandai semua dibaca
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">Belum ada notifikasi baru.</div>
            ) : notifications.map((notif) => (
              <div key={notif.id} className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex gap-4 ${notif.unread ? 'bg-indigo-50 dark:bg-slate-800' : 'dark:bg-slate-900'}`}>
                {getIcon(notif.type)}
                <div>
                  <h4 className={`text-sm font-bold ${notif.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{notif.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* FOOTER DROPDOWN (SOLID DARK) */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-950">
            <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}