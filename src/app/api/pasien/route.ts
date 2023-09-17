import { db } from "../../../../lib/firebase";
import { queueFormSchema } from "@/lib/validation/form";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
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
    await queueFormSchema.pick({ patient: true }).parseAsync(formattedPatient);
    delete formattedPatient.patient.birthDate;
    const readyToAddPatientFormat = {
      ...formattedPatient.patient,
      birth_date: birthDate,
      clinic_id: json.clinicId,
      nik: formattedPatient.patient.nik ?? "",
      email: formattedPatient.patient.email ?? "",
      created_at: serverTimestamp(),
    };
    const newPatient = await addDoc(collection(db, "patient"), {
      ...readyToAddPatientFormat,
    });
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

export async function PATCH(request: NextRequest) {
  try {
    const json = await request.json();
    const birthDate = new Date(json.patient.birthDate);
    const formattedPatient = {
      patient: {
        ...json.patient,
        birthDate,
      },
    };
    await queueFormSchema.pick({ patient: true }).parseAsync(formattedPatient);
    delete formattedPatient.patient.birthDate;
    const readyToAddPatientFormat = {
      ...formattedPatient.patient,
      birth_date: birthDate,
      nik: formattedPatient.patient.nik ?? "",
      email: formattedPatient.patient.email ?? "",
    };
    await updateDoc(doc(db, "patient", json.id), {
      ...readyToAddPatientFormat
    })
    return new NextResponse(JSON.stringify(readyToAddPatientFormat), {
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
