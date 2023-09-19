import * as React from "react"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QueueTypeBadge from "./QueueTypeBadge";
import { queueTypeToColorConverter } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

export function ChangeProgressConfirmationDialog({
  open,
  setOpen,
  current,
  next,
  queue_id
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  current: string;
  next: string;
  queue_id: string;
}) {
  const [loading, setLoading] = React.useState(false)
  const submitHandler = async () => {
    setLoading(true)
    if(queue_id === undefined) {
      console.error("id antrian tak ditemukan")
      return
    }
    await axios.patch("/api/antrian-status", {
      id: queue_id,
      type: next
    })
    toast.success("Status berhasil diubah")
    setLoading(false)
    setOpen(false)
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Ganti Proses</DialogTitle>
          <DialogDescription>
            Pilih konfirmasi jika benar ingin mengganti proses
          </DialogDescription>
        </DialogHeader>
        <div className="gap-2 py-2 flex items-center">
          Ubah dari{" "}
          <QueueTypeBadge type={queueTypeToColorConverter(current)}>
            {current}
          </QueueTypeBadge>{" "}
          ke
          <QueueTypeBadge type={queueTypeToColorConverter(next)}>
            {next}
          </QueueTypeBadge>
          ?
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={submitHandler} type="submit">
            {loading ? "Mengubah data, jangan tutup..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
