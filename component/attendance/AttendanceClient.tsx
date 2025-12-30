"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Clock, LogOut, Calendar, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { checkIn, checkOut, getCurrentAttendanceStatus, getAttendanceRecords, getAttendanceReport } from "@/service/attendence";

interface AttendanceRecord {
  id: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
  status: "present" | "absent" | "late" | "halfday";
  notes?: string;
}

interface AttendanceStatus {
  status: "checkedIn" | "checkedOut";
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
}

interface AttendanceReport {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  attendancePercentage: number;
  month?: string;
  year?: number;
}

interface AttendanceClientProps {
  initialStatus?: AttendanceStatus | null;
}

export default function AttendanceClient({ initialStatus }: AttendanceClientProps) {
  // State management
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus | null>(initialStatus || null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // Filter states
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      await loadStatus();
      await loadRecords();
      await loadReport();
    };
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load current status
  const loadStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await getCurrentAttendanceStatus();
      if (response.success && response.data) {
        setCurrentStatus(response.data as AttendanceStatus);
      } else {
        toast.error(response.message || "Failed to load status");
      }
    } catch (err) {
      console.error("Error loading status:", err);
      toast.error("Failed to load attendance status");
    } finally {
      setStatusLoading(false);
    }
  };

  // Load attendance records
  const loadRecords = async () => {
    setRecordsLoading(true);
    try {
      const response = await getAttendanceRecords(startDate, endDate);
      if (response.success && response.data) {
        setRecords(Array.isArray(response.data) ? response.data : response.data.records || []);
      } else {
        toast.error(response.message || "Failed to load records");
      }
    } catch (err) {
      console.error("Error loading records:", err);
      toast.error("Failed to load attendance records");
    } finally {
      setRecordsLoading(false);
    }
  };

  // Load attendance report
  const loadReport = async () => {
    setReportLoading(true);
    try {
      const response = await getAttendanceReport(startDate, endDate);
      if (response.success && response.data) {
        setReport(response.data as AttendanceReport);
      } else {
        toast.error(response.message || "Failed to load report");
      }
    } catch (err) {
      console.error("Error loading report:", err);
      toast.error("Failed to load attendance report");
    } finally {
      setReportLoading(false);
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const response = await checkIn();
      if (response.success) {
        setCurrentStatus({
          status: "checkedIn",
          checkInTime: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
        toast.success("Checked in successfully!");
        loadRecords();
      } else {
        toast.error(response.message || "Failed to check in");
      }
    } catch (err) {
      console.error("Error checking in:", err);
      toast.error(err instanceof Error ? err.message : "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const response = await checkOut();
      if (response.success) {
        setCurrentStatus({
          status: "checkedOut",
          checkOutTime: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
        toast.success("Checked out successfully!");
        loadRecords();
      } else {
        toast.error(response.message || "Failed to check out");
      }
    } catch (err) {
      console.error("Error checking out:", err);
      toast.error(err instanceof Error ? err.message : "Failed to check out");
    } finally {
      setLoading(false);
    }
  };

  // Handle date range update
  const handleUpdateDateRange = () => {
    loadRecords();
    loadReport();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="checkin">Check In/Out</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Attendance Status
              </CardTitle>
              <CardDescription>Your attendance status for today</CardDescription>
            </CardHeader>
            <CardContent>
              {statusLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : currentStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Badge */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">Status</div>
                          <div className="text-2xl font-bold text-blue-600 capitalize">
                            {currentStatus.status === "checkedIn" ? "Checked In" : "Checked Out"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Check-in Time */}
                    {currentStatus.checkInTime && (
                      <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Check In Time</div>
                            <div className="text-xl font-mono text-green-600">{currentStatus.checkInTime}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Check-out Time */}
                    {currentStatus.checkOutTime && (
                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Check Out Time</div>
                            <div className="text-xl font-mono text-orange-600">{currentStatus.checkOutTime}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Duration */}
                    {currentStatus.duration && (
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Duration</div>
                            <div className="text-xl font-mono text-purple-600">{currentStatus.duration}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {currentStatus.status === "checkedOut" && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        You have checked out for today. See you tomorrow!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    No attendance record for today. Click CHECK IN to start your attendance.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check In/Out Tab */}
        <TabsContent value="checkin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Mark Attendance
              </CardTitle>
              <CardDescription>Check in or check out for the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleCheckIn}
                  disabled={loading || (currentStatus?.status === "checkedIn")}
                  className="h-24 text-lg font-semibold"
                  variant={currentStatus?.status === "checkedIn" ? "outline" : "default"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Checking In...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-5 w-5" />
                      Check In
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleCheckOut}
                  disabled={loading || (currentStatus?.status === "checkedOut")}
                  className="h-24 text-lg font-semibold"
                  variant={currentStatus?.status === "checkedOut" ? "outline" : "default"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Checking Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-5 w-5" />
                      Check Out
                    </>
                  )}
                </Button>
              </div>

              {currentStatus && (
                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Current status: <span className="font-semibold capitalize">{currentStatus.status}</span>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Records
              </CardTitle>
              <CardDescription>View your attendance history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-date" className="text-sm">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-sm">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleUpdateDateRange} disabled={recordsLoading} className="w-full">
                    {recordsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Apply Filter"
                    )}
                  </Button>
                </div>
              </div>

              {/* Records List */}
              {recordsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : records.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {records.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {record.checkInTime && (
                              <div>
                                ✓ Check In: <span className="font-mono">{record.checkInTime}</span>
                              </div>
                            )}
                            {record.checkOutTime && (
                              <div>
                                ✓ Check Out: <span className="font-mono">{record.checkOutTime}</span>
                              </div>
                            )}
                            {record.duration && (
                              <div>
                                ⏱ Duration: <span className="font-mono">{record.duration}</span>
                              </div>
                            )}
                            {record.notes && <div>📝 Notes: {record.notes}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === "present"
                                ? "bg-green-100 text-green-800"
                                : record.status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : record.status === "late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert className="border-gray-200 bg-gray-50">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <AlertDescription className="text-gray-700">
                    No attendance records found for the selected date range.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Attendance Report
              </CardTitle>
              <CardDescription>Your attendance summary</CardDescription>
            </CardHeader>
            <CardContent>
              {reportLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : report ? (
                <div className="space-y-4">
                  {/* Overall Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-green-100">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600">{report.attendancePercentage}%</div>
                          <div className="text-sm text-gray-600 mt-1">Attendance Rate</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">{report.totalDays}</div>
                          <div className="text-sm text-gray-600 mt-1">Total Days</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{report.presentDays}</div>
                          <div className="text-xs text-gray-600">Present</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{report.absentDays}</div>
                          <div className="text-xs text-gray-600">Absent</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{report.lateDays}</div>
                          <div className="text-xs text-gray-600">Late</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{report.halfDays}</div>
                          <div className="text-xs text-gray-600">Half Day</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Time Period Info */}
                  {report.month && report.year && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Report for {report.month} {report.year}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert className="border-gray-200 bg-gray-50">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <AlertDescription className="text-gray-700">
                    No attendance data available for the selected period.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
