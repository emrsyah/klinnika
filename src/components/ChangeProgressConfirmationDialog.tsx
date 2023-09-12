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

export function ChangeProgressConfirmationDialog({
  open,
  setOpen,
  current,
  next
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  current: string;
  next: string
}) {
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
          <QueueTypeBadge type={queueTypeToColorConverter(current)}>{current}</QueueTypeBadge> ke
          <QueueTypeBadge type={queueTypeToColorConverter(next)}>{next}</QueueTypeBadge>?
        </div>
        <DialogFooter>
          <Button type="submit">Konfirmasi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
