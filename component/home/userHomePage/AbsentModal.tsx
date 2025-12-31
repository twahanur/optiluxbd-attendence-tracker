"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
type FormValues = {
  note: string;
};

type TAbsentModalProps = {
  openAbsentModal: boolean;
  setOpenAbsentModal: Dispatch<SetStateAction<boolean>>;
  selectedDay: number;
};

const AbsentModal = ({
  openAbsentModal,
  setOpenAbsentModal,
  selectedDay,
}: TAbsentModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      note: "",
    },
  });

  const noteValue = watch("note") || "";

  const onSubmit = (data: FormValues) => {
    console.log("Absent reason:", data.note, selectedDay);
  };
  return (
    <Dialog open={openAbsentModal} onOpenChange={setOpenAbsentModal}>
      <DialogContent className="bg-white/10 backdrop-blur-3xl ">
        <DialogHeader>
          <DialogTitle>Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 ">
          <Textarea
            placeholder="Write reason for absence..."
            className={`resize-none bg-white/5 ${
              errors.note ? "border-red-500" : ""
            }`}
            {...register("note", {
              required: true,
              minLength: 5,
              maxLength: 50,
            })}
          />

          {/* Character counter */}
          <div className="flex justify-end text-xs text-muted-foreground">
            <span
              className={
                noteValue.length > 50 || noteValue.length < 5
                  ? "text-red-500"
                  : ""
              }
            >
              {noteValue.length} / 50
            </span>
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AbsentModal;
