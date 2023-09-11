"use client";
import { Separator } from "@/components/ui/separator";
import * as React from "react";

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
import { Calendar } from "@/components/ui/calendar";
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

const isEmail = (value: string) => {
  // You can use a regular expression or any other method to validate the email format
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
};

const formSchema = z.object({
  patient: z.object({
    name: z.string().min(5, { message: "nama minimal 5 huruf" }),
    email: z
      .string()
      .transform((value) => (value === "" ? undefined : value.trim())) // Trim whitespace and treat empty string as undefined
      .refine((value) => value === undefined || isEmail(value), {
        message: "masukkan email yang valid",
      })
      .optional(),
    nik: z
      .string()
      .transform((value) => (value === "" ? undefined : value.trim())) // Trim whitespace and treat empty string as undefined
      .refine((value) => value === undefined || value.length === 16, {
        message: "masukkan nik yang valid",
      })
      .optional(),
    gender: z.enum(["Laki-laki", "Perempuan"], {
      required_error: "gender wajib diisi",
    }),
    phone: z
      .string({ required_error: "nomor telepon wajib dimasukkan" })
      .trim(),
    birthDate: z.date({ required_error: "tanggal lahir wajib dimasukkan" }),
  }),
  complaint: z.object({
    description: z.string().optional(),
    appointmentDate: z.string({ required_error: "wajib memilih tanggal" }),
    doctor: z.object(
      {
        label: z.string(),
        value: z.string(),
      },
      { required_error: "wajib memilih dokter" }
    ),
    complaintType: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .min(1, { message: "minimal memilih 1 tipe komplain" }),
    queueType: z.enum(["BPJS", "Regular"], {
      required_error: "wajib memilih 1 tipe antrian",
    }),
  }),
});

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
  const { data } = useSession();
  const [isOldPatient, setIsOldPatient] = React.useState<boolean>(false);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: {
        nik: "",
        email: "",
      },
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                isDisabled={loadingPatient}
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
                        disabled={isOldPatient}
                        placeholder="nama pasien"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patient.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Gender<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={isOldPatient}
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
                control={form.control}
                name="patient.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nomor Telepon<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isOldPatient}
                        placeholder="08"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patient.birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1 justify-end">
                    <FormLabel>
                      Tanggal Lahir<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger disabled={isOldPatient} asChild>
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
                          disabled={isOldPatient}
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
                control={form.control}
                name="patient.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isOldPatient}
                        placeholder="pasien@something.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patient.nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isOldPatient}
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
                control={form.control}
                name="complaint.appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pilih Hari<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
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
                        isDisabled={loadingDoctor}
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
                control={form.control}
                name="complaint.queueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipe Antrian<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
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
                control={form.control}
                name="complaint.complaintType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipe Keluhan<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ReactSelect
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
                control={form.control}
                name="complaint.description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
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
          <Button className="mt-4" type="submit">
            Konfirmasi & Tambah
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AntrianNew;
