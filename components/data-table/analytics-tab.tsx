import * as React from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AttendanceRecord, AbsentEmployee } from "./schemas";

interface AnalyticsTabProps {
  attendanceDataState: AttendanceRecord[];
  absentDataState: AbsentEmployee[];
}

export function AnalyticsTab({ attendanceDataState, absentDataState }: AnalyticsTabProps) {
  // Mock data for demonstration
  const chartData = [
    { month: "January", attendance: 186, absent: 14 },
    { month: "February", attendance: 175, absent: 20 },
    { month: "March", attendance: 192, absent: 8 },
    { month: "April", attendance: 180, absent: 15 },
    { month: "May", attendance: 195, absent: 5 },
    { month: "June", attendance: 178, absent: 22 },
  ];

  const chartConfig = {
    attendance: {
      label: "Attendance",
      color: "hsl(var(--chart-1))",
    },
    absent: {
      label: "Absent",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Calculate stats
  const totalAttendance = attendanceDataState.length;
  const totalAbsent = absentDataState.length;
  const attendanceRate = totalAttendance + totalAbsent > 0 ? 
    (totalAttendance / (totalAttendance + totalAbsent) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Analytics Overview</h2>
        <Button variant="outline" size="sm">
          <IconTrendingUp className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Total Present</p>
              <p className="text-2xl font-bold text-green-400">{totalAttendance}</p>
            </div>
            <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <IconTrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Total Absent</p>
              <p className="text-2xl font-bold text-red-400">{totalAbsent}</p>
            </div>
            <div className="h-8 w-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <IconTrendingUp className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Attendance Rate</p>
              <p className="text-2xl font-bold text-blue-400">{attendanceRate}%</p>
            </div>
            <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <IconTrendingUp className="h-4 w-4 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Attendance Trend</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-white/70">
              Last 6 Months
            </Badge>
          </div>
        </div>
        
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="attendance"
              type="natural"
              fill="var(--color-attendance)"
              fillOpacity={0.4}
              stroke="var(--color-attendance)"
              stackId="a"
            />
            <Area
              dataKey="absent"
              type="natural"
              fill="var(--color-absent)"
              fillOpacity={0.4}
              stroke="var(--color-absent)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}