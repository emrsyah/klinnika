import { db } from "../../../../../../lib/firebase";
import {
  collection,
  orderBy,
  query,
  where,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import * as React from "react";

export const useInventoryStock = (clinicId: string) => {
  const [medicines, setMedicines] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const medicinesRef = query(
      collection(db, "inventory_stock"),
      where("clinic_id", "==", clinicId),
      orderBy("expired_at", "asc")
    );

    const unsubscribe = onSnapshot(medicinesRef, (querySnapshot) => {
      try {
        setLoading(true);
        setError(null);

        const promises: Promise<void>[] = [];
        const medicineWithInfo: Array<any> = [];

        querySnapshot.forEach((docData) => {
          const data = docData.data();
          const dataId = docData.id;
          const inventoryId = data.inventory_id;

          const ref = doc(db, "inventory", inventoryId);
          const inventoryPromise = getDoc(ref).then((inventorySnapshot) => {
            if (inventorySnapshot.exists()) {
              if (inventorySnapshot.data().type !== "medicines") return;
              const inventD = inventorySnapshot.data();
              const combined = {
                ...data,
                info: {
                  ...inventD,
                },
                label: inventD.name,
                value: dataId,
                id: dataId,
                isSelected: false,
                medDesc: "",
              };
              medicineWithInfo.push(combined);
            }
          });

          promises.push(inventoryPromise);
        });

        Promise.all(promises).then(() => {
          setMedicines(medicineWithInfo);
          setError(null);
        });
      } catch (err) {
        console.error("terjadi kesalahan di pengambilan data");
        setError("terjadi kesalahan di pengambilan data");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts.
      unsubscribe();
    };
  }, [clinicId]);

  return { medicines, loading, error };
};
