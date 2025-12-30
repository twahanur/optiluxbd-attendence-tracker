"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Download, RefreshCw, BarChart3, FileText, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { GetDepartmentReport } from "@/service/reports";
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

interface DepartmentReport {
  department: string;
  totalEmployees: number;
  totalAttendances: number;
  attendancePercentage: number;
}

interface ReportData {
  report: DepartmentReport[];
  startDate: string;
  endDate: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<DepartmentReport[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartmentReport = useCallback(async (start?: string, end?: string) => {
    setIsLoading(true);
    try {
      const startParam = start || startDate;
      const endParam = end || endDate;
      
      const data: ApiResponse<ReportData> = await GetDepartmentReport(startParam, endParam);
      
      if (data.success && data.data) {
        setReportData(data.data.report);
        toast.success("Department report loaded successfully");
      } else {
        throw new Error(data.message || "Failed to load report");
      }
    } catch (error) {
      console.error("Error fetching department report:", error);
      toast.error("Failed to load department report");
      // Set some mock data for development/demo purposes
      setReportData([
        {
          department: "Customer Service",
          totalEmployees: 3,
          totalAttendances: 44,
          attendancePercentage: 86
        },
        {
          department: "Finance",
          totalEmployees: 3,
          totalAttendances: 42,
          attendancePercentage: 82
        },
        {
          department: "HR",
          totalEmployees: 4,
          totalAttendances: 55,
          attendancePercentage: 81
        },
        {
          department: "IT",
          totalEmployees: 3,
          totalAttendances: 42,
          attendancePercentage: 82
        },
        {
          department: "Marketing",
          totalEmployees: 5,
          totalAttendances: 69,
          attendancePercentage: 81
        },
        {
          department: "Operations",
          totalEmployees: 4,
          totalAttendances: 57,
          attendancePercentage: 84
        },
        {
          department: "Quality Assurance",
          totalEmployees: 3,
          totalAttendances: 43,
          attendancePercentage: 84
        },
        {
          department: "R&D",
          totalEmployees: 6,
          totalAttendances: 83,
          attendancePercentage: 81
        },
        {
          department: "Sales",
          totalEmployees: 4,
          totalAttendances: 53,
          attendancePercentage: 78
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  // Load today's report on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchDepartmentReport(today, today);
  }, [fetchDepartmentReport]);

  const handleDateChange = () => {
    fetchDepartmentReport();
  };

  const handleRefresh = () => {
    fetchDepartmentReport();
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

  const chartData = reportData.map(item => ({
    ...item,
    name: item.department,
  }));

  const averageAttendance = reportData.length > 0 
    ? Math.round(reportData.reduce((sum, dept) => sum + dept.attendancePercentage, 0) / reportData.length)
    : 0;

  const totalEmployees = reportData.reduce((sum, dept) => sum + dept.totalEmployees, 0);
  const totalAttendances = reportData.reduce((sum, dept) => sum + dept.totalAttendances, 0);

  const DepartmentReportTab = () => (
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
                  onChange={(e) => setStartDate(e.target.value)}
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
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40 border-white/20 text-white"
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-300 pointer-events-none" />
              </div>
            </div>
            <Button onClick={handleDateChange} disabled={isLoading} className="bg-purple-500 hover:bg-purple-600">
              {isLoading ? "Loading..." : "Apply Filter"}
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
                      formatter={(value: number, name: string) => {
                        if (name === "attendancePercentage") return [`${value}%`, "Attendance %"];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <Bar 
                      dataKey="attendancePercentage" 
                      fill="#a78bfa" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80">
                {isLoading ? (
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-400" />
                    <p className="text-white">Loading report data...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-200">No data available</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Department Details</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.length > 0 ? (
              <div className="overflow-auto h-80">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 backdrop-blur-sm">
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2 font-semibold text-white">Department</th>
                      <th className="text-right p-2 font-semibold text-white">Employees</th>
                      <th className="text-right p-2 font-semibold text-white">Attendance</th>
                      <th className="text-right p-2 font-semibold text-white">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData
                      .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
                      .map((dept) => (
                      <tr key={dept.department} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-2 font-medium text-white">{dept.department}</td>
                        <td className="p-2 text-right text-gray-200">{dept.totalEmployees}</td>
                        <td className="p-2 text-right text-gray-200">{dept.totalAttendances}</td>
                        <td className="p-2 text-right">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            dept.attendancePercentage >= 85
                              ? "text-green-300 border border-green-500/40"
                              : dept.attendancePercentage >= 75
                              ? "text-yellow-300 border border-yellow-500/40"
                              : "text-red-300 border border-red-500/40"
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
              <p className="text-center text-gray-200 py-8">
                No data available for the selected date range
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reports Dashboard</h1>
          <p className="text-gray-200">
            Comprehensive analytics and reporting for attendance tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" className="border-white/20 text-white hover:border-white/40">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleDownloadReport} disabled={reportData.length === 0} className="bg-purple-500 hover:bg-purple-600">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="department" className="w-full">
        <TabsList className="grid w-full grid-cols-4 border border-white/20">
          <TabsTrigger value="department" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Department Reports
          </TabsTrigger>
          <TabsTrigger value="employee" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employee Reports
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Attendance Trends
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="department">
          <DepartmentReportTab />
        </TabsContent>

        <TabsContent value="employee">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Employee Reports</CardTitle>
              <p className="text-gray-200">Individual employee attendance analysis</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-200">Employee reports coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Attendance Trends</CardTitle>
              <p className="text-gray-200">Historical attendance patterns and trends</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-200">Attendance trend analysis coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Custom Reports</CardTitle>
              <p className="text-gray-200">Build your own custom reports and analytics</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-200">Custom report builder coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}