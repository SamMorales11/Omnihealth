// apps/web/src/app/layout.tsx
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast'; // Impor Toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-500">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          {/* Tambahkan Toaster di sini */}
          <Toaster position="top-center" reverseOrder={false} /> 
          {children} 
        </ThemeProvider>
      </body>
    </html>
  );
}