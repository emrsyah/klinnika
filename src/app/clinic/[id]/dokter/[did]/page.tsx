"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TimePicker from "react-datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorFormSchema, polyclinicArr } from "@/lib/validation/form";
import { setHours, setMinutes } from "date-fns";
import dayjs from "dayjs";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { db } from "../../../../../../lib/firebase";
import { usePathname } from "next/navigation";
import { collection, doc } from "firebase/firestore";
import { DayEntry, transformArrayToJson } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const DokterDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const docId = pathname?.split("/")[pathname!.split("/").length - 1];
  const backUrl = pathname?.split("/").slice(1, 4).join("/");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [doctor, loadingDoc, errorDoc] = useDocumentData(
    doc(db, "user", docId!)
  );
  const [schedules, loadingSche, errorSche] = useCollectionData(
    collection(db, "user", docId!, "schedules")
  );

  const form = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {},
    shouldUnregister: false,
  });

  const onSubmit = async (values: z.infer<typeof doctorFormSchema>) => {
    console.log(values);
    const toastId = toast.loading("Sedang Menyimpan Data...");
    setLoading(true);
    try {
      await axios.patch("/api/dokter", {
        doctor: { ...values.doctor },
        uid: docId,
      });
      await axios.patch("/api/schedules", {
        schedules: {
          ...values.schedules,
        },
        userId: docId,
      });
      toast.success("Berhasil Menyimpan Data", {
        id: toastId,
      });
      router.push(`/${backUrl}`);
    } catch (err) {
      toast.error("Gagal Menyimpan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoc || loadingSche) {
    return <>Loading...</>;
  }

  const getSchedulesDefault = (day: string): Date => {
    const dayData = schedules?.find((s) => s.days == day);
    return dayData ? dayData.startTime.toDate() : new Date();
  };

  const getSchedulesDefaultEnd = (day: string): Date => {
    const dayData = schedules?.find((s) => s.days == day);
    return dayData ? dayData.endTime.toDate() : new Date();
  };

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
            <h2 className="formSubTitle">Data Dokter</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                disabled={loading}
                control={form.control}
                name="doctor.name"
                defaultValue={doctor ? doctor!.name : ""}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Nama<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="nama dokter"
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
                name="doctor.email"
                defaultValue={doctor ? doctor!.email : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        // value={field.value}
                        disabled={true}
                        placeholder="dokter@gmail.com"
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
                name="doctor.password"
                defaultValue="12345678"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={true}
                        placeholder="---"
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
                defaultValue={doctor ? doctor!.phone : ""}
                name="doctor.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nomor HP<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="nomor telepon"
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
                name="doctor.gender"
                defaultValue={doctor ? doctor!.gender : ""}
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
                name="doctor.price"
                defaultValue={doctor ? doctor!.price : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fee Per Pertemuan<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        type="number"
                        disabled={loading}
                        placeholder="Rp 0"
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
                name="doctor.polyclinic"
                defaultValue={doctor ? doctor!.polyclinic : ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Poliklinik<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      //   defaultValue={"Hari Ini"}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Poliklinik" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {polyclinicArr.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-3" />
            <h2 className="formSubTitle">Jadwal</h2>
            <Separator />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Senin
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Senin.startTime"
                    defaultValue={getSchedulesDefault("Senin")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            disabled={loading}
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Senin.endTime"),
                                form
                                  .getValues("schedules.Senin.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Senin.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Senin.endTime"
                    defaultValue={getSchedulesDefaultEnd("Senin")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Senin.startTime")}
                            disabled={
                              form.getValues("schedules.Senin.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Senin.startTime"),
                                form
                                  .getValues("schedules.Senin.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Senin.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Selasa
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Selasa.startTime"
                    defaultValue={getSchedulesDefault("Selasa")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            disabled={loading}
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Selasa.endTime"),
                                form
                                  .getValues("schedules.Selasa.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Selasa.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Selasa.endTime"
                    defaultValue={getSchedulesDefaultEnd("Selasa")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Selasa.startTime")}
                            disabled={
                              form.getValues("schedules.Selasa.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Selasa.startTime"),
                                form
                                  .getValues("schedules.Selasa.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Selasa.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Rabu
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Rabu.startTime"
                    defaultValue={getSchedulesDefault("Rabu")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            disabled={loading}
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Rabu.endTime"),
                                form
                                  .getValues("schedules.Rabu.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Rabu.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Rabu.endTime"
                    defaultValue={getSchedulesDefaultEnd("Rabu")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Rabu.startTime")}
                            disabled={
                              form.getValues("schedules.Rabu.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Rabu.startTime"),
                                form
                                  .getValues("schedules.Rabu.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Rabu.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Kamis
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Kamis.startTime"
                    defaultValue={getSchedulesDefault("Kamis")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            disabled={loading}
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Kamis.endTime"),
                                form
                                  .getValues("schedules.Kamis.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Kamis.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Kamis.endTime"
                    defaultValue={getSchedulesDefaultEnd("Kamis")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Kamis.startTime")}
                            disabled={
                              form.getValues("schedules.Kamis.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Kamis.startTime"),
                                form
                                  .getValues("schedules.Kamis.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Kamis.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Jumat
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Jumat.startTime"
                    defaultValue={getSchedulesDefault("Jumat")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            disabled={loading}
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Jumat.endTime"),
                                form
                                  .getValues("schedules.Jumat.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Jumat.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Jumat.endTime"
                    defaultValue={getSchedulesDefaultEnd("Jumat")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Jumat.startTime")}
                            disabled={
                              form.getValues("schedules.Jumat.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Jumat.startTime"),
                                form
                                  .getValues("schedules.Jumat.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Jumat.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Sabtu
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Sabtu.startTime"
                    defaultValue={getSchedulesDefault("Sabtu")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            disabled={loading}
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Sabtu.endTime"),
                                form
                                  .getValues("schedules.Sabtu.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Sabtu.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Sabtu.endTime"
                    defaultValue={getSchedulesDefaultEnd("Sabtu")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Sabtu.startTime")}
                            disabled={
                              form.getValues("schedules.Sabtu.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Sabtu.startTime"),
                                form
                                  .getValues("schedules.Sabtu.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Sabtu.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
              <div className="flex items-center w-full col-span-2 mt-2">
                <h4 className="w-36 flit justify-center font-semibold text-blue-500 mrt">
                  Minggu
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-grow ">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Minggu.startTime"
                    defaultValue={getSchedulesDefault("Minggu")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <TimePicker
                            className="border p-2 rounded w-full"
                            // selected={startDate}
                            {...field}
                            disabled={loading}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            minTime={setHours(setMinutes(new Date(), 15), 24)}
                            maxTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Minggu.endTime"),
                                form
                                  .getValues("schedules.Minggu.endTime")
                                  ?.getMinutes() - 15
                              ),
                              form
                                .getValues("schedules.Minggu.endTime")
                                ?.getHours()
                            )}
                            // maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="schedules.Minggu.endTime"
                    defaultValue={getSchedulesDefaultEnd("Minggu")}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Waktu Selesai</FormLabel>
                        <FormControl>
                          <TimePicker
                            // selected={startDate}
                            className="border p-2 rounded w-full"
                            {...field}
                            // minTime={form.getValues("schedules.Minggu.startTime")}
                            disabled={
                              form.getValues("schedules.Minggu.startTime") ===
                                undefined || loading
                            }
                            minTime={setHours(
                              setMinutes(
                                form.getValues("schedules.Minggu.startTime"),
                                form
                                  .getValues("schedules.Minggu.startTime")
                                  ?.getMinutes() + 15
                              ),
                              form
                                .getValues("schedules.Minggu.startTime")
                                ?.getHours()
                            )}
                            maxTime={setHours(setMinutes(new Date(), 45), 23)}
                            value={
                              field.value
                                ? dayjs(field.value).format("HH:mm")
                                : undefined
                            }
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            placeholderText="Pilih Waktu"
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-1 col-span-2" />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            Konfirmasi & Tambahkan
          </Button>
        </form>
      </Form>
    </>
  );
};

export default DokterDetail;
