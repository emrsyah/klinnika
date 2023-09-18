"use client";
import { DataTable } from "@/components/table/DataTable";
import {
  DocumentData,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../../../lib/firebase";
import { columns } from "./column";
import { ColumnDef } from "@tanstack/react-table";
import { mappingToArray } from "@/lib/utils";

const InventarisPage = () => {
  const { data } = useSession();
  const [inventory, loading, error] = useCollection(
    query(
      collection(db, "inventory"),
      where("clinic_id", "==", data?.user?.clinicId),
      orderBy("created_at", "desc")
    )
  );

  return (
    <>
      <DataTable
        isLoading={loading}
        isError={error ? error.message : ""}
        filterLabel="nama inventaris"
        filterValue="name"
        columns={columns as ColumnDef<DocumentData, unknown>[]}
        data={mappingToArray({ data: inventory }) ?? []}
      />
    </>
  );
};

export default InventarisPage;
