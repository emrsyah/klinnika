"use client";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactSelect from "react-select";
import { Textarea } from "@/components/ui/textarea";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  DocumentData,
  FirestoreDataConverter,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { queueFormSchema } from "@/lib/validation/form";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

const keluhanType = [
  { value: "Demam", label: "Demam" },
  { value: "Flu", label: "Flu" },
  { value: "Batuk", label: "Batuk" },
  { value: "Sakit Kepala", label: "Sakit Kepala" },
  { value: "Sakit Tenggorokan", label: "Sakit Tenggorokan" },
  { value: "Mual", label: "Mual" },
  { value: "Diare", label: "Diare" },
  { value: "Sesak Napas", label: "Sesak Napas" },
  { value: "Sakit Gigi", label: "Sakit Gigi" },
];

interface Selectable<T> {
  label: string;
  value: T;
}

const selectableConverter: FirestoreDataConverter<Selectable<string>> = {
  toFirestore(
    patientSelectable: WithFieldValue<Selectable<string>>
  ): DocumentData {
    return { label: patientSelectable.label, value: patientSelectable.value };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Selectable<string> {
    const data = snapshot.data(options);
    return {
      // id: snapshot.id,
      ...data,
      label: data.name,
      value: snapshot.id,
    };
  },
};

const AntrianNew = () => {
  const router = useRouter();
  const pathname = usePathname();
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const { data } = useSession();
  const [isOldPatient, setIsOldPatient] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const patientRef = query(
    collection(db, "patient"),
    where("clinic_id", "==", data?.user?.clinicId)
  ).withConverter(selectableConverter);

  const doctorRef = query(
    collection(db, "user"),
    where("clinic_id", "==", data?.user?.clinicId),
    where("role", "==", "doctor")
  ).withConverter(selectableConverter);

  const [patients, loadingPatient, errorPatient] =
    useCollectionData(patientRef);
  const [doctors, loadingDoctor, errorDoctor] = useCollectionData(doctorRef);

  const form = useForm<z.infer<typeof queueFormSchema>>({
    resolver: zodResolver(queueFormSchema),
    defaultValues: {
      patient: {
        nik: "",
        email: "",
      },
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof queueFormSchema>) => {
    setLoading(true);
    let patientId = isOldPatient ? values.patient.id : "";
    const toastId = toast.loading("Sedang Menambahkan Data...");
    try {
      if (!isOldPatient) {
        // console.log(typeof values.patient.birthDate)
        // console.log(typeof new Date() === typeof values.patient.birthDate)
        const formattedPatient = {
          patient: {
            ...values.patient,
          },
          clinicId: data?.user?.clinicId,
        };
        const newPatientId = await axios.post("/api/pasien", {
          ...formattedPatient,
        });
        patientId = newPatientId.data;
      }
      const formattedQueue = {
        complaint: {
          ...values.complaint,
        },
        userId: patientId,
        clinicId: data?.user?.clinicId,
      };

      await axios.post("/api/antrian", {
        ...formattedQueue,
      });
      toast.success("Berhasil Menambahkan Data", {
        id: toastId,
      });
      router.push(`/${backUrl}`);
      // console.log(newQueue.data);
    } catch (err) {
      toast.error("Gagal Menambahkan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPatient = () => {
    form.setValue(
      "patient",
      {
        name: "",
        gender: "Laki-laki",
        phone: "",
        nik: "",
        email: "",
        birthDate: new Date(),
        id: "-999",
      },
      { shouldDirty: false }
    );
    // form.resetField("patient");
  };

  const changePatientHandler = (val: any) => {
    // console.log(val);
    if (!val) {
      setIsOldPatient(false);
      resetPatient();
      return;
    }
    setIsOldPatient(true);
    form.setValue(
      "patient",
      {
        name: val.name ?? "",
        gender: val.gender ?? "Laki-laki",
        phone: val.phone ?? "",
        nik: val.nik ?? "",
        email: val.email ?? "",
        birthDate: val.birth_date.toDate() ?? new Date(),
        id: val.value ?? "",
      },
      { shouldValidate: true }
    );
  };

  return (
    <>
      <h1 className="font-bold text-xl mrt text-blue-400">
        Tambah Antrian Baru
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-sm p-4 flex flex-col w-full gap-2 mt-2"
        >
          <div className="flex flex-col gap-2">
            <div className="flit justify-between">
              <h2 className="formSubTitle">Data Pasien</h2>
              <ReactSelect
                isDisabled={loadingPatient || loading}
                placeholder={
                  loadingPatient ? "Mengambil data..." : "Pilih Pasien"
                }
                onChange={changePatientHandler}
                options={patients}
                isClearable
              />
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
                        disabled={isOldPatient || loading}
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
                      disabled={isOldPatient || loading}
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
                      <Input
                        disabled={isOldPatient || loading}
                        placeholder="08"
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
                name="patient.birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 justify-end">
                    <FormLabel>
                      Tanggal Lahir<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger
                        disabled={isOldPatient || loading}
                        asChild
                      >
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
                          disabled={isOldPatient || loading}
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
                        disabled={isOldPatient || loading}
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
                        disabled={isOldPatient || loading}
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
                        placeholder="Tell us a little bit about yourself"
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
    </>
  );
};

export default AntrianNew;
