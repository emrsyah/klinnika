"use client";
import QueueTypeBadge from "@/components/QueueTypeBadge";
import { ColumnHeader } from "@/components/table/ColumnHeader";
import { dateConverter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export type DoctorCol = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "Laki-laki" | "Perempuan";
  createdAt: Date;
};

export const columns: ColumnDef<DoctorCol>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Nama" />,
  },
  {
    accessorKey: "phone",
    header: "No. HP",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const gender: string = row.getValue("gender");
      const variants = gender === "Laki-laki" ? "blue" : "purple"
      return <QueueTypeBadge type={variants}>{gender}</QueueTypeBadge>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <ColumnHeader column={column} title="Dibuat" />,
    cell: ({ row }) => {
      return <div>{dateConverter(row.getValue("created_at"))}</div>;
    },
  },
];
