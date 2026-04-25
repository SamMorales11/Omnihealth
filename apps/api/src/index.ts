// apps/api/src/index.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { db, schema } from '@omnihealth/db';
import { eq, sql } from 'drizzle-orm';

import authRoutes from './routes/auth.js';
import { authMiddleware } from './middlewares/auth.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import medicineRoutes from './routes/medicine.routes.js';

const app = new Hono();

app.use('*', logger());
app.use('/*', cors());

app.route('/api/auth', authRoutes);

app.use('/api/patients/*', authMiddleware);
app.use('/api/doctors/*', authMiddleware);
app.use('/api/appointments/*', authMiddleware);
app.use('/api/analytics', authMiddleware); // REVISI: Proteksi rute analitik

// REVISI: Endpoint khusus Analitik untuk Dashboard
app.get('/api/analytics', async (c) => {
  const [patients, doctors, appointments] = await Promise.all([
    db.select().from(schema.patients),
    db.select().from(schema.doctors),
    db.select().from(schema.appointments)
  ]);

  const waiting = appointments.filter(a => a.status === 'Menunggu').length;
  const finished = appointments.filter(a => a.status === 'Selesai').length;

  // Analisis Performa: Dokter dengan antrean terbanyak (Busy Doctors)
  const doctorPerformance = await db.select({
    name: schema.doctors.name,
    count: sql<number>`count(${schema.appointments.id})`
  })
  .from(schema.doctors)
  .leftJoin(schema.appointments, eq(schema.doctors.id, schema.appointments.doctorId))
  .groupBy(schema.doctors.name);

  return c.json({
    stats: {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      waitingAppointments: waiting,
      completionRate: appointments.length > 0 ? Math.round((finished / appointments.length) * 100) : 0
    },
    doctorPerformance
  });
});

app.route('/api/patients', patientRoutes);
app.route('/api/doctors', doctorRoutes); 
app.route('/api/appointments', appointmentRoutes);
app.route('/api/medicines', medicineRoutes);

const port = 3001;
serve({ fetch: app.fetch, port });