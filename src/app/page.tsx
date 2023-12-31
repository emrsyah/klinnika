"use client"
import NextImage from "@/components/NextImage";
import NavUnauthenticated from "@/components/layout/NavUnauthenticated";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import doctor_img from "~/doc_idx.svg";

export default function Home() {
  const router = useRouter()
  return (
    <div className={"mx-12 my-8"}>
      <NavUnauthenticated />
      <main className="max-w-screen-xl mx-auto my-14 flex flex-col items-center gap-2">
        <h1 className="text-7xl font-extrabold text-blue-900 mrt text-center">
          Manajemen <span className="text-blue-500">Klinik</span>
          <br />
          Lebih Mudah
        </h1>
        <p className="font-medium text-gray-500">
          Atur pasien, obat-obatan, dokter, dan lainnya dengan mudah dan gratis!
        </p>
        <Button onClick={() => router.push("login")} className="font-bold text-lg mt-6">
          Upgrade Klinikmu Sekarang, Gratis!
        </Button>
        <NextImage
          src={doctor_img}
          width={360}
          height={360}
          alt="doctor image"
          className="mt-8"
        />
      </main>
    </div>
  );
}
