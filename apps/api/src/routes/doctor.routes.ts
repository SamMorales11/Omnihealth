import { Hono } from 'hono';
import { db, schema } from '@omnihealth/db';
import { eq } from 'drizzle-orm';

const doctorRoutes = new Hono();

// GET & POST Dokter
doctorRoutes.get('/', async (c) => {
  const data = await db.select().from(schema.doctors);
  return c.json({ data });
});
doctorRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const newData = await db.insert(schema.doctors).values(body).returning();
  return c.json({ data: newData[0] }, 201);
});
doctorRoutes.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(schema.doctors).where(eq(schema.doctors.id, id));
  return c.json({ message: "Deleted" });
});

export default doctorRoutes;