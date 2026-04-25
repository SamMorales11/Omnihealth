// apps/api/src/routes/appointment.routes.ts
import { Hono } from 'hono';
import { db, schema } from '@omnihealth/db';
import { eq } from 'drizzle-orm';

const appointmentRoutes = new Hono();

appointmentRoutes.get('/', async (c) => {
  const data = await db.select({
    id: schema.appointments.id,
    date: schema.appointments.date,
    status: schema.appointments.status,
    patientName: schema.patients.name,
    doctorName: schema.doctors.name,
    specialist: schema.doctors.specialist
  })
  .from(schema.appointments)
  .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
  .innerJoin(schema.doctors, eq(schema.appointments.doctorId, schema.doctors.id));
  
  return c.json({ data });
});

// REVISI: Tambahkan rute untuk mengambil SATU data antrean berdasarkan ID
appointmentRoutes.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const data = await db.select({
    id: schema.appointments.id,
    date: schema.appointments.date,
    status: schema.appointments.status,
    patientName: schema.patients.name,
    doctorName: schema.doctors.name,
    specialist: schema.doctors.specialist
  })
  .from(schema.appointments)
  .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
  .innerJoin(schema.doctors, eq(schema.appointments.doctorId, schema.doctors.id))
  .where(eq(schema.appointments.id, id));
  
  // Kembalikan data pertama (index 0)
  return c.json({ data: data[0] });
});

appointmentRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const newData = await db.insert(schema.appointments).values(body).returning();
  return c.json({ data: newData[0] }, 201);
});

appointmentRoutes.put('/:id/status', async (c) => {
  const id = parseInt(c.req.param('id'));
  const { status } = await c.req.json();
  
  const updated = await db.update(schema.appointments)
    .set({ status })
    .where(eq(schema.appointments.id, id))
    .returning();
    
  return c.json({ data: updated[0] });
});

export default appointmentRoutes;