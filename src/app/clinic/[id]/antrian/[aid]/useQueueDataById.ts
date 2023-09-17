import { db } from "../../../../../../lib/firebase";
import {
  DocumentData,
  DocumentSnapshot,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { queueOptions } from "./page";

export const useQueueDataById = (queueId: string) => {
  const [queue, setQueue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(queueOptions[0])

  useEffect(() => {
    const queueDoc = doc(db, "queue", queueId);
    const unsubscribe = onSnapshot(queueDoc, (queueSnapshot) => {
      setLoading(true);
      setError(null);
      if (!queueSnapshot.exists()) {
        setLoading(false);
        setError("Antrian tak bisa ditemukan");
        return;
      }
      const queueData = queueSnapshot.data();
      const docId = queueData.doctor_id;
      const patientId = queueData.patient_id;

      const selectedQueueType = queueOptions.find(q => q.value === queueData.type)
      setSelectedType(selectedQueueType!)

      const docRef = doc(db, "user", docId);
      const patientRef = doc(db, "patient", patientId);

      const promises: Promise<DocumentSnapshot<DocumentData>>[] = [
        getDoc(docRef),
        getDoc(patientRef),
      ];

      Promise.all(promises)
        .then(([docSnap, patientSnap]) => {
          const docData = docSnap.data();
          const patientData = patientSnap.data();

          const formattedQueue = {
            ...queueData,
            doctor: {
              ...docData,
            },
            patient: {
              ...patientData,
            },
          };


          setQueue(formattedQueue);

          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Terjadi kesalahan");
          setLoading(false);
        });
    });
    return () => unsubscribe();
  }, [queueId]);

  return { queue, loading, error, selectedType };
};
