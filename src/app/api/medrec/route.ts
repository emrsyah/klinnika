import { db } from "../../../../lib/firebase";
import { medicalRecordSchema } from "@/lib/validation/api";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    medicalRecordSchema.parse(json)
    const docRef = await addDoc(collection(db, "medical_record"), {...json, created_at: serverTimestamp()})
    const uptQueue = await updateDoc(doc(db, "queue", json.queue_id), {
      type: "Selesai Proses"
    })
    return new NextResponse(JSON.stringify(docRef.id), {
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
