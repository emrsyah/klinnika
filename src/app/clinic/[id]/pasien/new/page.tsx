"use client";
import * as z from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientOnlySchema } from "@/lib/validation/form";
import {
  Form,
  FormControl,
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

const PasienNew = () => {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const [loading, setLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof patientOnlySchema>>({
    resolver: zodResolver(patientOnlySchema),
    defaultValues: {
      patient: {
        nik: "",
        email: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof patientOnlySchema>) => {
    setLoading(true);
    const toastId = toast.loading("Sedang Menambahkan Data...");
    try {
      const formattedPatient = {
        patient: {
          ...values.patient,
        },
        clinicId: data?.user?.clinicId,
      };
      await axios.post("/api/pasien", {
        ...formattedPatient,
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
        Tambah Pasien Baru
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-sm p-4 flex flex-col w-full gap-2 mt-2"
        >
          <div className="flex flex-col gap-2">
            <h2 className="formSubTitle">Data Pasien</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                disabled={loading}
                control={form.control}
                name="patient.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nama<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        // value={field.value}
                        disabled={loading}
                        placeholder="nama pasien"
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
                name="patient.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Gender<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      //   defaultValue={"Hari Ini"}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="patient.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nomor Telepon<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="08" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="patient.birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 justify-end">
                    <FormLabel>
                      Tanggal Lahir<span className="text-red-600">*</span>
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
                name="patient.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="pasien@something.com"
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
                name="patient.nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="NIK pasien"
                        {...field}
                      />
                    </FormControl>
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

export default PasienNew;
