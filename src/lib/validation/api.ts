import * as z from "zod"
export const medicalSchema = z.object({
    medicals: z.array(z.object({
        name: z.string(),
        id: z.string(),
        quantity: z.number(),
        desc: z.string().optional(),
        inventory_id: z.string(),
        expired_at: z.object({
            seconds: z.number(),
            nanoseconds: z.number()
        })
    }))
})

export const medicalRecordSchema = z.object({
    act_type: z.string(),
    diagnose: z.string(),
    queue_id: z.string(),
    medical_id: z.string(),
    doc_id: z.string(),
    patient_id: z.string(),
    clinic_id: z.string(),
})