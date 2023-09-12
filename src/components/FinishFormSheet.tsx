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
        <h2>Exp: 10 Sept 2023</h2>|<h2>{"Stock: 5"}</h2>
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
  medicines: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export function FinishFormSheet({
  open,
  setOpen,
}: //   current,
//   next,
{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //   current: string;
  //   next: string;
}) {
  const [medicines, setMedicines] = React.useState(obatOptions);
  const [selectedMedicines, setSelectedMedicines] = React.useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const toggleIsSelected = (index: number) => {
    const updatedMedicines = [...obatOptions];
    updatedMedicines[index].isSelected = !updatedMedicines[index].isSelected;
    setMedicines(updatedMedicines);
  };

  const changeObatHandler = (val: any) => {
    if (val === null) return;
    const valIdx = medicines.findIndex((med) => med.value === val.value);
    setSelectedMedicines((current) => [...current, val]);
    toggleIsSelected(valIdx);
  };

  const clickTrashHandler = (val: any) => {
    if (val === null) return;
    const valIdx = medicines.findIndex((med) => med.value === val.value);
    setSelectedMedicines((current) => current.filter(med => med.value !== val.value));
    toggleIsSelected(valIdx);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tindakan</FormLabel>
                    <FormControl>
                      <ReactSelect
                        options={mediActOptions}
                        defaultValue={mediActOptions[0]}
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
                  options={medicines}
                  isMulti={false}
                  isClearable={false}
                  placeholder={"Tambahkan Obat"}
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
                {selectedMedicines.map((med) => (
                  <div
                    key={med.value}
                    className="p-2 border rounded flex flex-col gap-2"
                  >
                    <div className="flit justify-between">
                      <h3 className="text-gray-800 font-medium">{med.label}</h3>
                      <p className="text-sm text-gray-600">Sisa: 20</p>
                    </div>
                    <p className="text-blue-400 text-sm">Tulis Catatan</p>
                    <div className="flit justify-between mt-1">
                      <Trash2
                        onClick={() =>clickTrashHandler(med)}
                        size={24}
                        className="text-gray-500 cursor-pointer p-1 rounded hover:bg-red-100 hover:text-red-700"
                      />
                      <div className="flit gap-3 text-sm">
                        <Minus size={16} className={`hover:text-blue-600 cursor-pointer hover:bg-blue-50`} />
                        <div>1</div>
                        <Plus size={16} className={`hover:text-blue-600 cursor-pointer hover:bg-blue-50`} />
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
              <SheetClose asChild>
                <Button type="submit">Konfirmasi</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
