"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";

type Mood = "excellent" | "good" | "average" | "poor" | "terrible";

const moods: {
  value: Mood;
  label: string;
  color: string;
}[] = [
  {
    value: "excellent",
    label: "Excellent",
    color: "bg-green-500/20 border-green-400 text-green-300",
  },
  {
    value: "good",
    label: "Good",
    color: "bg-emerald-500/20 border-emerald-400 text-emerald-300",
  },
  {
    value: "average",
    label: "Average",
    color: "bg-yellow-500/20 border-yellow-400 text-yellow-300",
  },
  {
    value: "poor",
    label: "Poor",
    color: "bg-orange-500/20 border-orange-400 text-orange-300",
  },
  {
    value: "terrible",
    label: "Terrible",
    color: "bg-red-500/20 border-red-400 text-red-300",
  },
];

type TPresentModalProps = {
  openPresentModal: boolean;
  setOpenPresentModal: Dispatch<SetStateAction<boolean>>;
  selectedDay: number;
};

const PresentModal = ({
  openPresentModal,
  setOpenPresentModal,
  selectedDay,
}: TPresentModalProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const handleSubmit = () => {
    if (!selectedMood) return;

    // 🔥 API call here
    console.log("Selected mood:", selectedMood, selectedDay);
  };
  return (
    <Dialog open={openPresentModal} onOpenChange={setOpenPresentModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select your Mood Today</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {moods.map((mood) => {
            const isActive = selectedMood === mood.value;

            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                h-20 rounded-lg border flex items-center justify-center text-sm font-medium
                transition-all
                ${
                  isActive
                    ? mood.color
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }
              `}
              >
                {mood.label}
              </button>
            );
          })}
        </div>

        <Button
          className="mt-6 w-full"
          disabled={!selectedMood}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PresentModal;
