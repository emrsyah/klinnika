"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const extractHeaderTitle = (currentPath: string) => {
    if(currentPath === "antrian") return "🗒️ Atur Antrian Pasien"
    if(currentPath === "pasien") return "🗒️ Rekam Medis Pasien"
    if(currentPath === "jadwal-temu") return "🗓️ Jadwal Temu"
    if(currentPath === "analitik") return "📊 Analitik Klinik"
    if(currentPath === "dokter") return "🗓️ Atur Dokter"
    if(currentPath === "inventaris") return "📦 Atur Inventaris"
    if(currentPath === "pembayaran") return "💵 Menu Pembayaran"
    if(currentPath === "integrasi") return "🔗 Integrasi Aplikasi"
}

const HeaderClinic = () => {
  const pathname = usePathname();
  const currentPath = pathname?.split("/")[3];
  return (
    <div className="p-5 h-16 border-b flex items-center justify-between">
      <div className="text-xl font-bold mrt text-blue-900">
        {extractHeaderTitle(currentPath as string)}
      </div>
      <Button size={"icon"} variant={"outline"}>
        <Bell width={20} />
      </Button>
    </div>
  );
};

export default HeaderClinic;
