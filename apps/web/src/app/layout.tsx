import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning mencegah error kedipan saat refresh
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-500">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          {children} 
        </ThemeProvider>
      </body>
    </html>
  );
}