"use client";
import React from "react";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { useQueueData } from "./useQueueData";
import { useSearchParams } from "next/navigation";
// import useQueueData from "./useQueueData";

const ClinicApp = () => {
  const { data: session } = useSession();
  const params = useSearchParams()
  // const [value, loading, error] = useCollectionData(collection(db, "queue"));
  // const queueData = await collection
  const {combinedData, error, loading} = useQueueData(params?.get("mode") ? (params.get("mode") === "focus" || params.get("mode") === "all" ? params.get("mode") as string : "focus") : "focus")

  return (
    <div>
      <DataTable
        isLoading={loading}
        isError={error ? error : ""}
        filterLabel="nama pasien"
        filterValue="user.name"
        columns={columns}
        data={combinedData}
      />
    </div>
  );
};

export default ClinicApp;
