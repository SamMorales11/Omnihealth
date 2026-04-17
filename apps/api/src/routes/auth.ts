// apps/api/src/routes/auth.ts
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { db, schema } from '@omnihealth/db'; // Tambahkan /index.js
import { eq } from 'drizzle-orm';

const auth = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-omnihealth';

// Register User Baru (Biasanya hanya oleh ADMIN)
auth.post('/register', async (c) => {
  const { username, password, role, fullName } = await c.req.json();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const newUser = await db.insert(schema.users).values({
      username,
      passwordHash,
      role,
      fullName
    }).returning();

    return c.json({ message: 'User berhasil didaftarkan', data: newUser[0] }, 201);
  } catch (err) {
    return c.json({ message: 'Username sudah digunakan' }, 400);
  }
});

// Login untuk mendapatkan Token
// apps/api/src/routes/auth.ts (Versi Debug)
auth.post('/login', async (c) => {
  console.log("--> Request Login Masuk..."); // Log 1
  const { username, password } = await c.req.json();

  try {
    console.log("--> Mencari user di database..."); // Log 2
    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username)
    });

    if (!user) {
      console.log("--> User tidak ditemukan.");
      return c.json({ message: 'Username atau password salah' }, 401);
    }

    console.log("--> Mencocokkan password..."); // Log 3
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return c.json({ message: 'Username atau password salah' }, 401);
    }

    // Generate Token JWT
    const token = await sign({
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }, JWT_SECRET);

    console.log("--> Login Berhasil!");
    return c.json({
      message: 'Login Berhasil',
      token,
      user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName }
    });
  } catch (error: any) {
    console.error("--> DATABASE ERROR:", error.message); // Log Error
    return c.json({ message: 'Gagal terhubung ke database' }, 500);
  }
});

export default auth;