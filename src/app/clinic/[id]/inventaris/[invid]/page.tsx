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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { inventoryFormSchema } from "@/lib/validation/form";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../../../../lib/firebase";

const InventarisDetail = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const invId = pathname?.split("/")[pathname!.split("/").length - 1];
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [inventory, loadingInv, errorInv] = useDocumentData(doc(db, "inventory", invId!))
  // console.log(inventory)

  const form = useForm<z.infer<typeof inventoryFormSchema>>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      inventory: {
        desc: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof inventoryFormSchema>) => {
    setLoading(true);
    const toastId = toast.loading("Sedang Menyimpan Data...");
    try {
      const formattedInventory = {
        inventory: {
          ...values.inventory,
        },
        id: invId
      };
      await axios.patch("/api/inventaris", {
        ...formattedInventory,
      });
      toast.success("Berhasil Menyimpan Data", {
        id: toastId,
      });
      router.push(`/${backUrl}`);
    } catch (err: any) {
      toast.error("Gagal Menyimpan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if(loadingInv){
    return<>Loading...</>
  }

  return (
    <>
      <h1 className="font-bold text-xl mrt text-blue-400">
        Detail Inventaris
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-sm p-4 flex flex-col w-full gap-2 mt-2"
        >
          <div className="flex flex-col gap-2">
            <h2 className="formSubTitle">Inventaris</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                disabled={loading}
                control={form.control}
                name="inventory.name"
                defaultValue={inventory ? inventory!.name : ""}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Nama<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        // value={field.value}
                        disabled={loading}
                        placeholder="nama inventaris"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="inventory.type"
                defaultValue={inventory ? inventory!.type : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Tipe<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      //   defaultValue={"Hari Ini"}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="medicines">Obat-obatan</SelectItem>
                        <SelectItem value="non-medicines">
                          Non Obat-obatan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="inventory.unit_type"
                defaultValue={inventory ? inventory!.unit_type : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Jenis Satuan<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      //   defaultValue={"Hari Ini"}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Satuan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="pill">Pill</SelectItem>
                        <SelectItem value="botol">Botol</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="inventory.price"
                defaultValue={inventory ? inventory!.price : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Harga<span className="text-red-600">*</span>
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
                name="inventory.min"
                defaultValue={inventory ? inventory!.min : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Jumlah Minimal<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="number"
                        min={0}
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
                name="inventory.desc"
                defaultValue={inventory ? inventory!.desc : ""}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Tuliskan deskripsi inventaris disini"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tambahkan deskripsi inventaris diatas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button className="mt-3" disabled={loading}>
            Konfirmasi & Simpan
          </Button>
        </form>
      </Form>
    </>
  );
};

export default InventarisDetail;
