// apps/api/src/routes/medicine.routes.ts
import { Hono } from 'hono';
import { db, schema } from '@omnihealth/db';
import { eq, sql } from 'drizzle-orm';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

const medicines = new Hono();

// 1. Ambil semua daftar obat (Bisa diakses semua staf yang login)
medicines.get('/', authMiddleware, async (c) => {
  const data = await db.query.medicines.findMany();
  return c.json({ data });
});

// 2. Tambah obat baru (Hanya ADMIN atau APOTEKER)
medicines.post('/', authMiddleware, roleMiddleware(['ADMIN', 'APOTEKER']), async (c) => {
  const body = await c.req.json();
  const newMedicine = await db.insert(schema.medicines).values({
    name: body.name,
    stock: parseInt(body.stock),
    unit: body.unit,
    price: body.price,
    threshold: body.threshold || 10
  }).returning();
  
  return c.json({ message: 'Obat berhasil ditambahkan', data: newMedicine[0] }, 201);
});

// 3. Update Stok (Misal saat obat datang atau ada penyesuaian manual)
medicines.patch('/:id/stock', authMiddleware, roleMiddleware(['ADMIN', 'APOTEKER']), async (c) => {
  const id = parseInt(c.req.param('id') || '0');
  const { amount } = await c.req.json(); // jumlah stok baru

  const updated = await db.update(schema.medicines)
    .set({ 
      stock: amount,
      updatedAt: sql`CURRENT_TIMESTAMP`
    })
    .where(eq(schema.medicines.id, id))
    .returning();

  return c.json({ message: 'Stok berhasil diperbarui', data: updated[0] });
});

export default medicines;