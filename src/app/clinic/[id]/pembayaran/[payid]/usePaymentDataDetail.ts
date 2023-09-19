import { collection, onSnapshot, query, where } from "firebase/firestore";
import * as React from "react";
import { db } from "../../../../../../lib/firebase";
export const usePaymentDataDetail = (queue_id: string) => {
  const [data, setData] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const q = query(
    collection(db, "transaction"),
    where("queue_id", "==", queue_id)
  );

  React.useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.empty || snapshot.docs.length === 0) {
        setLoading(false);
        setError("Data tak ditemukan");
        setData(null);
      }
      setData({...snapshot.docs[0].data(), id: snapshot.docs[0].id})
      setLoading(false)
      setError(null)
    });
    return () => unsub();
  }, []);
  return { data, loading, error };
};
