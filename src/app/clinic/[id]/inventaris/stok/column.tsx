"use client";
import QueueTypeBadge from "@/components/QueueTypeBadge";
import { ColumnHeader } from "@/components/table/ColumnHeader";
import { dateConverter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday)

export type InventoryCol = {
  id: string;
  name: string;
  desc: string;
  amount: number;
  expired_at: Date;
  created_at: Date;
};

export const columns: ColumnDef<InventoryCol>[] = [
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
    accessorKey: "info.name",
    header: ({ column }) => <ColumnHeader column={column} title="Nama" />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <ColumnHeader column={column} title="Jumlah" />,
  },
  {
    accessorKey: "desc",
    header: "Deskripsi",
    cell: ({row}) => {
        return <div className="line-clamp-1">{row.getValue("desc") !== "" ? row.getValue("desc") : "-"}</div>
    }
  },
  {
    accessorKey: "expired_at",
    header: ({ column }) => <ColumnHeader column={column} title="Kadaluarsa" />,
    cell: ({ row }) => {
      const exp: any = row.getValue("expired_at");
      const today = new Date()
      today.setHours(0)
      const isExpire = dayjs(exp.toDate()).isToday() || exp.toDate() < today
      return <div className={`${isExpire ? "text-red-500 font-medium" : ""}`}>{dayjs(exp.toDate()).format("DD MMM YYYY")}{isExpire ? " !!!" : ""}</div>;
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
