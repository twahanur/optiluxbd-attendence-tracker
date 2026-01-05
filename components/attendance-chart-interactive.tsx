"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Define the data type for attendance chart
export interface AttendanceChartData {
  date: string; // Format: "2026-01-01"
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface AttendanceChartInteractiveProps {
  data?: AttendanceChartData[];
}

// Chart configuration
const chartConfig = {
  attendance: {
    label: "Attendance",
  },
  present: {
    label: "Present",
    color: "hsl(142, 76%, 36%)", // Vibrant Green
  },
  absent: {
    label: "Absent",
    color: "hsl(0, 84%, 60%)", // Bright Red
  },
  late: {
    label: "Late",
    color: "hsl(45, 93%, 47%)", // Bright Orange/Yellow
  },
} satisfies ChartConfig

// Demo data generator - generates last 90 days of attendance data
function generateDemoData(): AttendanceChartData[] {
  const data: AttendanceChartData[] = [];
  const today = new Date("2026-01-01");
  const totalEmployees = 35;

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random but realistic attendance numbers
    const presentRate = 0.75 + Math.random() * 0.2; // 75-95% attendance
    const lateRate = 0.05 + Math.random() * 0.1; // 5-15% late
    
    const present = Math.floor(totalEmployees * presentRate);
    const late = Math.floor(totalEmployees * lateRate);
    const absent = totalEmployees - present - late;

    data.push({
      date: date.toISOString().split('T')[0],
      present: present,
      absent: Math.max(0, absent),
      late: late,
      total: totalEmployees,
    });
  }

  return data;
}

export function AttendanceChartInteractive({ data }: AttendanceChartInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  // Use provided data or generate demo data
  const chartData = data || generateDemoData();

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date(chartData[chartData.length - 1]?.date || new Date());
    let daysToSubtract = 90;
    
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [chartData, timeRange]);

  // Calculate stats for the filtered period
  const stats = React.useMemo(() => {
    const totalPresent = filteredData.reduce((sum, day) => sum + day.present, 0);
    const totalAbsent = filteredData.reduce((sum, day) => sum + day.absent, 0);
    const totalLate = filteredData.reduce((sum, day) => sum + day.late, 0);
    const avgPresent = filteredData.length > 0 ? Math.round(totalPresent / filteredData.length) : 0;
    const avgRate = filteredData.length > 0 
      ? Math.round((totalPresent / (totalPresent + totalAbsent + totalLate)) * 100) 
      : 0;

    return { totalPresent, totalAbsent, totalLate, avgPresent, avgRate };
  }, [filteredData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Average {stats.avgPresent} employees present daily • {stats.avgRate}% attendance rate
          </span>
          <span className="@[540px]/card:hidden">
            {stats.avgRate}% attendance rate
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPresent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-present)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-present)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-late)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-late)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-absent)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-absent)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="present"
              type="natural"
              fill="transparent"
              stroke="var(--color-present)"
              strokeWidth={2}
            />
            <Area
              dataKey="late"
              type="natural"
              fill="transparent"
              stroke="var(--color-late)"
              strokeWidth={2}
            />
            <Area
              dataKey="absent"
              type="natural"
              fill="transparent"
              stroke="var(--color-absent)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
