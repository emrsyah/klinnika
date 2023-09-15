"use client";
import { db } from "@/lib/firebase";
import { mappingToArray } from "@/lib/utils";
import { collection, doc, orderBy, query, where } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import {
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import * as z from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { patientOnlySchema } from "@/lib/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useMedicalRecordData } from "./useMedicalRecordData";
import axios from "axios";
import toast from "react-hot-toast";

const PasienDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const patientId = pathname?.split("/")[pathname!.split("/").length - 1];
  const [loading, setLoading] = React.useState<boolean>(false);

  const [patient, loadingPatient, errorPatient] = useDocumentOnce(
    doc(db, "patient", patientId!)
  );

  const {
    combinedData,
    error,
    loading: loadingMedrec,
  } = useMedicalRecordData({
    patientId: patientId!,
  });
  const form = useForm<z.infer<typeof patientOnlySchema>>({
    resolver: zodResolver(patientOnlySchema),
    defaultValues: {},
    shouldUnregister: false
  });

  const onSubmit = async (values: z.infer<typeof patientOnlySchema>) => {
    setLoading(true);
    const toastId = toast.loading("Sedang Menyimpan Data...");
    try {
      const formatted = {
        patient: {
          ...values.patient,
        },
        id: patientId,
      };
      await axios.patch("/api/pasien", { ...formatted });
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

  if (!patient?.exists() && !loadingPatient) {
    router.back();
  }

  if (loadingPatient) {
    return <>Loading...</>;
  }

  return (
    <>
      <h1 className="font-bold text-xl mrt text-blue-400">
        Detail Data Pasien
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
                defaultValue={patient?.data() ? patient.data()!.name : ""}
                name="patient.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nama<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading || loadingPatient}
                        placeholder="nama pasien"
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
                defaultValue={patient?.data() ? patient.data()!.gender : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Gender<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      {...field}
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
                defaultValue={patient?.data() ? patient.data()!.phone : ""}
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
                defaultValue={
                  patient?.data() ? patient.data()!.birth_date.toDate() : ""
                }
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
                          disabled={loading || loadingPatient}
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
                defaultValue={patient?.data() ? patient.data()!.email : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading || loadingPatient}
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
                defaultValue={patient?.data() ? patient.data()!.nik : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading || loadingPatient}
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
          <Button
            className="mt-3"
            disabled={loading || !form.formState.isDirty}
          >
            Konfirmasi & Simpan
          </Button>
        </form>
      </Form>
      <Separator className="my-4" />
      <h1 className="font-bold text-xl mrt text-blue-400">
        Rekam Medis Pasien
      </h1>
      {loadingMedrec ? (
        <div className="font-semibold mt-1 text-gray-400 border p-2 rounded">
          Sedang mengambil data...
        </div>
      ) : combinedData.length ? (
        <Accordion
          type="multiple"
          className="border rounded-sm p-4 w-full mt-2"
        >
          {combinedData.map((med) => (
            <AccordionItem value={med.id} key={med.id}>
              <AccordionTrigger>
                <div className="flex flex-col items-start">
                  <h2 className="font-bold text-blue-900 text-lg mrt">
                    {med.act_type} |{" "}
                    {dayjs(med.created_at.toDate()).format("DD MMM YYYY")}
                  </h2>
                  <p className="text-gray-500 font font-semibold mrt">
                    {med.id}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col ">
                <div className="flit justify-between">
                  <p className="font-medium text-gray-500">Tanggal</p>
                  <h3 className="font-semibold text-blue-900">
                    {dayjs(med.created_at.toDate()).format("DD MMM YYYY")}
                  </h3>
                </div>
                <div className="flit justify-between mt-2">
                  <p className="font-medium text-gray-500">Oleh</p>
                  <h3 className="font-semibold text-blue-900">
                    Dr. {med.doctor.name}
                  </h3>
                </div>
                <div className="flit justify-between mt-2">
                  <p className="font-medium text-gray-500">Tindakan</p>
                  <h3 className="font-semibold text-blue-900">
                    {med.act_type}
                  </h3>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-1 mt-2">
                  <p className="font-medium text-gray-500">
                    Obat yang diberikan:
                  </p>
                  <h3 className="font-semibold text-blue-900">
                    {med.medical.medicals.map((m: any) => m.name).join(", ")}
                  </h3>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-1 mt-2">
                  <p className="font-medium text-gray-500">Diagnosa:</p>
                  <h3 className="font-semibold text-blue-900">
                    {med.diagnose}
                  </h3>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="font-semibold mt-1 text-gray-400 border p-2 rounded">
          Belum ada rekam medis
        </div>
      )}
    </>
  );
};

export default PasienDetail;
