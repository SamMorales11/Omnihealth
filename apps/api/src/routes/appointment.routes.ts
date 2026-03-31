import { Hono } from 'hono';
import { db, schema } from '@omnihealth/db';
import { eq } from 'drizzle-orm';

const appointmentRoutes = new Hono();

appointmentRoutes.get('/', async (c) => {
  // Sihir JOIN: Mengambil nama dari tabel pasien dan dokter sekaligus
  const data = await db.select({
    id: schema.appointments.id,
    date: schema.appointments.date,
    status: schema.appointments.status,
    patientName: schema.patients.name,
    doctorName: schema.doctors.name
  })
  .from(schema.appointments)
  .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
  .innerJoin(schema.doctors, eq(schema.appointments.doctorId, schema.doctors.id));
  
  return c.json({ data });
});

appointmentRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const newData = await db.insert(schema.appointments).values(body).returning();
  return c.json({ data: newData[0] }, 201);
});

export default appointmentRoutes;