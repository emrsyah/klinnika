"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/table/ColumnHeader";
import {
  dateConverter,
  dateConverterAppointment,
  queueTypeToColorConverter,
} from "@/lib/utils";
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
    accessorKey: "order_number",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Nomor Antrian" />
    ),
    cell: ({ row }) => {
      const docName: string = row.getValue("doctor_name");
      return (
        <div className="flit px-3 py-2 w-fit text-blue-800 whitespace-nowrap rounded-full bg-blue-100">
          {row.getValue("order_number")} | Dr. {docName?.split(" ")[0]}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Id" className="hidden" />
    ),
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <div className="hidden">{id}</div>;
    },
  },
  {
    accessorKey: "patient.name",
    header: ({ column }) => <ColumnHeader column={column} title="Nama" />,
  },
  {
    accessorKey: "patient.phone",
    header: "Kontak",
  },
  {
    accessorKey: "type",
    header: "Status",
    cell: ({ row }) => {
      const type: string = row.getValue("type");
      const variants = queueTypeToColorConverter(type);
      return <QueueTypeBadge type={variants}>{type}</QueueTypeBadge>;
    },
  },
  {
    accessorKey: "doctor.name",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Id" className="hidden" />
    ),
    cell: ({ row }) => {
      const docName: string = row.getValue("doctor_name");
      return <span className="line-clamp-1 hidden">{`Dr. ${docName}`}</span>;
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
