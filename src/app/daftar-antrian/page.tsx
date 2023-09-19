"use client";
import { Button } from "@/components/ui/button";
import ReactSelect from "react-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { queueFormSchema } from "@/lib/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  keluhanType,
  selectableConverter,
} from "../clinic/[id]/antrian/new/page";
import { collection, doc, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import axios from "axios";

const DaftarAntrian = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clinicId = searchParams?.get("clinic_id");
  const queueId = searchParams?.get("queue_id");

  if (clinicId == "" || clinicId == undefined || clinicId == null) {
    router.push("/");
  }

  const doctorRef = query(
    collection(db, "user"),
    where("clinic_id", "==", clinicId),
    where("role", "==", "doctor")
  ).withConverter(selectableConverter);

  const clinicRef = doc(db, "clinic", clinicId!);

  const queueRef = doc(db, "queue", queueId ?? "-");

  const [doctors, loadingDoctor, errorDoctor] = useCollectionData(doctorRef);
  const [clinic, loadingClinic, errorClinic] = useDocumentData(clinicRef);
  const [queue, loadingQueue, errorQueue] = useDocumentData(queueRef);

  // console.log(queueId)
  // console.log(queue)

  const [loading, setLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof queueFormSchema>>({
    resolver: zodResolver(queueFormSchema),
    defaultValues: {
      patient: {
        nik: "",
        email: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof queueFormSchema>) => {
    if (clinic === undefined) return;
    const toastId = toast.loading("Sedang Menambahkan Data...");
    setLoading(true);
    try {
      const formattedPatient = {
        patient: {
          ...values.patient,
        },
        clinicId: clinicId,
      };
      const newPatientId = await axios.post("/api/pasien", {
        ...formattedPatient,
      });
      const patientId = newPatientId.data;
      const formattedQueue = {
        complaint: {
          ...values.complaint,
        },
        userId: patientId,
        clinicId: clinicId,
      };
      const dataRes = await axios.post("/api/antrian", {
        ...formattedQueue,
      });
      toast.success("Berhasil Menambahkan Data | Check Pesan dari Bot Untuk Info Lanjut", {
        id: toastId,
      });

      // DiBAWAH ORDER NUMBER NYA
      const order_number = dataRes.data.orderNumber

      router.push(`/daftar-antrian?clinic_id=${clinicId}&queue_id=${dataRes.data.queueId}`);
      // router.push(`/${backUrl}`);
    } catch (err) {
      toast.error("Gagal Menambahkan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!loadingClinic && clinic === undefined) {
      console.log(clinic)
      console.log(loadingClinic)
      router.push("/");
    }
  }, [loadingClinic, clinic]);

  if (loadingClinic || clinic === undefined) {
    return (
      <div className="max-w-xl my-6 mx-auto border p-4 rounded">
        <h1 className="text-2xl mrt font-bold text-blue-500 animate-bounce">
          Mengambil Data....
        </h1>
      </div>
    );
  }

  return (queueId !== undefined && queueId !== null) ? (
    <div className="max-w-xl my-6 mx-auto border p-4 rounded">
      {loadingQueue ? (
        <h1 className="text-2xl mrt font-bold text-blue-500 animate-bounce">
          Mengambil Data....
        </h1>
      ) : (
        <h1 className="text-2xl mrt font-bold text-blue-500 animate-bounce">
          {queue == undefined ? `Tak Ditemukan Data | Id: ${queueId}` : `Antrian Ke: ${queue.order_number ?? "-"} | ${queueId} `}
        </h1>
      )}
    </div>
  ) : (
    <div className="max-w-xl my-6 mx-auto">
      <h1 className="font-bold text-xl mrt text-blue-400">
        Form Antrian Baru | {clinic ? clinic.name : "Klinik Tak Ditemukan"}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-sm p-4 flex flex-col w-full gap-2 mt-2"
        >
          <div className="flex flex-col gap-2">
            <div className="flit justify-between">
              <h2 className="formSubTitle">Informasi Diri</h2>
            </div>
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
          <Separator className="my-5" />
          <div className="flex flex-col gap-2">
            <h2 className="formSubTitle">Data Keluhan</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                disabled={loading}
                control={form.control}
                name="complaint.appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Hari<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      //   defaultValue={"Hari Ini"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Hari" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hari Ini">Hari Ini</SelectItem>
                        <SelectItem value="Besok">Besok</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complaint.doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Dokter<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ReactSelect
                        isDisabled={loadingDoctor || loading}
                        placeholder={
                          loadingDoctor ? "Mengambil data..." : "Pilih Dokter"
                        }
                        onChange={(val) => field.onChange(val)}
                        options={doctors}
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
                name="complaint.queueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipe Antrian<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      //   defaultValue={""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tipe Antrian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="BPJS">BPJS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="complaint.complaintType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipe Keluhan<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ReactSelect
                        isDisabled={loading}
                        onChange={(val) => field.onChange(val)}
                        options={keluhanType}
                        isMulti
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
                name="complaint.description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Tuliskan deskripsi keluhan disini"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tambahkan deskripsi komplain di atas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} className="mt-4" type="submit">
            Konfirmasi & Tambah
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DaftarAntrian;
