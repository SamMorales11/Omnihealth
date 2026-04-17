// apps/api/src/middlewares/auth.ts
import type { Context, Next } from 'hono'; // Gunakan import type
import { verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-omnihealth';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Akses Ditolak: Token tidak ditemukan' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // Tambahkan 'HS256' sebagai argumen ketiga (algoritma default)
    const payload = await verify(token, JWT_SECRET, 'HS256'); 
    c.set('jwtPayload', payload); 
    await next();
  } catch (error) {
    return c.json({ message: 'Akses Ditolak: Token tidak valid' }, 401);
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    // Lakukan casting ke 'any' atau interface agar .role bisa diakses
    const user = c.get('jwtPayload') as any;
    
    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ 
        message: `Akses Terlarang: Anda bukan ${allowedRoles.join('/')}` 
      }, 403);
    }
    
    await next();
  };
};