// apps/db/src/schema.ts
import { 
  pgTable, 
  serial, 
  varchar, 
  date, 
  text, 
  timestamp, 
  integer, 
  pgEnum, 
  decimal, 
  jsonb 
} from 'drizzle-orm/pg-core';

// 1. DEFINISI ENUM (Untuk konsistensi data)
export const roleEnum = pgEnum('role', ['ADMIN', 'DOKTER', 'APOTEKER', 'KASIR', 'PASIEN']);
export const prescriptionStatusEnum = pgEnum('prescription_status', ['PENDING', 'PREPARED', 'COMPLETED']);

// 2. TABEL PENGGUNA (RBAC)
// Digunakan untuk login dan menentukan hak akses
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. TABEL PASIEN
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Opsional: Link ke akun login
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  dob: date('dob').notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. TABEL DOKTER
export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Link ke akun login dokter
  name: varchar('name', { length: 255 }).notNull(),
  specialist: varchar('specialist', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
});

// 5. TABEL ANTREAN (APPOINTMENTS)
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 50 }).default('Menunggu'),
});

// 6. TABEL FARMASI & INVENTARIS
export const medicines = pgTable('medicines', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(), // misal: tablet, botol, tube
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  threshold: integer('threshold').default(10), // Stok minimum untuk notifikasi
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. TABEL RESEP (E-PRESCRIBING)
export const prescriptions = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  status: prescriptionStatusEnum('status').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. TABEL ITEM RESEP
export const prescriptionItems = pgTable('prescription_items', {
  id: serial('id').primaryKey(),
  prescriptionId: integer('prescription_id').references(() => prescriptions.id, { onDelete: 'cascade' }),
  medicineId: integer('medicine_id').references(() => medicines.id),
  quantity: integer('quantity').notNull(),
  instruction: text('instruction'), // Contoh: "3x1 Sehari setelah makan"
});

// 9. TABEL AUDIT LOG (KEAMANAN)
// Mencatat setiap aktivitas penting untuk audit medis
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // misal: 'HAPUS_PASIEN', 'UPDATE_STOK'
  resource: varchar('resource', { length: 50 }), // misal: 'patients', 'medicines'
  resourceId: integer('resource_id'),
  details: jsonb('details'), // Menyimpan data JSON (perubahan data lama vs baru)
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').defaultNow(),
});