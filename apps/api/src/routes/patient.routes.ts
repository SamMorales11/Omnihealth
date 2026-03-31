import { Hono } from 'hono';
import { getAllPatients, createPatient } from '../controllers/patient.controller.js';

export const patientRoutes = new Hono();

// GET /api/patients
patientRoutes.get('/', getAllPatients);

// POST /api/patients
patientRoutes.post('/', createPatient);