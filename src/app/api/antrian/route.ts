import { db } from "../../../../lib/firebase";
import { queueOnlySchema } from "@/lib/validation/form";
import {
  addDoc,
  collection,
  getCountFromServer,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// {
//     "complaint": {
//         "appointmentDate": "Hari Ini",
//         "doctor": {
//             "label": "Sammy Heryawan",
//             "value": "oPLVXFMNong1Dn5s1Fvy"
//         },
//         "complaintType": [
//             {
//                 "label": "Flu",
//                 "value": "Flu"
//             }
//         ],
//         "queueType": "BPJS"
//     },
//     "userId": "RR0KqwsdKKIETtkxiQUu"
// }

// {
//     "doctor_id": "oPLVXFMNong1Dn5s1Fvy",
//     "clinic_id": "noP17V2AyWGw1AGGKtbT",
//     "complaint_type": [
//         "Flu",
//         "Batuk",
//         "Sakit Kepala"
//     ],
//     "complaint_desc": "",
//     "finish_at": null,
//     "poly_id": "2112",
//     "type": "Menunggu",
//     "category": "Regular",
//     "appointment_date": "2023-09-10T17:00:00.000Z",
//     "patient_id": "31DdJ3SMCTHJwSmC2ESO"
// }

export async function POST(request: NextRequest) {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  let tomorrowEnd = new Date();
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
  tomorrowEnd.setHours(23, 59, 59, 999);

  try {
    const json = await request.json();
    await queueOnlySchema.parseAsync(json);
    const complaintType = json.complaint.complaintType.map(
      (com: any) => com.value
    );
    const appointmentDate =
      json.complaint.appointmentDate === "Hari Ini" ? today : tomorrow;

    let q = query(
      collection(db, "queue"),
      where("clinic_id", "==", json.clinicId),
      where("doctor_id", "==", json.complaint.doctor.value)
    );

    if (appointmentDate === today) {
      q = query(
        q,
        where("appointment_date", ">=", today),
        where("appointment_date", "<=", todayEnd)
      );
    } else {
      q = query(
        q,
        where("appointment_date", ">=", tomorrow),
        where("appointment_date", "<=", tomorrowEnd)
      );
    }

    const currentQueueLengthSnap = await getCountFromServer(q)
    const currentQueueLength = currentQueueLengthSnap.data().count

    const readyToAddQueueFormat = {
      doctor_id: json.complaint.doctor.value,
      clinic_id: json.clinicId,
      complaint_type: complaintType,
      complaint_desc: json.complaint.description ?? "",
      finish_at: null,
      poly_id: "2112",
      type: "Menunggu",
      category: json.complaint.queueType,
      appointment_date: appointmentDate,
      patient_id: json.userId,
      created_at: serverTimestamp(),
      order_number: currentQueueLength + 1
    };
    const newQueue = await addDoc(collection(db, "queue"), {
      ...readyToAddQueueFormat,
    });
    return new NextResponse(JSON.stringify({queueId: newQueue.id, orderNumber: currentQueueLength + 1}), {
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
