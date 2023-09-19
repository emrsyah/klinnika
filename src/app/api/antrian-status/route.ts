import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";

export async function PATCH(request: NextRequest) {
    try {
      const json = await request.json();
      await updateDoc(doc(db, "queue", json.id), {
        type: json.type,
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