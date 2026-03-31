// apps/api/src/services/patient.service.ts
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
}