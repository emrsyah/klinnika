"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RefCallback } from "react";
import { Label } from "./ui/label";
import { Minus, Plus, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { Input } from "./ui/input";
import axios from "axios";
import toast from "react-hot-toast";

const mediActOptions = [
  { value: "Pemberian Obat", label: "Pemberian Obat" },
  { value: "Pemberian Rujukan", label: "Pemberian Rujukan" },
  { value: "Check-Up", label: "Check-Up" },
  { value: "Operasi", label: "Operasi" },
  { value: "Fisioterapi", label: "Fisioterapi" },
  { value: "Rehabilitasi", label: "Rehabilitasi" },
  { value: "Terapi Psikologi", label: "Terapi Psikologi" },
  { value: "Pemeriksaan Darah", label: "Pemeriksaan Darah" },
  { value: "Pemeriksaan Radiologi", label: "Pemeriksaan Radiologi" },
  { value: "Terapi Okupasi", label: "Terapi Okupasi" },
  { value: "Perawatan Rawat Inap", label: "Perawatan Rawat Inap" },
  { value: "Konsultasi Dokter", label: "Konsultasi Dokter" },
  { value: "Terapi Wicara", label: "Terapi Wicara" },
];

const obatOptions = [
  {
    value: "ajdvbOIVHdsd",
    label: "Paracetamol",
    isSelected: false,
  },
  {
    value: "cbjakouVDHoub",
    label: "Tolak Angin",
    isSelected: false,
  },
  {
    value: "KUWBououcsDSC",
    label: "Migrain",
    isSelected: false,
  },
  {
    value: "kJQBCousbCo",
    label: "Antagin",
    isSelected: false,
  },
];

const CustomOption = ({
  innerProps,
  isDisabled,
  innerRef,
  data,
}: {
  innerProps: JSX.IntrinsicElements["div"];
  isDisabled: boolean;
  innerRef: RefCallback<HTMLDivElement>;
  data: any;
}) => {
  return !isDisabled ? (
    <div
      ref={innerRef}
      {...innerProps}
      className="p-3 mrt flex flex-col gap-1 cursor-pointer hover:bg-blue-100"
    >
      <h1 className="font-bold text-blue-900">{data.label}</h1>
      <h2 className="text-gray-400 text-sm font-medium">{data.value}</h2>
      <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
        <h2>Exp: {dayjs(data.expired_at.toDate()).format("DD MMM YYYY")}</h2>|
        <h2>{data.amount}</h2>
      </div>
    </div>
  ) : null;
};

const formSchema = z.object({
  diagnose_desc: z.string().optional(),
  medical_act: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export function FinishFormSheet({
  open,
  setOpen,
  data,
  loading,
  queue_id,
  doc_id,
  patient_id,
  clinic_id,
}: //   current,
//   next,
{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  loading: boolean;
  queue_id: string;
  doc_id: string;
  patient_id: string;
  clinic_id: string;
  //   current: string;
  //   next: string;
}) {
  const [medicines, setMedicines] = React.useState<any[]>(data);
  const [selectedMedicines, setSelectedMedicines] = React.useState<any[]>([]);
  const [editVal, setEditVal] = React.useState<number[]>([]);
  const [loadingMutate, setLoadingMutate] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Sedang Menambahkan Data...");
    setLoadingMutate(true)
    try {
      const formattedMedicals = selectedMedicines.map((med) => {
        return {
          name: med.label,
          id: med.value,
          quantity: med.quantity,
          desc: med.medDesc,
          inventory_id: med.inventory_id,
          expired_at: med.expired_at,
        };
      });
      const {data} = await axios.post("/api/medical", {
        medicals: formattedMedicals,
      });
      console.log(data.medical_id);
      const formattedMedRec = {
        act_type: values.medical_act.value,
        diagnose: values.diagnose_desc ?? "",
        queue_id,
        doc_id,
        patient_id,
        clinic_id,
        medical_id: data.medical_id
      };
      const { data: dataMedrec } = await axios.post("/api/medrec", {
        ...formattedMedRec
      });
      console.log(dataMedrec)
      toast.success("Berhasil Menambahkan Data", {
        id: toastId,
      });
      setOpen(false);
    } catch (err) {
      toast.error("Gagal Menambahkan Data", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoadingMutate(false);
    }
  }

  const toggleIsSelected = (index: number) => {
    const updatedMedicines = [...data];
    updatedMedicines[index].isSelected = !updatedMedicines[index]?.isSelected;
    setMedicines(updatedMedicines);
  };

  const changeObatHandler = (val: any) => {
    if (val === null || loadingMutate) return;
    const valIdx = data.findIndex((med: any) => med.value === val.value);
    setSelectedMedicines((current) => [...current, { ...val, quantity: 1 }]);
    toggleIsSelected(valIdx);
  };

  const clickTrashHandler = (val: any) => {
    if (val === null || loadingMutate) return;
    const valIdx = data.findIndex((med: any) => med.value === val.value);
    setSelectedMedicines((current) =>
      current.filter((med) => med.value !== val.value)
    );
    toggleIsSelected(valIdx);
  };

  const minusQuantityHandler = (val: any) => {
    if (val.quantity === 1 || loadingMutate) return;
    const updated = [...selectedMedicines];
    updated.map((up) => {
      val.value === up.value ? (up.quantity -= 1) : up;
    });
    setSelectedMedicines(updated);
  };

  const plusQuantityHandler = (val: any) => {
    if (val.quantity === val.amount || loadingMutate) return;
    const updated = [...selectedMedicines];
    updated.map((up) => {
      val.value === up.value ? (up.quantity += 1) : up;
    });
    setSelectedMedicines(updated);
  };

  const onMedicineDescChange = (val: string, idx: number) => {
    const updated = [...selectedMedicines];
    updated[idx] = { ...updated[idx], medDesc: val };
    setSelectedMedicines(updated);
    // console.log(updated)
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Isi Hasil Pemeriksaan</SheetTitle>
              <SheetDescription>
                Isi hasil pemeriksaan sebelum mengubah status ke Selesai Proses
                & melanjutkan ke Pembayaran
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-2" />
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="medical_act"
                disabled={loadingMutate}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tindakan<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <ReactSelect
                        {...field}
                        isDisabled={loadingMutate}
                        options={mediActOptions}
                        isMulti={false}
                        isClearable={false}
                        isSearchable={true}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Label>Obat Diberikan</Label>
                <ReactSelect
                  options={data}
                  isMulti={false}
                  isClearable={false}
                  isDisabled={loading || loadingMutate}
                  placeholder={loading ? "Mengambil Data..." : "Tambahkan Obat"}
                  components={{
                    Option: CustomOption,
                  }}
                  onChange={changeObatHandler}
                  controlShouldRenderValue={false}
                  value={undefined}
                  filterOption={(val) => val.data.isSelected === false}
                  isSearchable={true}
                  // onChange={(val) => field.onChange(val)}
                />
                {selectedMedicines.map((med, idx) => (
                  <div
                    key={med.value}
                    className="p-2 border rounded flex flex-col gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flit justify-between">
                        <h3 className="text-gray-800 font-medium">
                          {med.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sisa: {med.amount}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        {med.id}
                      </p>
                    </div>
                    {editVal.find((val) => val === med.value) ? (
                      <Input
                        disabled={loadingMutate}
                        onChange={(ev) =>
                          onMedicineDescChange(ev.target.value, idx)
                        }
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditVal((curr) => [...curr, med.value]);
                        }}
                        className="text-blue-400 text-start text-sm"
                      >
                        Tulis Catatan
                      </button>
                    )}
                    <div className="flit justify-between mt-1">
                      <Trash2
                        aria-disabled={loadingMutate}
                        onClick={() => clickTrashHandler(med)}
                        size={24}
                        className="text-gray-500 cursor-pointer p-1 rounded hover:bg-red-100 hover:text-red-700"
                      />
                      <div className="flit gap-3 text-sm">
                        <Minus
                          aria-disabled={loadingMutate}
                          onClick={() => minusQuantityHandler(med)}
                          size={16}
                          className={`hover:text-blue-600 cursor-pointer ${
                            med.quantity === 1
                              ? "!text-gray-500 !cursor-not-allowed"
                              : null
                          } hover:bg-blue-50`}
                        />
                        <div>{med.quantity}</div>
                        <Plus
                          aria-disabled={loadingMutate}
                          onClick={() => plusQuantityHandler(med)}
                          size={16}
                          className={`hover:text-blue-600 cursor-pointer ${
                            med.quantity === med.amount
                              ? "!text-gray-500 !cursor-not-allowed"
                              : null
                          } hover:bg-blue-50`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <FormField
                control={form.control}
                name="diagnose_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Diagnosa</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loadingMutate}
                        placeholder="Isi diagnosa pasien"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Diagnosa opsional, akan tatapi kami{" "}
                      <span className="font-bold">SANGAT</span> menyarankan
                      untuk diisi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-4" />
            <SheetFooter>
              <Button disabled={loadingMutate} type="submit">
                Konfirmasi & Lanjutkan
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
