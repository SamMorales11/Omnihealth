// apps/api/src/index.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

// PERBAIKAN: Impor default tanpa kurung kurawal {}
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('/*', cors()); // Memberikan izin (CORS) untuk Next.js

// Menyambungkan rute pasien ke prefix /api/patients
app.route('/api/patients', patientRoutes);
app.route('/api/doctors', doctorRoutes); // <-- Tambahkan ini
app.route('/api/appointments', appointmentRoutes); // <-- Tambahkan ini

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});