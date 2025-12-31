"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

interface DepartmentReport {
  department: string;
  totalEmployees: number;
  totalAttendances: number;
  attendancePercentage: number;
}

interface ReportsClientProps {
  initialData: DepartmentReport[];
  initialStartDate: string;
  initialEndDate: string;
  error?: string;
}

// Extract DepartmentReportTab as a separate component
function DepartmentReportTab({
  reportData,
  startDate,
  endDate,
  isLoading,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onRefresh,
  onDownloadReport,
}: {
  reportData: DepartmentReport[];
  startDate: string;
  endDate: string;
  isLoading: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApplyFilter: () => void;
  onRefresh: () => void;
  onDownloadReport: () => void;
}) {
  const chartData = reportData.map(item => ({
    ...item,
    name: item.department,
  }));

  const averageAttendance = reportData.length > 0 
    ? Math.round(reportData.reduce((sum, dept) => sum + dept.attendancePercentage, 0) / reportData.length)
    : 0;

  const totalEmployees = reportData.reduce((sum, dept) => sum + dept.totalEmployees, 0);
  const totalAttendances = reportData.reduce((sum, dept) => sum + dept.totalAttendances, 0);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card className="border-white/20">
        <CardHeader>
          <CardTitle className="text-lg text-white">Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-white">Start Date</Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-40 border-white/20 text-white"
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-300 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-white">End Date</Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="w-40 border-white/20 text-white"
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-300 pointer-events-none" />
              </div>
            </div>
            <Button onClick={onApplyFilter} disabled={isLoading} className="bg-purple-500 hover:bg-purple-600">
              {isLoading ? "Loading..." : "Apply Filter"}
            </Button>
            <Button 
              onClick={onRefresh} 
              disabled={isLoading}
              variant="outline"
              className="border-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalEmployees}</div>
            <p className="text-xs text-gray-200">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Attendances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAttendances}</div>
            <p className="text-xs text-gray-200">
              In selected date range
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageAttendance}%</div>
            <p className="text-xs text-gray-200">
              Across all departments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Table Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Department Attendance Chart</CardTitle>
            <p className="text-sm text-gray-200">
              Visual comparison of attendance rates
            </p>
          </CardHeader>
          <CardContent>
            {reportData.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      fontSize={10}
                      stroke="#fff"
                    />
                    <YAxis 
                      domain={[0, 100]}
                      fontSize={10}
                      stroke="#fff"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar 
                      dataKey="attendancePercentage" 
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Department Details</CardTitle>
            <p className="text-sm text-gray-200">
              Detailed breakdown by department
            </p>
          </CardHeader>
          <CardContent>
            {reportData.length > 0 ? (
              <div className="max-h-80 overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-800">
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2 px-2 text-white text-sm">Department</th>
                      <th className="text-right py-2 px-2 text-white text-sm">Employees</th>
                      <th className="text-right py-2 px-2 text-white text-sm">Attendance</th>
                      <th className="text-right py-2 px-2 text-white text-sm">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((dept, idx) => (
                      <tr key={idx} className="border-b border-white/10">
                        <td className="py-2 px-2 text-white text-sm">{dept.department}</td>
                        <td className="text-right py-2 px-2 text-white text-sm">{dept.totalEmployees}</td>
                        <td className="text-right py-2 px-2 text-white text-sm">{dept.totalAttendances}</td>
                        <td className="text-right py-2 px-2 text-white text-sm">
                          <span className={`font-semibold ${
                            dept.attendancePercentage >= 90 ? 'text-green-400' :
                            dept.attendancePercentage >= 75 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {dept.attendancePercentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Download Button */}
      <div className="flex justify-end">
        <Button 
          onClick={onDownloadReport} 
          disabled={reportData.length === 0}
          className="bg-green-500 hover:bg-green-600"
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV Report
        </Button>
      </div>
    </div>
  );
}

export default function ReportsClient({
  initialData,
  initialStartDate,
  initialEndDate,
  error: initialError,
}: ReportsClientProps) {
  const router = useRouter();
  const reportData = initialData;
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  const [isLoading, setIsLoading] = useState(false);

  // Show error toast if there was an initial error
  React.useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    } else if (initialData.length > 0) {
      toast.success("Department report loaded successfully");
    }
  }, [initialError, initialData]);

  const handleDateChange = () => {
    setIsLoading(true);
    // Navigate to the same page with new query params to trigger server-side data fetch
    router.push(`/admin/reports?startDate=${startDate}&endDate=${endDate}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    router.refresh();
  };

  const handleDownloadReport = () => {
    if (reportData.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const csvContent = [
      ["Department", "Total Employees", "Total Attendances", "Attendance Percentage"],
      ...reportData.map(row => [
        row.department,
        row.totalEmployees.toString(),
        row.totalAttendances.toString(),
        `${row.attendancePercentage}%`
      ])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `department-report-${startDate}-to-${endDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports Dashboard</h1>
          <p className="text-gray-200 mt-1">
            Generate and download attendance reports
          </p>
        </div>
      </div>

      <Tabs defaultValue="department" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="department" className="mt-6">
          <DepartmentReportTab
            reportData={reportData}
            startDate={startDate}
            endDate={endDate}
            isLoading={isLoading}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApplyFilter={handleDateChange}
            onRefresh={handleRefresh}
            onDownloadReport={handleDownloadReport}
          />
        </TabsContent>

        <TabsContent value="employee" className="mt-6">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Employee Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">Employee reports coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

