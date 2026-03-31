// Tambahkan 'eq' di bagian import atas
import { eq } from 'drizzle-orm'; 
import { db, schema } from '@omnihealth/db'; 
import type { CreatePatientDTO } from '@omnihealth/shared';

export class PatientService {
  static async getAllPatients() {
    return await db.select().from(schema.patients);
  }

  static async createPatient(data: CreatePatientDTO) {
    const newPatient = await db.insert(schema.patients).values(data).returning();
    return newPatient[0];
  }

  // LOGIKA UPDATE DATA
  static async updatePatient(id: number, data: Partial<CreatePatientDTO>) {
    const updated = await db
      .update(schema.patients)
      .set(data)
      .where(eq(schema.patients.id, id))
      .returning();
    return updated[0];
  }

  // LOGIKA HAPUS DATA
  static async deletePatient(id: number) {
    const deleted = await db
      .delete(schema.patients)
      .where(eq(schema.patients.id, id))
      .returning();
    return deleted[0];
  }
}