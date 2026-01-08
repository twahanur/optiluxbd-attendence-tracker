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
import { 
  markAttendance, 
  markAbsence,
  updateAttendance, 
  getTodayAttendance, 
  getMyAttendanceRecords, 
  getCurrentMonthSummary,
  deleteAttendance,
  type AttendanceRecord as APIAttendanceRecord,
  type TodayAttendance,
  type AttendanceSummary 
} from "@/service/attendence";

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "present" | "absent" | "late" | "halfday";
  notes?: string;
  mood?: string;
}

interface AttendanceStatus {
  isMarked: boolean;
  date: string;
  attendance?: APIAttendanceRecord;
}

interface AttendanceReport {
  totalDays: number;
  workingDays?: number;
  attendedDays?: number;
  presentDays: number;
  absentDays: number;
  lateDays?: number;
  halfDays?: number;
  attendancePercentage: number;
  month?: string;
  year?: number;
}

interface AttendanceClientProps {
  initialStatus?: TodayAttendance | null;
}

export default function AttendanceClient({ initialStatus }: AttendanceClientProps) {
  // State management
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus | null>(
    initialStatus ? { 
      isMarked: initialStatus.isMarked, 
      date: initialStatus.date, 
      attendance: initialStatus.attendance 
    } : null
  );
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
      const response = await getTodayAttendance();
      if (response.success && response.data) {
        setCurrentStatus(response.data as AttendanceStatus);
      } else {
        // No attendance for today - not an error
        setCurrentStatus({ isMarked: false, date: new Date().toISOString().split("T")[0] });
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
      const response = await getMyAttendanceRecords({ startDate, endDate });
      if (response.success && response.data) {
        const data = response.data;
        const recordsList = Array.isArray(data) ? data : data.records || [];
        setRecords(recordsList.map((r: APIAttendanceRecord) => ({
          id: r.id,
          date: r.date,
          checkInTime: r.checkInTime,
          checkOutTime: r.checkOutTime,
          status: r.status,
          notes: r.notes,
          mood: r.mood,
        })));
      } else {
        setRecords([]);
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
      const response = await getCurrentMonthSummary();
      if (response.success && response.data) {
        const summary = response.data.summary as AttendanceSummary;
        setReport({
          totalDays: summary.totalDays,
          workingDays: summary.workingDays,
          attendedDays: summary.attendedDays,
          presentDays: summary.attendedDays,
          absentDays: summary.absentDays,
          attendancePercentage: summary.attendancePercentage,
          month: summary.month,
          year: summary.year,
        });
      } else {
        setReport(null);
      }
    } catch (err) {
      console.error("Error loading report:", err);
      toast.error("Failed to load attendance report");
    } finally {
      setReportLoading(false);
    }
  };

  // Handle check-in (mark attendance)
  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const response = await markAttendance({ mood: "HAPPY" });
      if (response.success) {
        const attendance = response.data?.attendance;
        setCurrentStatus({
          isMarked: true,
          date: new Date().toISOString().split("T")[0],
          attendance: attendance,
        });
        toast.success("Attendance marked successfully!");
        loadRecords();
      } else {
        toast.error(response.message || "Failed to mark attendance");
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
      toast.error(err instanceof Error ? err.message : "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  // Handle check-out (update attendance)
  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const attendanceId = currentStatus?.attendance?.id;
      if (!attendanceId) {
        toast.error("No active attendance found to check out");
        setLoading(false);
        return;
      }
      
      const response = await updateAttendance(attendanceId, {
        checkOutTime: new Date().toISOString(),
      });
      
      if (response.success) {
        const attendance = response.data?.attendance;
        setCurrentStatus({
          isMarked: true,
          date: new Date().toISOString().split("T")[0],
          attendance: attendance,
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

  // Handle mark absence
  const handleMarkAbsence = async (date: string, reason: string) => {
    setLoading(true);
    try {
      const response = await markAbsence({ date, reason });
      if (response.success) {
        toast.success("Absence marked successfully!");
        loadRecords();
        loadReport();
      } else {
        toast.error(response.message || "Failed to mark absence");
      }
    } catch (err) {
      console.error("Error marking absence:", err);
      toast.error(err instanceof Error ? err.message : "Failed to mark absence");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete attendance
  const handleDeleteAttendance = async (date: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }
    setLoading(true);
    try {
      const response = await deleteAttendance(date);
      if (response.success) {
        toast.success("Attendance record deleted!");
        loadRecords();
        loadReport();
        // If deleted today's record, refresh status
        if (date === new Date().toISOString().split("T")[0]) {
          loadStatus();
        }
      } else {
        toast.error(response.message || "Failed to delete attendance");
      }
    } catch (err) {
      console.error("Error deleting attendance:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete attendance");
    } finally {
      setLoading(false);
    }
  };

  // Handle date range update
  const handleUpdateDateRange = () => {
    loadRecords();
    loadReport();
  };

  // Check if user has checked in but not checked out
  const hasCheckedIn = currentStatus?.isMarked && currentStatus?.attendance && !currentStatus?.attendance?.checkOutTime;
  const hasCheckedOut = currentStatus?.isMarked && currentStatus?.attendance?.checkOutTime;

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
              ) : currentStatus?.isMarked && currentStatus?.attendance ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Badge */}
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">Status</div>
                          <div className="text-2xl font-bold text-blue-600 capitalize">
                            {hasCheckedOut ? "Checked Out" : "Checked In"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Check-in Time */}
                    {currentStatus.attendance.checkInTime && (
                      <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Check In Time</div>
                            <div className="text-xl font-mono text-green-600">
                              {new Date(currentStatus.attendance.checkInTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Check-out Time */}
                    {currentStatus.attendance.checkOutTime && (
                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Check Out Time</div>
                            <div className="text-xl font-mono text-orange-600">
                              {new Date(currentStatus.attendance.checkOutTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Mood */}
                    {currentStatus.attendance.mood && (
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Mood</div>
                            <div className="text-xl font-mono text-purple-600 capitalize">{currentStatus.attendance.mood.toLowerCase()}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {hasCheckedOut && (
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
                  disabled={loading || currentStatus?.isMarked}
                  className="h-24 text-lg font-semibold"
                  variant={currentStatus?.isMarked ? "outline" : "default"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Marking...
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
                  disabled={loading || !hasCheckedIn || !!hasCheckedOut}
                  className="h-24 text-lg font-semibold"
                  variant={hasCheckedOut ? "outline" : "default"}
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

              {currentStatus?.isMarked && (
                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Current status: <span className="font-semibold capitalize">
                      {hasCheckedOut ? "Checked Out" : hasCheckedIn ? "Checked In" : "Not Marked"}
                    </span>
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
                        <div className="text-right flex flex-col gap-2 items-end">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === "present" || record.status === "PRESENT"
                                ? "bg-green-100 text-green-800"
                                : record.status === "absent" || record.status === "ABSENT"
                                  ? "bg-red-100 text-red-800"
                                  : record.status === "late" || record.status === "LATE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {String(record.status).charAt(0).toUpperCase() + String(record.status).slice(1).toLowerCase()}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteAttendance(record.date)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
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

              {/* Mark Absence Section */}
              <Card className="mt-4 border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-800">Mark Absence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor="absence-date" className="text-sm text-orange-700">Date</Label>
                      <Input
                        id="absence-date"
                        type="date"
                        className="mt-1 border-orange-200"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="absence-reason" className="text-sm text-orange-700">Reason</Label>
                      <Input
                        id="absence-reason"
                        placeholder="Enter reason..."
                        className="mt-1 border-orange-200"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      onClick={() => {
                        const dateInput = document.getElementById("absence-date") as HTMLInputElement;
                        const reasonInput = document.getElementById("absence-reason") as HTMLInputElement;
                        if (dateInput?.value && reasonInput?.value) {
                          handleMarkAbsence(dateInput.value, reasonInput.value);
                          dateInput.value = "";
                          reasonInput.value = "";
                        } else {
                          toast.error("Please enter both date and reason");
                        }
                      }}
                      disabled={loading}
                    >
                      Mark Absent
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
