"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function InventoryLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname?.split("/").slice(0, 3).join("/");
  const params = useParams()
  return (
    <>
      <Tabs className={`mb-2 ${pathname?.includes("new") || params?.invid !== undefined || pathname?.split("/").length === 6 ? "hidden" : ""} `} value={pathname?.includes("stok") ? "stock" : "default"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default" onClick={() => router.push(`${basePath}/inventaris`)}>
            Inventaris
          </TabsTrigger>
          <TabsTrigger
            value="stock"
            onClick={() => router.push(`${basePath}/inventaris/stok`)}          >
            Stok
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </>
  );
}
