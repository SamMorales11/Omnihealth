// 1. Ubah patients menjadi schema
import { db, schema } from '@omnihealth/db'; 
import type { CreatePatientDTO } from '@omnihealth/shared';

export class PatientService {
  static async getAllPatients() {
    // 2. Gunakan schema.patients
    return await db.select().from(schema.patients);
  }

  static async createPatient(data: CreatePatientDTO) {
    // 3. Gunakan schema.patients
    const newPatient = await db.insert(schema.patients).values(data).returning();
    return newPatient[0];
  }
}