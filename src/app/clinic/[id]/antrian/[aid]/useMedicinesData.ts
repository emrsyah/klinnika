import { db } from "../../../../../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import * as React from "react";

// {
//     "desc": "",
//     "expired_at": {
//         "seconds": 1694970000,
//         "nanoseconds": 655000000
//     },
//     "inventory_id": "EWHUHFG07VExfQt6ZCzH",
//     "clinic_id": "noP17V2AyWGw1AGGKtbT",
//     "amount": 50,
//     "created_at": {
//         "seconds": 1694019600,
//         "nanoseconds": 217000000
//     },
//     "info": {
//         "desc": "",
//         "name": "Tolak Angin",
//         "clinic_id": "noP17V2AyWGw1AGGKtbT",
//         "price": 3000,
//         "type": "medicines",
//         "created_at": {
//             "seconds": 1694695043,
//             "nanoseconds": 595000000
//         },
//         "min": 0,
//         "unit_type": "pcs"
//     }
// }

export const useMedicinesData = (clinicId: string) => {
  console.log(clinicId);
  const [medicines, setMedicines] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    const medicinesRef = query(
      collection(db, "inventory_stock"),
      where("clinic_id", "==", clinicId),
      orderBy("expired_at", "asc")
    );
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const snapshot = await getDocs(medicinesRef);
        //   console.log(snapshot)
        const promises: Promise<void>[] = [];
        const medicineWithInfo: Array<any> = [];
        snapshot.forEach((docData) => {
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
        Promise.all(promises);
        setMedicines(medicineWithInfo)
        setError(null);
      } catch (err) {
        console.error("terjadi kesalahan di pengambilan data");
        setError("terjadi kesalahan di pengambilan data");
      } finally{
        setLoading(false)
      }
    };
    // const unsub = onSnapshot(medicinesRef, (snapshot) => {
    //   setLoading(true);
    //   setError(null);
    //   //   console.log(snapshot)
    //   const promises: Promise<void>[] = [];
    //   const medicineWithInfo: Array<any> = [];
    //   snapshot.forEach((docData) => {
    //     const data = docData.data();
    //     const dataId = docData.id;
    //     const inventoryId = data.inventory_id;

    //     const ref = doc(db, "inventory", inventoryId);
    //     const inventoryPromise = getDoc(ref).then((inventorySnapshot) => {
    //       if (inventorySnapshot.exists()) {
    //         if (inventorySnapshot.data().type !== "medicines") return;
    //         const inventD = inventorySnapshot.data();
    //         const combined = {
    //           ...data,
    //           info: {
    //             ...inventD,
    //           },
    //           label: inventD.name,
    //           value: dataId,
    //           id: dataId,
    //           isSelected: false,
    //           medDesc: "",
    //         };
    //         medicineWithInfo.push(combined);
    //       }
    //     });
    //     promises.push(inventoryPromise);
    //   });
    //   Promise.all(promises)
    //     .then(() => {
    //       console.log(medicineWithInfo);
    //       setMedicines(medicineWithInfo);
    //       setError(null);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching medicines data", error);
    //       setError(error);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // });
    // return () => unsub();
    fetchData()
  }, []);
  return { medicines, loading, error };
};
