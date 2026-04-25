// apps/api/src/routes/medicine.routes.ts
import { Hono } from 'hono';
import { db, schema } from '@omnihealth/db';
import { eq, sql } from 'drizzle-orm';

const medicineRoutes = new Hono();

// 1. Ambil semua daftar obat
medicineRoutes.get('/', async (c) => {
  const data = await db.select().from(schema.medicines).orderBy(schema.medicines.name);
  return c.json({ data });
});

// 2. Tambah obat baru
medicineRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const newData = await db.insert(schema.medicines).values({
    ...body,
    price: body.price.toString() // Pastikan harga disimpan sebagai string/decimal
  }).returning();
  return c.json({ data: newData[0] }, 201);
});

// 3. Update stok atau info obat
medicineRoutes.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const updated = await db.update(schema.medicines)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(schema.medicines.id, id))
    .returning();
  return c.json({ data: updated[0] });
});

// 4. Hapus obat
medicineRoutes.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const deleted = await db.delete(schema.medicines).where(eq(schema.medicines.id, id)).returning();
  return c.json({ data: deleted[0] });
});

export default medicineRoutes;