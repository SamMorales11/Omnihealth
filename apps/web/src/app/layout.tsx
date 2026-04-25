// apps/web/src/app/layout.tsx
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-500">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          <Toaster position="top-center" reverseOrder={false} /> 
          
          {/* Sidebar sekarang menangani UI-nya sendiri secara melayang */}
          <Sidebar />

          {/* Konten Utama: Sekarang Full Width (pl-0) agar terlihat Clean */}
          <main className="min-h-screen transition-all duration-500">
            {children}
          </main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}