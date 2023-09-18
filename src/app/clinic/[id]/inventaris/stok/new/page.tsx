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
import ReactSelect from 'react-select'
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
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "../../../../../../../lib/firebase";
import { selectableConverterPatient } from "../../../antrian/new/page";

const InventarisStokNew = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const [loading, setLoading] = React.useState<boolean>(false);

  const inventoryRef = query(
    collection(db, "inventory"),
    where("clinic_id", "==", data?.user?.clinicId)
  ).withConverter(selectableConverterPatient);

  const [inventory, loadingInv, errorInv] = useCollectionData(inventoryRef)

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
        Tambah Stok Inventaris Baru
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-sm p-4 flex flex-col w-full gap-2 mt-2"
        >
          <div className="flex flex-col gap-2">
            <h2 className="formSubTitle">Data Stok</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                control={form.control}
                name="stock.inventory_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Pilih Inventaris<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ReactSelect
                        isDisabled={loadingInv || loading}
                        placeholder={
                          loadingInv ? "Mengambil data..." : "Pilih Inventaris"
                        }
                        onChange={(val) => field.onChange(val)}
                        options={inventory}
                        isClearable
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="stock.amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Jumlah<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="number"
                        {...field}
                        onChange={(ev) =>
                          field.onChange(ev.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="stock.expired_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 justify-end">
                    <FormLabel>
                      Kadaluarsa<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger disabled={loading} asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("DD MMM, YYYY")
                            ) : (
                              <span>Pilih Tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <input
                          disabled={loading}
                          type="date"
                          className="datepicker-input"
                          value={
                            field.value
                              ? dayjs(field.value).format("YYYY-MM-DD")
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              dayjs(e.currentTarget.value).toDate()
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="stock.desc"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Tuliskan deskripsi stok inventaris di sini"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tambahkan deskripsi stok inventaris di atas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button className="mt-3" disabled={loading}>
            Konfirmasi & Tambahkan
          </Button>
        </form>
      </Form>
    </>
  );
};

export default InventarisStokNew;
