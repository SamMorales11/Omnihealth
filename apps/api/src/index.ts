// apps/api/src/index.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

// 1. IMPOR RUTE AUTH & MIDDLEWARE KEAMANAN
import authRoutes from './routes/auth.js';
import { authMiddleware, roleMiddleware } from './middlewares/auth.js'; // Pastikan pakai 's' sesuai breadcrumb gambar

// 2. IMPOR RUTE BISNIS EKSISTING
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import medicineRoutes from './routes/medicine.routes.js';

const app = new Hono();

// --- MIDDLEWARE GLOBAL ---
app.use('*', logger());
app.use('/*', cors()); // Memberikan izin (CORS) untuk Next.js

// --- RUTE PUBLIK (BISA DIAKSES TANPA LOGIN) ---
// Digunakan untuk Login dan Pendaftaran User Baru
app.route('/api/auth', authRoutes);

// --- PROTEKSI RUTE OTOMATIS (AUTH CHECK) ---
// Semua rute di bawah ini memerlukan header 'Authorization: Bearer <token>'
app.use('/api/patients/*', authMiddleware);
app.use('/api/doctors/*', authMiddleware);
app.use('/api/appointments/*', authMiddleware);

// --- RUTE BISNIS (TERPROTEKSI) ---

// Mengelola data pasien (Bisa diakses ADMIN, DOKTER, atau STAF)
app.route('/api/patients', patientRoutes);

// Mengelola data dokter (Hanya ADMIN yang bisa CRUD, peran lain bisa melihat)
// Anda bisa menambahkan roleMiddleware(['ADMIN']) di dalam file rute spesifik nantinya
app.route('/api/doctors', doctorRoutes); 

// Manajemen Antrean (Diakses oleh DOKTER dan STAF)
app.route('/api/appointments', appointmentRoutes);

app.route('/api/medicines', medicineRoutes);

// --- KONFIGURASI SERVER ---
const port = 3001;
console.log(`🚀 OmniHealth API is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});