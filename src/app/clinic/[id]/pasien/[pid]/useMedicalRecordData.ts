import { db } from "@/lib/firebase";
import * as React from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { catchError, combineLatest, from, map, of, startWith } from "rxjs";

interface DocumentWithUser<T> {
  id: string;
  data: T;
  user: User;
}

interface User {
  id: string;
  name: string;
  // Add other properties as needed
}

// Function to fetch user data by user_id
function getMedicalData(patient_id: string) {
  return from(getDoc(doc(db, "medical", patient_id))).pipe(
    map((userDoc) => {
      return { id: userDoc.id, ...userDoc.data() };
    })
  );
}

function getDoctorData(doctor_id: string) {
  return from(getDoc(doc(db, "user", doctor_id))).pipe(
    map((doctorDoc) => {
      return { id: doctorDoc.id, ...doctorDoc.data() };
    })
  );
}

export function useMedicalRecordData({
  patientId,
}: {
  patientId: string;
}) {
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let q = query(
      collection(db, "medical_record"),
      where("patient_id", "==", patientId),
      orderBy("created_at", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const observables = snapshot.docs.map((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        console.log(data)
        const medicalId = data.medical_id;
        const doctorId = data.doc_id;

        const medicalObservable = getMedicalData(medicalId);
        const doctorObservable = getDoctorData(doctorId);

        return combineLatest([medicalObservable, doctorObservable]).pipe(
          map(([medical, doctor]) => ({
            id: dataId,
            ...data,
            medical,
            doctor,
          })),
          catchError((err) => {
            console.error(err);
            setLoading(false);
            setError(
              "Something Error Happened - Fetching Medical Or Doctor Data"
            );
            return of(null);
          })
        );
      });
      combineLatest(observables)
        .pipe(
          startWith([]),
          catchError((error) => {
            console.error(error);
            setLoading(false);
            setError("Something Error Happened - Fetching Medical Record");
            return of([]);
          })
        )
        .subscribe((results) => {
          // console.log(results)
          setLoading(false);
          setCombinedData(results);
        });
    });
    return () => unsubscribe();
  }, []);
  console.log(combinedData);
  return { combinedData, loading, error };
}
