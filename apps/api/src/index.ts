import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

// Import Route Pasien (Pastikan menggunakan ekstensi .js untuk ESM Node)
import { patientRoutes } from './routes/patient.routes.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/', (c) => {
  return c.json({
    status: 'OK',
    message: 'OmniHealth API is running smoothly 🚀',
    timestamp: new Date().toISOString()
  });
});

// MOUNT ROUTE PASIEN DI SINI
app.route('/api/patients', patientRoutes);

app.onError((err, c) => {
  console.error(`[SERVER ERROR]: ${err.message}`);
  return c.json({ success: false, message: 'Internal Server Error' }, 500);
});

app.notFound((c) => {
  return c.json({ success: false, message: 'Endpoint not found' }, 404);
});

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});