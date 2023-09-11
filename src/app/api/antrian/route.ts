import { db } from "@/lib/firebase";
import { queueOnlySchema } from "@/lib/validation/form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

  try {
    const json = await request.json();
    await queueOnlySchema.parseAsync(json);
    const complaintType = json.complaint.complaintType.map(
      (com: any) => com.value
    );
    const appointmentDate =
      json.complaint.appointmentDate === "Hari Ini" ? today : tomorrow;

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
    };
    const newQueue = await addDoc(collection(db, "queue"), {
      ...readyToAddQueueFormat,
    });
    return new NextResponse(JSON.stringify(newQueue.id), {
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
