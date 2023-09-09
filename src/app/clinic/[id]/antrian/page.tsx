"use client"
import React from "react";
import { DataTable } from "@/components/table/DataTable";
import { Queue, columns } from "./columns";
import { useSession } from "next-auth/react";

const data: Queue[] = [
  {
    id: "1",
    name: "John Doe",
    nik: "1234567890",
    phone: "555-123-4567",
    status: "Bayar",
    createdAt: "2023-09-05T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    nik: "0987654321",
    phone: "555-987-6543",
    status: "Selesai",
    createdAt: "2023-09-05T11:15:00.000Z",
  },
  {
    id: "3",
    name: "Alice Johnson",
    nik: "5678901234",
    phone: "555-567-8901",
    status: "Dalam Proses",
    createdAt: "2023-09-05T12:30:00.000Z",
  },
  {
    id: "4",
    name: "Bob Wilson",
    nik: "4321098765",
    phone: "555-432-1098",
    status: "Menunggu",
    createdAt: "2023-09-05T14:45:00.000Z",
  },
  {
    id: "5",
    name: "Eva Brown",
    nik: "6543210987",
    phone: "555-654-3210",
    status: "Menunggu Pembayaran",
    createdAt: "2023-09-05T16:00:00.000Z",
  },
  {
    id: "6",
    name: "Grace Lee",
    nik: "7890123456",
    phone: "555-789-0123",
    status: "Bayar",
    createdAt: "2023-09-05T17:15:00.000Z",
  },
  {
    id: "7",
    name: "Michael Davis",
    nik: "9876543210",
    phone: "555-987-6543",
    status: "Selesai",
    createdAt: "2023-09-05T18:30:00.000Z",
  },
  {
    id: "8",
    name: "Sophia Martinez",
    nik: "2345678901",
    phone: "555-234-5678",
    status: "Dalam Proses",
    createdAt: "2023-09-05T19:45:00.000Z",
  },
  {
    id: "9",
    name: "Liam Johnson",
    nik: "5432109876",
    phone: "555-543-2109",
    status: "Menunggu",
    createdAt: "2023-09-05T21:00:00.000Z",
  },
  {
    id: "10",
    name: "Olivia Smith",
    nik: "1234567890",
    phone: "555-123-4567",
    status: "Menunggu Pembayaran",
    createdAt: "2023-09-05T22:15:00.000Z",
  },
  {
    id: "11",
    name: "Noah Taylor",
    nik: "0987654321",
    phone: "555-987-6543",
    status: "Bayar",
    createdAt: "2023-09-05T23:30:00.000Z",
  },
  {
    id: "12",
    name: "Emma Wilson",
    nik: "5678901234",
    phone: "555-567-8901",
    status: "Selesai",
    createdAt: "2023-09-06T00:45:00.000Z",
  },
  {
    id: "13",
    name: "William Brown",
    nik: "4321098765",
    phone: "555-432-1098",
    status: "Dalam Proses",
    createdAt: "2023-09-06T02:00:00.000Z",
  },
  {
    id: "14",
    name: "Ava Miller",
    nik: "6543210987",
    phone: "555-654-3210",
    status: "Menunggu",
    createdAt: "2023-09-06T03:15:00.000Z",
  },
  {
    id: "15",
    name: "James Anderson",
    nik: "7890123456",
    phone: "555-789-0123",
    status: "Menunggu Pembayaran",
    createdAt: "2023-09-06T04:30:00.000Z",
  },
  {
    id: "16",
    name: "Mia Garcia",
    nik: "9876543210",
    phone: "555-987-6543",
    status: "Bayar",
    createdAt: "2023-09-06T05:45:00.000Z",
  },
  {
    id: "17",
    name: "Benjamin Hernandez",
    nik: "2345678901",
    phone: "555-234-5678",
    status: "Selesai",
    createdAt: "2023-09-06T07:00:00.000Z",
  },
  {
    id: "18",
    name: "Charlotte Clark",
    nik: "5432109876",
    phone: "555-543-2109",
    status: "Dalam Proses",
    createdAt: "2023-09-06T08:15:00.000Z",
  },
  {
    id: "19",
    name: "Henry Turner",
    nik: "1234567890",
    phone: "555-123-4567",
    status: "Menunggu",
    createdAt: "2023-09-06T09:30:00.000Z",
  },
  {
    id: "20",
    name: "Chloe Rodriguez",
    nik: "0987654321",
    phone: "555-987-6543",
    status: "Menunggu Pembayaran",
    createdAt: "2023-09-06T10:45:00.000Z",
  },
];

const ClinicApp = () => {
  const {data: session} = useSession()
  console.log(session)
  return (
    <div>
      <DataTable filterLabel="nama pasien" filterValue="name" columns={columns} data={data} />
    </div>
  );
};

export default ClinicApp;
