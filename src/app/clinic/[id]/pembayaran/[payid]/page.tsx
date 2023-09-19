"use client";
import * as React from "react";
import {
  FirestoreDataConverter,
  collection,
  query,
  where,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../../../../../lib/firebase";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMedicalRecordDataDetail } from "./bayar/useMedicalRecordDataDetail";
import { Separator } from "@/components/ui/separator";
import TransaksiSubDetail from "@/components/TransaksiSubDetail";
import { rupiahConverter } from "@/lib/utils";
import { usePaymentDataDetail } from "./usePaymentDataDetail";
import { useQueueDataById } from "../../antrian/[aid]/useQueueDataById";
import dayjs from "dayjs";

interface Selectable {
  data: any;
  id: string;
}

export const selectableConverter: FirestoreDataConverter<Selectable> = {
  toFirestore(patientSelectable: WithFieldValue<Selectable>): DocumentData {
    return { data: patientSelectable.data, id: patientSelectable.id };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Selectable {
    const data = snapshot.data(options);
    return {
      // id: snapshot.id,
      data: { ...data },
      id: snapshot.id,
    };
  },
};

const PembayaranDetail = () => {
  const params = useParams();
  const router = useRouter();
  // const [txn, loadingTxn, errorTxn] = useCollectionData(
  //   query(collection(db, "transaction"), where("queue_id", "==", params!.payid))
  // );

  const {
    data,
    error: errorTxn,
    loading: loadingTxn,
  } = usePaymentDataDetail(params!.payid as string);

  React.useEffect(() => {
    if (!loadingTxn && data == null) {
      router.back();
    }
  }, [data, loadingTxn]);

  const { combinedData: medicalRecord, error, loading } = useMedicalRecordDataDetail({
    queueId: params!.payid as string,
  });

  const {queue, loading: loadingQueue, error: errorQueue} = useQueueDataById(params!.payid as string)

  // console.log(medicalRecord)

  if (loading || loadingTxn || loadingQueue) {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="border rounded-md flex flex-col gap-3 p-3">
        <h1 className="formSubTitle">Data Transaksi</h1>
        <Separator className="mb-1" />
        <TransaksiSubDetail label={"Status"} value={"Selesai"} />
        <TransaksiSubDetail label={"ID Transaksi"} value={data.id} />
        <Separator />
        <TransaksiSubDetail
          label={"Sub Bayar: Dokter"}
          value={rupiahConverter(data.doctor_payment)}
        />
        <TransaksiSubDetail
          label={"Sub Bayar: Obat"}
          value={rupiahConverter(data.medical_payment)}
        />
        <TransaksiSubDetail
          label={"Total Pembayaran"}
          value={rupiahConverter(data.total)}
        />
      </div>
      <div className="border rounded-md flex flex-col gap-3 p-3">
        <h1 className="formSubTitle">Data Obat</h1>
        <Separator className="mb-1" />
        {data.medicals.map((m: any, i: number) => (
        <TransaksiSubDetail key={i} label={m.name} value={rupiahConverter(m.price * m.quantity)} />
        ))}
      </div>
      <div className="border rounded-md flex flex-col gap-3 p-3">
        <h1 className="formSubTitle">Data Antrian</h1>
        <Separator className="mb-1" />
        <TransaksiSubDetail label={"ID Antrian"} value={params!.payid as string} />
        <TransaksiSubDetail label={"Nomor Antrian"} value={queue?.order_number} />
        <TransaksiSubDetail label={"Nama Pasien"} value={queue?.patient?.name} />
        <TransaksiSubDetail label={"Nomor Telepon"} value={queue?.patient?.phone} />
        <TransaksiSubDetail label={"Dokter"} value={queue?.doctor?.name} />
        <TransaksiSubDetail label={"Tanggal Temu"} value={dayjs(queue?.appointment_date?.toDate()).format("DD MMM YYYY")} />
        <TransaksiSubDetail label={"Dibuat Pada"} value={dayjs(queue?.created_at?.toDate()).format("DD MMM YYYY")} />
      </div>
      <div className="border rounded-md flex flex-col gap-3 p-3">
        <h1 className="formSubTitle">Data Medical Record</h1>
        <Separator className="mb-1" />
        <TransaksiSubDetail label={"Tindakan"} value={medicalRecord?.act_type} />
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-400">Diagnosa:</h3>
          <p className="text-blue-500 font-medium">{medicalRecord?.diagnose ?? "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default PembayaranDetail;
