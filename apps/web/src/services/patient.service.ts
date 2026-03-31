// apps/web/src/services/patient.service.ts
import { Patient, ApiResponse } from '@/types';

const API_URL = 'http://localhost:3001/api';

export type CreatePatientInput = Omit<Patient, 'id' | 'createdAt'>;

export const PatientService = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_URL}/patients`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const result: ApiResponse<Patient[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  async createPatient(data: CreatePatientInput): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
      console.error('Error creating patient:', error);
      return false;
    }
  },
  async updatePatient(id: number, data: Partial<CreatePatientInput>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating patient:', error);
      return false;
    }
  },

  // FUNGSI HAPUS PASIEN
  async deletePatient(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, { 
        method: 'DELETE' 
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting patient:', error);
      return false;
    }
  }
};
