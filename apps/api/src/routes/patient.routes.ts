import { Hono } from 'hono';
import { PatientService } from '../services/patient.service.js';

const patientRoutes = new Hono();

// GET semua pasien
patientRoutes.get('/', async (c) => {
  const patients = await PatientService.getAllPatients();
  return c.json({ data: patients });
});

// POST pasien baru
patientRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const newPatient = await PatientService.createPatient(body);
  return c.json({ data: newPatient }, 201);
});

// PUT (Edit) pasien
patientRoutes.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const updatedPatient = await PatientService.updatePatient(id, body);
  return c.json({ data: updatedPatient });
});

// DELETE pasien
patientRoutes.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const deletedPatient = await PatientService.deletePatient(id);
  return c.json({ data: deletedPatient });
});

export default patientRoutes;