import { inventoryFormSchema } from "@/lib/validation/form";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    inventoryFormSchema.parse(json);
    await addDoc(collection(db, "inventory"), {
      ...json.inventory,
      clinic_id: json.clinicId,
      created_at: serverTimestamp(),
    });
    return new NextResponse(JSON.stringify({}), {
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
    inventoryFormSchema.parse(json);
    await updateDoc(doc(db, "inventory", json.id), {
      ...json.inventory,
    });
    return new NextResponse(JSON.stringify({}), {
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
