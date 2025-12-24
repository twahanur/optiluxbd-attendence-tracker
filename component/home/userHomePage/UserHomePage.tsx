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
import { mockAttendanceStats } from "@/const/statsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const moodColors: Record<string, string> = {
  EXCELLENT: "text-green-400",
  GOOD: "text-emerald-400",
  AVERAGE: "text-yellow-400",
  POOR: "text-orange-400",
  TERRIBLE: "text-red-400",
};

const UserHomePage = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfMonth = getDay(new Date(year, month));
  const startOffset = (firstDayOfMonth + 1) % 7;

  const { totalAttendanceDays, currentMonthAttendance } = mockAttendanceStats;

  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();
  const currentHour = now.getHours();
  const isCurrentMonth = month === todayMonth && year === todayYear;

  const isDateClickable = (day: number) => {
    // Must be current month & year
    if (!isCurrentMonth) return false;

    // Only today
    if (day !== todayDate) return false;

    // Must be after 10 AM
    if (currentHour < 10) return false;

    return true;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Attendance */}
        <Card className="bg-white/5 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-sm ">Total Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAttendanceDays}</p>
            <p className="text-xs ">Days attended overall</p>
          </CardContent>
        </Card>

        {/* Monthly Attendance */}
        <Card className="bg-white/5 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-sm ">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {currentMonthAttendance.attendedDays} /{" "}
              {currentMonthAttendance.totalDays}
            </p>
            <p className="text-xs  mt-1">{currentMonthAttendance.month}</p>
          </CardContent>
        </Card>

        {/* Attendance Percentage */}
        <Card className="bg-white/5 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-sm ">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {currentMonthAttendance.attendancePercentage}%
            </p>
            <div className="w-full h-2 bg-white/10 rounded-full mt-2">
              <div
                className="h-2 bg-green-500 rounded-full transition-all"
                style={{
                  width: `${currentMonthAttendance.attendancePercentage}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Month & Year */}
        <Card className="bg-white/5 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-sm ">Period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {currentMonthAttendance.year}
            </p>
            <p className="text-sm ">{currentMonthAttendance.month}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <div className="flex items-start gap-6 w-full">
        <div className="grid grid-cols-7 gap-2 bg-white/5 backdrop-blur-2xl p-4 rounded-xl w-full">
          {/* Weekday header */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="flex items-center justify-center text-sm font-semibold text-gray-300 "
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
            return (
              <button
                key={day}
                disabled={!enabled}
                className={`h-12 w-15 rounded-md border p-3 flex justify-center items-center transition-all ${
                  enabled
                    ? "border-green-400 bg-green-500/20 text-white hover:bg-green-500/30 cursor-pointer"
                    : "border-gray-600 bg-gray-500/10 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!enabled) return;
                  console.log("Clicked today:", day);
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="w-full space-y-3">
          {/* Mood Distribution */}
          <Card className="bg-white/5 backdrop-blur-xl sm:col-span-2 text-white p-4 gap-2">
            <CardHeader className="px-0">
              <CardTitle className="text-base">Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 px-0">
              {Object.entries(currentMonthAttendance.moodDistribution).map(
                ([mood, count]) => (
                  <div key={mood} className="flex justify-between text-xs">
                    <span className={moodColors[mood]}>{mood}</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Shift Distribution */}
          <Card className="bg-white/5 backdrop-blur-xl sm:col-span-2 text-white p-4 gap-2">
            <CardHeader className="px-0">
              <CardTitle className="text-base">Shift Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 px-0">
              {Object.entries(currentMonthAttendance.shiftDistribution).map(
                ([shift, count]) => (
                  <div key={shift} className="flex justify-between text-xs">
                    <span>{shift}</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
