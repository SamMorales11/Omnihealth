// apps/api/src/routes/prescription.routes.ts
import { Hono } from 'hono';
import { db, schema } from '@omnihealth/db';
import { eq, sql } from 'drizzle-orm';

const prescriptionRoutes = new Hono();

// REVISI: Menyimpan resep DAN mengurangi stok obat secara otomatis
prescriptionRoutes.post('/', async (c) => {
  const { appointmentId, doctorId, patientId, items } = await c.req.json();
  
  try {
    return await db.transaction(async (tx) => {
      // 1. Buat Header Resep
      const [rx] = await tx.insert(schema.prescriptions).values({ 
        appointmentId, 
        doctorId, 
        patientId,
        status: 'PENDING'
      }).returning();
      
      for (const item of items) {
        // 2. Simpan Item Resep
        await tx.insert(schema.prescriptionItems).values({ 
          prescriptionId: rx.id, 
          medicineId: item.medicineId,
          quantity: item.quantity,
          instruction: item.instruction
        });
        
        // 3. PENTING: Kurangi Stok Obat di Gudang
        await tx.update(schema.medicines)
          .set({ 
            stock: sql`${schema.medicines.stock} - ${item.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(schema.medicines.id, item.medicineId));
      }
      return c.json({ success: true, prescriptionId: rx.id });
    });
  } catch (error) {
    console.error("Gagal memproses resep:", error);
    return c.json({ error: "Gagal menyimpan resep." }, 500);
  }
});

export default prescriptionRoutes;