"use client";
import { DataTable } from "@/components/table/DataTable";
import { db } from "../../../../../lib/firebase";
import { DocumentData, collection, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { columns } from "./column";
import { mappingToArray } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

const DokterPage = () => {
  const { data } = useSession();
  const [doctor, loading, error] = useCollection(
    query(
      collection(db, "user"),
      where("role", "==", "doctor"),
      where("clinic_id", "==", data?.user?.clinicId),
      orderBy("created_at", "desc")
    )
  );
  return (
    <div>
      <DataTable
        isLoading={loading}
        isError={error ? error.message : ""}
        filterLabel="nama dokter"
        filterValue="name"
        columns={columns as ColumnDef<DocumentData, unknown>[]}
        data={mappingToArray({ data: doctor }) ?? []}
      />
    </div>
  );
};

export default DokterPage;
