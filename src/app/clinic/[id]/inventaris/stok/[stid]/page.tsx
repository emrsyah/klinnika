"use client";
import * as z from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { inventoryStockFormSchema } from "@/lib/validation/form";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { collection, doc, query, where } from "firebase/firestore";
import { db } from "../../../../../../../lib/firebase";
import { selectableConverterPatient } from "../../../antrian/new/page";
import InputWithLabel from "@/components/InputWithLabel";
import { useStockDataDetail } from "./useStockDataDetail";
import { Label } from "@/components/ui/label";

const InventarisStokDetail = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const stockId = pathname?.split("/")[pathname!.split("/").length - 1];
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const [loading, setLoading] = React.useState<boolean>(false);

  const { stock, loading: loadingStock, error } = useStockDataDetail(stockId!);
  // console.log(stock);

  const inventoryRef = query(
    collection(db, "inventory"),
    where("clinic_id", "==", data?.user?.clinicId)
  ).withConverter(selectableConverterPatient);

  const [inventory, loadingInv, errorInv] = useCollectionData(inventoryRef);

  const form = useForm<z.infer<typeof inventoryStockFormSchema>>({
    resolver: zodResolver(inventoryStockFormSchema),
    defaultValues: {
      stock: {
        desc: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof inventoryStockFormSchema>) => {
    setLoading(true);
    const toastId = toast.loading("Sedang Menambahkan Data...");
    try {
      const formattedInventory = {
        stock: {
          ...values.stock,
        },
        clinicId: data?.user?.clinicId,
      };
      await axios.post("/api/stok", {
        ...formattedInventory,
      });
      toast.success("Berhasil Menambahkan Data", {
        id: toastId,
      });
      router.push(`/${backUrl}`);
    } catch (err: any) {
      toast.error("Gagal Menambahkan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-bold text-xl mrt text-blue-400">
        Detail Stok Inventaris
      </h1>
      <div className="border rounded-sm p-4 flex flex-col w-full gap-2 mt-2">
        <div className="flex flex-col gap-2">
          <h2 className="formSubTitle">Data Stok</h2>
          <Separator />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <InputWithLabel
              label="Inventaris"
              className="col-span-2"
              value={
                loadingStock ? "mengambil data..." : stock?.inventory?.name
              }
            />
            <InputWithLabel
              label="Jumlah"
              className="col-span-1"
              value={loadingStock ? "mengambil data..." : stock?.amount}
            />
            <InputWithLabel
              label="Tanggal"
              className="col-span-1"
              value={
                loadingStock
                  ? "mengambil data..."
                  : dayjs(stock?.expired_at?.toDate()).format("DD MMM YYYY")
              }
            />
            <div className="flex flex-col gap-1 col-span-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={loadingStock ? "mengambil data..." : stock?.desc}
                disabled={true}
                placeholder="Tuliskan deskripsi stok inventaris di sini"
                className="resize-none col-span-2"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventarisStokDetail;
