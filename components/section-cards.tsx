import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  attendancePercentageToday: number;
  totalAttendedToday: number;
  totalEmployees: number;
  totalNotAttendedToday: number;
}

export function SectionCards({ data }: { data: SectionCardsProps }) {
  const {
    totalEmployees = 0,
    totalAttendedToday = 0,
    totalNotAttendedToday = 0,
    attendancePercentageToday = 0,
  } = data;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer">
        <CardHeader>
          <CardDescription className="text-white/70">
            Total Employees
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {totalEmployees}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-green-400 border-green-400/50 bg-green-400/10">
              <IconTrendingUp className="w-4 h-4 mr-1" />
              Company Size
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Trending up this month{" "}
            <IconTrendingUp className="size-4 text-green-400" />
          </div>
          <div className="text-white/70">Total registered employees</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer">
        <CardHeader>
          <CardDescription className="text-white/70">
            Attended Today
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {totalAttendedToday}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-green-400 border-green-400/50 bg-green-400/10">
              <IconTrendingUp className="w-4 h-4 mr-1" />
              {attendancePercentageToday}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Present employees today{" "}
            <IconTrendingUp className="size-4 text-green-400" />
          </div>
          <div className="text-white/70">Daily attendance count</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer">
        <CardHeader>
          <CardDescription className="text-white/70">
            Absent Today
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {totalNotAttendedToday}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-red-400 border-red-400/50 bg-red-400/10">
              <IconTrendingDown className="w-4 h-4 mr-1" />
              {100 - attendancePercentageToday}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Missing employees today{" "}
            <IconTrendingDown className="size-4 text-red-400" />
          </div>
          <div className="text-white/70">Track absenteeism patterns</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer">
        <CardHeader>
          <CardDescription className="text-white/70">
            Attendance Rate
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {attendancePercentageToday}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-blue-400 border-blue-400/50 bg-blue-400/10">
              <IconTrendingUp className="w-4 h-4 mr-1" />
              Today&apos;s Rate
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Overall attendance percentage{" "}
            <IconTrendingUp className="size-4 text-blue-400" />
          </div>
          <div className="text-white/70">Daily performance metrics</div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer">
        <CardHeader>
          <CardDescription className="text-white/70">
            Growth Rate
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-purple-400 border-purple-400/50 bg-purple-400/10">
              <IconTrendingUp className="w-4 h-4 mr-1" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Steady performance increase{" "}
            <IconTrendingUp className="size-4 text-purple-400" />
          </div>
          <div className="text-white/70">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
