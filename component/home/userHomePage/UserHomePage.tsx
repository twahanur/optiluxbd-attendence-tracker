"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { months, years } from "@/const/monthArray";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { getDay, getDaysInMonth } from "date-fns";
import { useState } from "react";
import MoodDistribution from "./MoodDistribution";
import AbsentModal from "./AbsentModal";
import PresentModal from "./PresentModal";

const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
type AttendanceStatus = "present" | "absent" | "off" | "none";

const UserHomePage = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfMonth = getDay(new Date(year, month));
  const startOffset = (firstDayOfMonth + 1) % 7;
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [openAbsentModal, setOpenAbsentModal] = useState(false);
  const [openPresentModal, setOpenPresentModal] = useState(false);

  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();
  const currentHour = now.getHours();
  const isCurrentMonth = month === todayMonth && year === todayYear;

  const attendanceStyles: Record<
    AttendanceStatus,
    { bg: string; border: string; text: string; label: string }
  > = {
    present: {
      bg: "bg-green-500/20 hover:bg-green-500/30",
      border: "border-green-400",
      text: "text-green-300",
      label: "Present",
    },
    absent: {
      bg: "bg-red-500/20 hover:bg-red-500/30",
      border: "border-red-400",
      text: "text-red-300",
      label: "Absent",
    },
    off: {
      bg: "bg-yellow-500/20 hover:bg-yellow-500/30",
      border: "border-yellow-400",
      text: "text-yellow-300",
      label: "Off Day",
    },
    none: {
      bg: "bg-white/5 hover:bg-white/10",
      border: "border-white/10",
      text: "text-white/80",
      label: "",
    },
  };

  const attendanceMap: Record<number, AttendanceStatus> = {
    1: "present",
    2: "absent",
    3: "off",
    4: "present",
    5: "present",
    6: "absent",
  };

  const isDateClickable = (day: number) => {
    // Must be current month & year
    if (!isCurrentMonth) return false;

    // Only today
    if (day !== todayDate) return false;

    // Must be after 10 AM
    if (currentHour < 1) return false;

    return true;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-2xl px-6 py-2 rounded-xl flex items-center justify-between">
        <div className="flex gap-10 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="w-40 justify-between bg-white/5 backdrop-blur-2xl cursor-pointer"
              >
                {months[month]}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="bg-white/10 backdrop-blur-2xl text-white"
            >
              {months.map((m, i) => (
                <DropdownMenuItem key={i} onClick={() => setMonth(i)}>
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="w-40 justify-between bg-white/5 backdrop-blur-2xl cursor-pointer"
              >
                {year}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="bg-white/10 backdrop-blur-2xl text-white"
            >
              {years.map((m, i) => (
                <DropdownMenuItem key={i} onClick={() => setYear(m)}>
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex items-start gap-6 w-full">
        <div className="grid grid-cols-7 gap-2 bg-white/5 backdrop-blur-2xl p-4 rounded-xl w-full">
          {/* Weekday header */}
          {weekDays.map((day, i) => (
            <div
              key={i}
              className="h-12 w-full rounded-md border border-[rgba(34,197,94,0.50)] bg-[rgba(20,83,45,0.10)] p-2 flex justify-center items-center text-sm font-medium"
            >
              {day}
            </div>
          ))}

          {/* Empty cells */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const enabled = isDateClickable(day);
            const status = attendanceMap[day] ?? "none";
            const styles = attendanceStyles[status];

            return (
              <DropdownMenu key={day}>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={!enabled}
                    className={`
                h-12 w-15 rounded-md border p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  styles.bg
                } ${styles.border} ${styles.text} ${
                      !enabled
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <span className="text-sm font-semibold">{day}</span>
                    {status !== "none" && (
                      <span className="text-[10px] capitalize">{status}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="center"
                  className="w-32 bg-white/5 backdrop-blur-3xl"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedDay(day);
                      setOpenPresentModal(true);
                    }}
                  >
                    Present
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedDay(day);
                      setOpenAbsentModal(true);
                    }}
                  >
                    Absent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}

          <AbsentModal
            openAbsentModal={openAbsentModal}
            setOpenAbsentModal={setOpenAbsentModal}
            selectedDay={selectedDay as number}
          />

          <PresentModal
            openPresentModal={openPresentModal}
            setOpenPresentModal={setOpenPresentModal}
            selectedDay={selectedDay as number}
          />
        </div>

        <MoodDistribution />
      </div>
    </div>
  );
};

export default UserHomePage;
