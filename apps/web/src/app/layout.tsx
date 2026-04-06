// apps/web/src/app/layout.tsx
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'OmniHealth | Sistem Manajemen Klinik',
  description: 'Revolusi Layanan Kesehatan Modern',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}