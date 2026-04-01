// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Gunakan font bawaan Google
import { Toaster } from "react-hot-toast"; // Toast Notification kita
import "./globals.css";

// Inisialisasi font Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OmniHealth System",
  description: "Sistem Manajemen Klinik Terpadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Pasang Toaster di sini agar aktif di seluruh aplikasi */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}