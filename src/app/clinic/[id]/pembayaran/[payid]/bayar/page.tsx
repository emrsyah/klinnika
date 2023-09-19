"use client";
import * as React from "react";
import { QueueOptionType, colourStyles } from "@/config/styles";
import { useParams, usePathname } from "next/navigation";
import InputWithLabel from "@/components/InputWithLabel";
import {
  dateConverterAppointment,
  dateConverterCreatedAt,
  rupiahConverter,
} from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useQueueDataById } from "../../../antrian/[aid]/useQueueDataById";
import { useMedicalRecordDataDetail } from "./useMedicalRecordDataDetail";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const queueOptions: QueueOptionType[] = [
  {
    color: "#CA8A04",
    label: "Menunggu",
    value: "Menunggu",
  },
  {
    color: "#9333EA",
    label: "Dalam Proses",
    value: "Dalam Proses",
  },
  {
    color: "#2563EB",
    label: "Selesai Proses",
    value: "Selesai Proses",
  },
  {
    color: "#16A34A",
    label: "Bayar",
    value: "Bayar",
  },
];

const PembayaranProcessPage = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const params = useParams();
  const payid = params!.payid as string;
  const { queue, loading, error, selectedType } = useQueueDataById(payid);
  const {
    combinedData,
    error: errMedRec,
    loading: loadingMedRec,
  } = useMedicalRecordDataDetail({ queueId: payid });
  const [loadingMutate, setLoadingMutate] = React.useState<boolean>(false)
  const [paymentType, setPaymentType] = React.useState<
    "Langsung" | "Bank" | "Lainnya"
  >("Langsung");

  const submitHandler = async () => {
    setLoadingMutate(true);
    const toastId = toast.loading("Sedang Menambahkan Data...");
    try {
      const medicalSubTotal = combinedData?.medical?.medicals?.reduce(
        (acc: any, item: any) => {
          if (item.price !== undefined) {
            return acc + item.price * item.quantity;
          }
          return acc;
        },
        0
      );
      const totalPayment = medicalSubTotal + combinedData?.doctor?.price;

      const formatted = {
        queue_id: payid,
        total: totalPayment,
        doctor_payment: combinedData?.doctor?.price,
        medical_payment: medicalSubTotal,
        medicals: combinedData?.medical?.medicals,
        medical_id: combinedData?.medical?.id,
        is_pay: true,
        clinic_id: params!.id as string,
        payment_type: paymentType,
      };

      await axios.post("/api/transaksi", formatted);

      await axios.patch("/api/antrian-status", {
        id: payid,
        type: "Bayar"
      })

      toast.success("Berhasil Menambahkan Data", {
        id: toastId,
      });
      router.push(`/${backUrl}`);
    } catch (err: any) {
      toast.error("Gagal Menambahkan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoadingMutate(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ) : null} */}
      <div className="flit justify-between">
        <h1 className="font-bold text-xl mrt text-blue-400">ID-{payid}</h1>
      </div>
      <div className="flex gap-4">
        <div className="grow-[5] flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 rounded-md p-4 border">
            <h1 className="formSubTitle col-span-2">Data Antrian</h1>
            <Separator className="col-span-2 w-full" />
            <InputWithLabel
              label="Nomor Urut"
              value={queue ? queue.order_number ?? "-" : "-"}
              loading={loading}
            />
            <InputWithLabel label="ID" value={payid!} loading={loading} />
            <InputWithLabel
              label="Waktu Daftar"
              value={
                queue ? dateConverterCreatedAt(queue.created_at) ?? "-" : "-"
              }
              loading={loading}
            />
            <InputWithLabel
              label="Tanggal Janji"
              value={
                queue
                  ? dateConverterAppointment(queue.appointment_date) ?? "-"
                  : "-"
              }
              loading={loading}
            />
            <InputWithLabel
              label="Dokter"
              value={queue ? `Dr. ${queue.doctor.name}` ?? "-" : "-"}
              loading={loading}
            />
            <InputWithLabel
              label="Tipe Keluhan"
              value={queue ? queue.complaint_type.join(", ") ?? "-" : "-"}
              loading={loading}
            />
            <div className="flex flex-col w-full col-span-2 gap-1.5">
              <Label htmlFor="email">Deskripsi</Label>
              <Textarea
                value={queue ? queue.complaint_desc ?? "-" : "-"}
                disabled={true}
                className="text-gray-800 w-full !opacity-90"
              />
            </div>{" "}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 rounded-md p-4 border">
            <h1 className="formSubTitle">Data Pasien</h1>
            <Separator />
            <InputWithLabel
              label="Nama"
              value={queue ? queue.patient.name ?? "-" : "-"}
              loading={loading}
            />
            <InputWithLabel
              label="Gender"
              value={queue ? queue.patient.gender ?? "-" : "-"}
              loading={loading}
            />
            <InputWithLabel
              label="Nomor Telepon"
              value={queue ? queue.patient.phone ?? "-" : "-"}
              loading={loading}
            />
            <InputWithLabel
              label="NIK"
              value={queue ? queue.patient.nik ?? "-" : "-"}
              loading={loading}
            />
            <InputWithLabel
              label="Email"
              value={queue ? queue.patient.email ?? "-" : "-"}
              loading={loading}
            />
          </div>
          {/* <div className="grid grid-cols-2 gap-x-2 gap-y-3 rounded-md p-4 border">
            
          </div> */}
        </div>
        <div className="p-4 border grow-[3] h-fit flex flex-col gap-2 rounded-md">
          {/* BAYAR DISINI */}
          <h1 className="formSubTitle">Ringkasan Pembayaran</h1>
          <Separator className="mb-3" />
          {loadingMedRec ? (
            <div>Mengambil data...</div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flit justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="font-semibold mrt text-blue-600">
                    Fee Dookter
                  </h1>
                  <p className="font-medium text-gray-500 text-sm">
                    {combinedData?.doctor?.name} |{" "}
                    {rupiahConverter(combinedData?.doctor?.price)}
                  </p>
                </div>
                <h3 className="font-semibold text-gray-700">
                  {rupiahConverter(combinedData?.doctor?.price)}
                </h3>
              </div>

              {combinedData?.medical?.medicals?.map((m: any) => (
                <div key={m.id} className="flit justify-between">
                  <div className="flex flex-col gap-1">
                    <h1 className="font-semibold mrt text-blue-600">
                      {m.name}
                    </h1>
                    <p className="font-medium text-gray-500 text-sm">
                      {m.quantity} x {rupiahConverter(m.price)}
                    </p>
                  </div>
                  <h3 className="font-semibold text-gray-700">
                    {rupiahConverter(m.quantity * m.price)}
                  </h3>
                </div>
              ))}

              <div className="flit justify-between">
                <h3 className="font-semibold text-gray-600">Total</h3>
                <h3 className="font-semibold text-blue-600">
                  {rupiahConverter(
                    combinedData?.medical?.medicals?.reduce(
                      (acc: any, item: any) => {
                        if (item.price !== undefined) {
                          return acc + item.price * item.quantity;
                        }
                        return acc;
                      },
                      0
                    ) + combinedData?.doctor?.price
                  )}
                </h3>
              </div>
            </div>
          )}
          <Separator />
          {/* Select Disini */}
          <Select
            value={paymentType}
            disabled={loadingMutate}
            onValueChange={(val) =>
              setPaymentType(val as "Langsung" | "Bank" | "Lainnya")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Langsung">Langsung</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          <Separator />
          <Button
            onClick={submitHandler}
            type="button"
            disabled={loadingMedRec || loading || loadingMutate}
          >
            Konfirmasi & Bayar
          </Button>
          {/* {
    "expired_at": {
        "seconds": 1694970000,
        "nanoseconds": 739000000
    },
    "id": "UMzUu6N4LRU0rJJnDLiP",
    "inventory_id": "EWHUHFG07VExfQt6ZCzH",
    "quantity": 1,
    "desc": "",
    "price": 3000,
    "name": "Tolak Angin"
} */}
        </div>
      </div>
    </div>
  );
};

export default PembayaranProcessPage;
