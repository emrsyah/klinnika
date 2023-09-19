import { db } from "../../../../lib/firebase";
import { medicalSchema } from "@/lib/validation/api";
import { addDoc, collection, doc, serverTimestamp, increment, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const batch = writeBatch(db)
    const json = await request.json();
    medicalSchema.parse(json)
    const docRef = await addDoc(collection(db, "medical"), {...json, created_at: serverTimestamp()})
    const batchArr = json.medicals.map((med: any) => {
      return batch.update(doc(db, "inventory_stock", med.id), {
          amount: increment(med.quantity * -1)
      })
    })
    const res = await batch.commit()
    // console.log(res)
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
