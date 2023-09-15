import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import * as React from 'react'

export const usePatientData = () => {
    const [patients, setPatients] = React.useState<any[]>([])
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    const q = query(collection(db, "patient"))

    React.useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if(snapshot.empty) return
            setPatients(snapshot.docs)
        })
        return () => unsubscribe()
    }, [])

}