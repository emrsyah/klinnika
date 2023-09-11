import { db } from "@/lib/firebase";
import { queueFormSchema } from "@/lib/validation/form";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const birthDate = new Date(json.patient.birthDate);
    const formattedPatient = {
      patient: {
        ...json.patient,
        birthDate,
      },
    };
    await queueFormSchema
      .pick({ patient: true })
      .parseAsync(formattedPatient);
    delete formattedPatient.patient.birthDate;
    const readyToAddPatientFormat = {
      ...formattedPatient.patient,
      birth_date: birthDate,
      clinic_id: json.clinicId,
    };
    const newPatient = await addDoc(collection(db, "patient"), {
        ...readyToAddPatientFormat
    })
    return new NextResponse(JSON.stringify(newPatient.id), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const error_response = {
      status: "error",
      message: err.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
