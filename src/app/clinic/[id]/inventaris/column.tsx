"use client";
import QueueTypeBadge from "@/components/QueueTypeBadge";
import { ColumnHeader } from "@/components/table/ColumnHeader";
import { dateConverter, rupiahConverter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type InventoryCol = {
  id: string;
  name: string;
  type: "medicines" | "non-medicines";
  price: number;
  unit_type: "tablet" | "pcs" | "pill" | "botol";
  createdAt: Date;
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
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Nama" />,
  },
  {
    accessorKey: "type",
    header: "Tipe",
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({row}) => {
        return <>{rupiahConverter(row.getValue("price"))}</>
    }
  },
  {
    accessorKey: "desc",
    header: "Deskripsi",
    cell: ({row}) => {
        return <div className="line-clamp-1">{row.getValue("desc") !== "" ? row.getValue("desc") : "-"}</div>
    }
  },
  {
    accessorKey: "unit_type",
    header: "Satuan",
    cell: ({ row }) => {
      const unit_type: string = row.getValue("unit_type");
      const variants = unit_type === "tablet" ? "blue" : unit_type === "pcs" ? "purple" : unit_type === "pill" ? "green" : "red"
      return <QueueTypeBadge type={variants}>{unit_type}</QueueTypeBadge>;
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
