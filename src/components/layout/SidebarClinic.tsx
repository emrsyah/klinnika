"use client";
import React from "react";
import ClinicIcon from "@/components/ClinicIcon";
import {
  Archive,
  Banknote,
  BarChart3,
  Blocks,
  CalendarDays,
  Heart,
  ScrollText,
  UserSquare2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainSidebar = [
  {
    name: "Antrian",
    href: "antrian",
    icon: "",
    role: ["superadmin", "admin"],
  },
  {
    name: "Pasien",
    href: "pasien",
    icon: "",
    role: ["superadmin", "admin", "doctor"],
  },
  {
    name: "Jadwal Temu",
    href: "jadwal-temu",
    icon: "",
    role: ["superadmin", "admin", "doctor"],
  },
  {
    name: "Analitik",
    href: "analitik",
    icon: "",
    role: ["superadmin", "admin", "owner"],
  },
];

const additionalSidebar = [
  {
    name: "Dokter",
    href: "dokter",
    icon: "",
    role: ["superadmin", "admin"],
  },
  {
    name: "Inventaris",
    href: "inventaris",
    icon: "",
    role: ["superadmin", "admin", "pharmacist"],
  },
  {
    name: "Pembayaran",
    href: "pembayaran",
    icon: "",
    role: ["superadmin", "admin", "cashier"],
  },
  {
    name: "Integrasi",
    href: "integrasi",
    icon: "",
    role: ["superadmin", "admin"],
  },
];

const extractIcon = (name: string) => {
  if (name === "Antrian") return <ScrollText width={20} />;
  if (name === "Pasien") return <UserSquare2 width={20} />;
  if (name === "Jadwal Temu") return <CalendarDays width={20} />;
  if (name === "Analitik") return <BarChart3 width={20} />;
  if (name === "Dokter") return <Heart width={20} />;
  if (name === "Inventaris") return <Archive width={20} />;
  if (name === "Pembayaran") return <Banknote width={20} />;
  if (name === "Integrasi") return <Blocks width={20} />;
};

const SidebarClinic = () => {
  const pathname = usePathname();
  const currentPath = pathname?.split("/")[3];
  return (
    <nav className="min-h-screen py-6 border-r w-60 flex flex-col">
      <div className="border-b px-6 pb-4">
        <ClinicIcon name="Klk Margahayu" />
      </div>

      <div className="flex flex-col pl-6 py-4 gap-4">

        {/* MAIN SIDEBAR */}
        <div className="flex flex-col gap-[2px] text-sm">
        <h1 className="font-semibold mrt text-gray-400">Main</h1>
          {mainSidebar.map((sidebar) => (
            <Link
              key={sidebar.name}
              href={sidebar.href}
              className={`flit gap-3 mrt font-semibold p-3 cursor-pointer rounded-bl rounded-tl ${
                sidebar.href === currentPath
                  ? "text-blue-900 bg-blue-50"
                  : "bg-white text-gray-500"
              }`}
            > 
              {extractIcon(sidebar.name)}
              {sidebar.name}
            </Link>
          ))}
        </div>

        {/* ADDITIONAL SIDEBAR */}
        <div className="flex flex-col gap-[2px] text-sm">
        <h1 className="font-semibold mrt text-gray-400">Tambahan</h1>
          {additionalSidebar.map((sidebar) => (
            <Link
              key={sidebar.name}
              href={sidebar.href}
              className={`flit gap-3 mrt font-semibold p-3 cursor-pointer rounded-bl rounded-tl ${
                sidebar.href === currentPath
                  ? "text-blue-900 bg-blue-50"
                  : "bg-white text-gray-500"
              }`}
            >
              {extractIcon(sidebar.name)}
              {sidebar.name}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default SidebarClinic;
