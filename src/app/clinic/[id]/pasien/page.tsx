"use client";
import { DataTable } from "@/components/table/DataTable";
import { db } from "../../../../../lib/firebase";
import { DocumentData, collection, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React from "react";
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore";
import { columns } from "./column";
import { ColumnDef } from "@tanstack/react-table";
import { mappingToArray } from "@/lib/utils";

const Pasien = () => {
  const { data } = useSession();
  const [patients, loading, error] = useCollection(
    query(
      collection(db, "patient"),
      where("clinic_id", "==", data?.user?.clinicId),
      orderBy("created_at", "desc")
    ),
  );
  return (
    <div>
      <DataTable
        isLoading={loading}
        isError={error ? error.message : ""}
        filterLabel="nama pasien"
        filterValue="name"
        columns={columns as ColumnDef<DocumentData, unknown>[]}
        data={mappingToArray({data: patients}) ?? []}
      />
    </div>
  );
};

export default Pasien;
