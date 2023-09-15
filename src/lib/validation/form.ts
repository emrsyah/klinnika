import * as z from "zod";

const isEmail = (value: string) => {
  // You can use a regular expression or any other method to validate the email format
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
};

export const queueFormSchema = z.object({
  patient: z.object({
    id: z.string().min(1, {message: "user id wajib"}).optional(),
    name: z.string().min(5, { message: "nama minimal 5 huruf" }),
    email: z
      .string()
      .transform((value) => (value === "" ? undefined : value.trim())) // Trim whitespace and treat empty string as undefined
      .refine((value) => value === undefined || isEmail(value), {
        message: "masukkan email yang valid",
      })
      .optional(),
    nik: z
      .string()
      .transform((value) => (value === "" ? undefined : value.trim())) // Trim whitespace and treat empty string as undefined
      .refine((value) => value === undefined || value.length === 16, {
        message: "masukkan nik yang valid",
      })
      .optional(),
    gender: z.enum(["Laki-laki", "Perempuan"], {
      required_error: "gender wajib diisi",
    }),
    phone: z
      .string({ required_error: "nomor telepon wajib dimasukkan" })
      .trim()
      .min(10, {message: "wajib mengiisi nomor telepon"})
      .max(13, {message: "masukkan nomor telepon benar (10-13 huruf)"}),
    birthDate: z.date({ required_error: "tanggal lahir wajib dimasukkan" }),
  }),
  complaint: z.object({
    description: z.string().optional(),
    appointmentDate: z.string({ required_error: "wajib memilih tanggal" }),
    doctor: z.object(
      {
        label: z.string(),
        value: z.string(),
      },
      { required_error: "wajib memilih dokter" }
    ),
    complaintType: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .min(1, { message: "minimal memilih 1 tipe komplain" }),
    queueType: z.enum(["BPJS", "Regular"], {
      required_error: "wajib memilih 1 tipe antrian",
    }),
  }),
});

export const queueOnlySchema =z.object({
    ...queueFormSchema.pick({complaint: true}).shape,
    userId: z.string().min(1, {message: "user is required"})
})

export const patientOnlySchema =z.object({
    ...queueFormSchema.pick({patient: true}).shape,
})

