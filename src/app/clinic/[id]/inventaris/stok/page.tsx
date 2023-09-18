"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./column";
import { useInventoryStock } from "./useInventoryStockData";

const InventoryStock = () => {
  const { data } = useSession();
  const { medicines, loading, error } = useInventoryStock(data?.user?.clinicId!);
  return (
    <>
      <DataTable
        isLoading={loading}
        isError={error ?? ""}
        filterLabel="nama inventaris"
        filterValue="info_name"
        columns={columns}
        data={medicines}
      />
    </>
  );
};

export default InventoryStock;
