import {
  DocumentData,
  DocumentSnapshot,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../../../../lib/firebase";

export const useStockDataDetail = (stockId: string) => {
  const [stock, setStock] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stockDoc = doc(db, "inventory_stock", stockId);
    const unsubscribe = onSnapshot(stockDoc, (stockSnapshot) => {
      setLoading(true);
      setError(null);
      if (!stockSnapshot.exists()) {
        setLoading(false);
        setError("Antrian tak bisa ditemukan");
        return;
      }
      const stockData = stockSnapshot.data();
      const invId = stockData.inventory_id;

      const invRef = doc(db, "inventory", invId);

      const promises: Promise<DocumentSnapshot<DocumentData>>[] = [
        getDoc(invRef),
      ];

      Promise.all(promises)
        .then(([invSnap]) => {
          const invData = invSnap.data();

          const formattedStock = {
            ...stockData,
            inventory: {
              ...invData,
            },
          };


          setStock(formattedStock);

          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Terjadi kesalahan");
          setLoading(false);
        });
    });
    return () => unsubscribe();
  }, [stockId]);

  return { stock, loading, error };
};
