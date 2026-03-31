import { z } from 'zod';

export const createPatientSchema = z.object({
  nik: z.string().length(16, "NIK harus terdiri dari 16 digit"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir harus YYYY-MM-DD"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;