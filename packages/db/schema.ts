import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['admin', 'doctor', 'receptionist']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'in_progress', 'completed', 'cancelled']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  specialization: varchar('specialization', { length: 255 }).notNull(),
  licenseNumber: varchar('license_number', { length: 100 }).notNull().unique(),
});

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  dob: date('dob').notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  status: appointmentStatusEnum('status').default('pending'),
});

export const medicalRecords = pgTable('medical_records', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  appointmentId: integer('appointment_id').references(() => appointments.id).notNull(),
  diagnosis: text('diagnosis').notNull(),
  prescription: text('prescription'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));