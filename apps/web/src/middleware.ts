// apps/web/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cek apakah user membawa "Kunci" (Cookie bernama auth-token)
  const hasToken = request.cookies.has('auth-token');
  
  // 2. Cek apakah user sedang mencoba membuka halaman Login
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Skenario A: User belum punya kunci, dan mencoba masuk ke halaman dalam
  if (!hasToken && !isLoginPage) {
    // TENDANG ke halaman Login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Skenario B: User sudah punya kunci, tapi mencoba buka halaman Login lagi
  if (hasToken && isLoginPage) {
    // TENDANG ke halaman Dashboard (ngapain login lagi)
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Skenario C: Aman, silakan lewat!
  return NextResponse.next();
}

// 3. Daftarkan rute mana saja yang harus dijaga oleh satpam ini
export const config = {
  matcher: [
    '/',               // Jaga Dashboard
    '/doctors',        // Jaga Halaman Dokter
    '/appointments',   // Jaga Halaman Antrean
    '/login'           // Jaga Halaman Login (Skenario B)
  ],
};