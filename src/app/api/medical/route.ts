import { db } from "@/lib/firebase";
import { medicalSchema } from "@/lib/validation/api";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    medicalSchema.parse(json)
    const docRef = await addDoc(collection(db, "medical"), {...json, created_at: serverTimestamp()})
    return new NextResponse(JSON.stringify({medical_id: docRef.id}), {
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
