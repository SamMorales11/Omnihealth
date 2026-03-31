// apps/web/src/types/index.ts

export interface Patient {
  id: number;
  nik: string;
  name: string;
  dob: string; // Tanggal lahir
  address: string | null;
  phone: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}