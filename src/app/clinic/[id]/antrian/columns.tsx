"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ColumnHeader } from "@/components/table/ColumnHeader";
import { dateConverter } from "@/lib/utils";

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
};

export const columns: ColumnDef<Queue>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <ColumnHeader column={column} title="Id" />,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Nama Pasien" />
    ),
  },
  {
    accessorKey: "user.id",
    header: "NIK",
  },
  {
    accessorKey: "user.phone",
    header: "Kontak",
  },
  {
    accessorKey: "type",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Daftar" />
    ),
    cell: ({ row }) => {
      return <div>{dateConverter(row.getValue("createdAt"))}</div>;
    },
  },
];
