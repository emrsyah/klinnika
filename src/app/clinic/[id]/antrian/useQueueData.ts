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
function getUserData(patient_id: string) {
  return from(getDoc(doc(db, "patient", patient_id))).pipe(
    map((userDoc) => {
      return { id: userDoc.id, ...userDoc.data() };
    })
  );
}

export function useQueueData(params: string) {
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  //   URUSIN ORDERBY APPOINTMENT DATE

  React.useEffect(() => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    today.setHours(0, 0, 0, 0);
    let todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    let q = query(
      collection(db, "queue"),
      orderBy("appointment_date", "desc"),
      orderBy("created_at", "asc")
    );
    if (params === "focus") {
      q = query(
        q,
        where("appointment_date", ">=", today),
        where("appointment_date", "<=", todayEnd)
      );
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const observables = snapshot.docs.map((doc) => {
        const data = doc.data();
        const dataId = doc.id
        const patientId = data.patient_id;
        return getUserData(patientId).pipe(
          map((user) => ({
            user,
            ...data,
            id: dataId
          })),
          catchError((error) => {
            console.log("error happened - user data");
            setLoading(false);
            setError("Something Error Happened - Fetching User Data");
            return of(null);
          })
        );
      });
      combineLatest(observables)
        .pipe(
          startWith([]),
          catchError((error) => {
            console.log("error happened - user data");
            setLoading(false);
            setError("Something Error Happened - Fetching Queue");
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
  }, [params]);
  return { combinedData, loading, error };
}
