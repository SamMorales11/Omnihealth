// apps/web/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasToken = request.cookies.has('auth-token');
  
  // Halaman yang BOLEH diakses siapa saja (tanpa login)
  const isPublicPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/';

  // Skenario A: Belum login, dan mencoba masuk ke ruang rahasia
  if (!hasToken && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Skenario B: Sudah login, tapi mencoba masuk ke halaman Login lagi
  if (hasToken && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Daftarkan ruangan mana saja yang perlu dipantau Satpam
export const config = {
  matcher: [
    '/dashboard',      // <-- Jaga rute baru ini
    '/doctors',        
    '/appointments',   
    '/login'           
  ],
};