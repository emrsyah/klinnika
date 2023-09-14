"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { QueueOptionType, colourStyles } from "@/config/styles";
import { usePathname } from "next/navigation";
import ReactSelect from "react-select";
import { useQueueDataById } from "./useQueueDataById";
import InputWithLabel from "@/components/InputWithLabel";
import { dateConverterAppointment, dateConverterCreatedAt } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChangeProgressConfirmationDialog } from "@/components/ChangeProgressConfirmationDialog";
import { FinishFormSheet } from "@/components/FinishFormSheet";
import { Separator } from "@/components/ui/separator";
import { useMedicinesData } from "./useMedicinesData";
import { useSession } from "next-auth/react";

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

const AntrianDetail = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const queueId = pathname?.split("/")[pathname!.split("/").length - 1];
  const { queue, loading, error, selectedType } = useQueueDataById(queueId!);
  const {
    medicines,
    error: erroMed,
    loading: loadingMed,
  } = useMedicinesData(data!.user!.clinicId);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const [nextSelected, setNextSelected] = React.useState(queueOptions[0].value);

  const typeChangeHandler = (val: any) => {
    if (val.value === selectedType.value) return;
    if (val.value === "Selesai Proses") {
      setOpenSheet(true);
      return;
    }
    setNextSelected(val.value);
    setOpenDialog(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {selectedType.value === "Selesai Proses" ? (
        <div className="p-3 font-medium rounded border-2 border-blue-800 bg-blue-100 text-blue-900">
          Untuk Melanjutkan Proses {` "Selesai Proses" `}, Ada di Menu
          Pembayaran
        </div>
      ) : null}
      <ChangeProgressConfirmationDialog
        current={selectedType.value}
        next={nextSelected}
        open={openDialog}
        setOpen={setOpenDialog}
      />
      {/* {loadingMed ? ( */}
      <FinishFormSheet
        data={medicines}
        loading={loadingMed}
        open={openSheet}
        setOpen={setOpenSheet}
      />
      {/* ) : null} */}
      <div className="flit justify-between">
        <h1 className="font-bold text-xl mrt text-blue-400">ID-{queueId}</h1>
        <div className="flit gap-2">
          <ReactSelect
            isDisabled={loading || selectedType.value === "Selesai Proses"}
            isClearable={false}
            isSearchable={false}
            value={selectedType}
            isOptionDisabled={(option) => option.value === "Bayar"}
            onChange={typeChangeHandler}
            defaultValue={selectedType}
            styles={colourStyles}
            options={queueOptions}
            className="font-medium w-fit"
          />
          <Button
            variant={"destructive"}
            disabled={loading || selectedType.value === "Selesai Proses"}
            type="button"
            size={"sm"}
          >
            Batalkan Antrian
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="p-4 border grid grid-cols-2 grow-[5] gap-x-2 gap-y-3  rounded-md">
          <h1 className="formSubTitle col-span-2">Data Antrian</h1>
          <Separator className="col-span-2 w-full" />
          <InputWithLabel
            label="Nomor Urut"
            value={queue ? queue.order_number ?? "-" : "-"}
            loading={loading}
          />
          <InputWithLabel label="ID" value={queueId!} loading={loading} />
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
        <div className="p-4 border grow-[3] flex flex-col gap-2 rounded-md">
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
      </div>
    </div>
  );
};

export default AntrianDetail;
