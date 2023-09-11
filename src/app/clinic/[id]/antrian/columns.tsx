"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ColumnHeader } from "@/components/table/ColumnHeader";
import { dateConverter, dateConverterAppointment } from "@/lib/utils";
import QueueTypeBadge from "@/components/QueueTypeBadge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Queue = {
  id: string;
  name: string;
  nik: string;
  phone: string;
  status:
    | "Bayar"
    | "Selesai"
    | "Dalam Proses"
    | "Menunggu"
    | "Menunggu Pembayaran"
    | "Scheduled";
  createdAt: string;
  appointmentDate: string;
};

export const columns: ColumnDef<Queue>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <ColumnHeader column={column} title="Id" />,
    cell: ({ row }) => {
      const id: string = row.getValue("id")
      return <div>{`${id.slice(0, 10)}...`}</div>;
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Nama Pasien" />
    ),
  },
  // {
  //   accessorKey: "user.nik",
  //   header: "NIK",
  // },
  {
    accessorKey: "user.phone",
    header: "Kontak",
  },
  {
    accessorKey: "type",
    header: "Status",
    cell: ({ row }) => {
      const type: string = row.getValue("type");
      const variants = type === "Menunggu" ? "yellow" : type === "Bayar" ? "green" : type === "Batal" ? "red" : type === "Dalam Proses" ? "purple" : "blue"
      return <QueueTypeBadge type={variants} >{type}</QueueTypeBadge>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <ColumnHeader column={column} title="Daftar" />,
    cell: ({ row }) => {
      return <div>{dateConverter(row.getValue("created_at"))}</div>;
    },
  },
  {
    accessorKey: "appointment_date",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Tanggal Janji" />
    ),
    cell: ({ row }) => {
      return (
        <div>{dateConverterAppointment(row.getValue("appointment_date"))}</div>
      );
    },
  },
];
