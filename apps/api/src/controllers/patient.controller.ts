import type { Context } from 'hono';
import { PatientService } from '../services/patient.service.js';
import { createPatientSchema } from '@omnihealth/shared';

export const getAllPatients = async (c: Context) => {
  try {
    const data = await PatientService.getAllPatients();
    return c.json({ success: true, data });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

export const createPatient = async (c: Context) => {
  try {
    const body = await c.req.json();
    
    // Validasi input menggunakan Zod
    const validationResult = createPatientSchema.safeParse(body);
    if (!validationResult.success) {
      return c.json({ 
        success: false, 
        message: 'Validasi gagal', 
        errors: validationResult.error.format() 
      }, 400);
    }

    // Panggil Service untuk simpan ke DB
    const newPatient = await PatientService.createPatient(validationResult.data);
    return c.json({ success: true, data: newPatient }, 201);
    
  } catch (error: any) {
    // Tangani error NIK duplikat dari PostgreSQL
    if (error.code === '23505') {
      return c.json({ success: false, message: 'NIK sudah terdaftar' }, 409);
    }
    return c.json({ success: false, message: error.message }, 500);
  }
};