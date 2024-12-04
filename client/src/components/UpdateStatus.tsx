import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

interface StatusUpdateDialogProps {
  onStatusUpdate: () => void;
}

export function StatusUpdateDialog({ onStatusUpdate }: StatusUpdateDialogProps) {
  const [open, setOpen] = useState(false);

  const handleStatusUpdate = () => {
    onStatusUpdate();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant={'secondary'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); 
          setOpen(true);
        }}
      >
        Update Status
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Status</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Are you sure you want to mark this item as done?
        </p>
        <Button onClick={handleStatusUpdate} className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" />
          Mark as Done
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  );
}
