import { db } from "../../../../lib/firebase";
import { convertToObjectArray, schedulesConvertToDates } from "@/lib/utils";
import { medicalSchema } from "@/lib/validation/api";
import { schedulesOnlySchema } from "@/lib/validation/form";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const batch = writeBatch(db);
    const json = await request.json();
    const schedulesDatesConverted = schedulesConvertToDates(json.schedules);
    schedulesOnlySchema.parse({ schedules: schedulesDatesConverted });
    const formattedConvertArray = convertToObjectArray(schedulesDatesConverted);
    const batchArr = formattedConvertArray.map((sch: any) => {
      return batch.set(doc(db, "user", json.userId, "schedules", sch.days), {
        ...sch,
      });
    });
    const res = await batch.commit();
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
    const batch = writeBatch(db);
    const json = await request.json();
    const schedulesDatesConverted = schedulesConvertToDates(json.schedules);
    schedulesOnlySchema.parse({ schedules: schedulesDatesConverted });
    const formattedConvertArray = convertToObjectArray(schedulesDatesConverted);
    const batchArr = formattedConvertArray.map((sch: any) => {
      return batch.set(doc(db, "user", json.userId, "schedules", sch.days), {
        ...sch,
      });
    });
    const res = await batch.commit();
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
