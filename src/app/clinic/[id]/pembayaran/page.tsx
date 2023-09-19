"use client";
import React from "react";
import { DataTable } from "@/components/table/DataTable";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { columns } from "./column";
import { usePaymentData } from "./usePaymentData";

const Pembayaran = () => {
  const { data } = useSession();
  const params = useSearchParams();
  const extractParams = params?.get("mode")
    ? params.get("mode") === "focus" || params.get("mode") === "all"
      ? (params.get("mode") as string)
      : "focus"
    : "focus";
  const { combinedData, error, loading } = usePaymentData({
    params: extractParams,
    clinicId: data!.user!.clinicId,
  });

  return (
    <div>
      <DataTable
        focusMode
        isLoading={loading}
        isError={error ? error : ""}
        isBayar
        filterLabel="nama pasien"
        filterValue="patient_name"
        columns={columns}
        dontShowAdd={true}
        data={combinedData}
      />
    </div>
  );
};

export default Pembayaran;
