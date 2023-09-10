import { db } from "@/lib/firebase";
import * as React from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import {
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  startWith,
} from "rxjs";

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

export function useQueueData() {
  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "queue"), (snapshot) => {
      const observables = snapshot.docs.map((doc) => {
        const data = doc.data();
        const patientId = data.patient_id;
        return getUserData(patientId).pipe(
          map((user) => ({
            user,
            ...data,
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
          setLoading(false);
          setCombinedData(results);
        });
    });
    return () => unsubscribe();
  }, []);
  console.log(combinedData)
  return {combinedData, loading, error};
}
