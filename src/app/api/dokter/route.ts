import { db } from "../../../../lib/firebase";
import { doctorOnlySchema } from "@/lib/validation/form";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { customInitApp } from "../../../../lib/firebase-admin-config";
import { auth } from "firebase-admin";

customInitApp()

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    doctorOnlySchema.parse(json);
    const admRes = await auth().createUser({
      email: json.doctor.email,
      emailVerified: false,
      password: json.doctor.password,
      displayName: json.doctor.name,
      disabled: false,
    });
    const userId = admRes.uid;
    const formatted = {
      ...json.doctor,
      is_verified: false,
      profile_url: "",
      role: "doctor",
      created_at: serverTimestamp(),
    };
    delete formatted.password
    const userDocRef = doc(db, "user", userId);
    const docRef = await setDoc(userDocRef, { ...formatted });
    return new NextResponse(JSON.stringify(userId), {
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
