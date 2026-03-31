// apps/db/src/schema.ts
import { pgTable, serial, varchar, date, text, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Tabel Pasien (Tetap dipertahankan)
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  dob: date('dob').notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Tabel Dokter (Versi Baru)
export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  specialist: varchar('specialist', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
});

// 3. Tabel Antrean (Versi Baru)
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 50 }).default('Menunggu'),
});