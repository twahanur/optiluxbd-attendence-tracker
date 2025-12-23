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
import { getDaysInMonth } from "date-fns";
import Link from "next/link";
import { useState } from "react";

const HomePage = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const daysInMonth = getDaysInMonth(new Date(year, month));

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
        <div className="flex items-center gap-6">
          <button className="bg-white/5 px-4 py-1 cursor-pointer rounded-lg text-base">
            <Link href="/login">Login</Link>
          </button>
          <button className="bg-white/5 px-4 py-1 cursor-pointer rounded-lg text-base">
            <Link href="/register">Register</Link>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex items-center justify-center ">
        <div className="grid grid-cols-7 gap-8 bg-white/5 backdrop-blur-2xl p-10 rounded-xl">
          {Array.from({ length: daysInMonth }, (_, i) => (
            <div
              key={i}
              className="h-24 w-30 rounded-md border border-[rgba(34,197,94,0.50)] bg-[rgba(20,83,45,0.10)] p-4 flex justify-center"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
