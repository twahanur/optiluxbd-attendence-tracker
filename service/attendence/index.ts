"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/service-client";

// Note: getAttendanceChartData is exported separately from ./getChartData
// Import directly: import { getAttendanceChartData } from "@/service/attendence/getChartData"

// ============================================
// TYPES
// ============================================

export type MoodType = "HAPPY" | "NEUTRAL" | "SAD" | "STRESSED" | "EXCITED";
export type ShiftType = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
export type AttendanceStatusType = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeName?: string;
  employeeId?: string;
  section?: string;
  shift?: ShiftType;
  mood?: MoodType;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  status: AttendanceStatusType;
  hoursWorked?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarkAttendanceRequest {
  mood?: MoodType;
  date?: string;
  notes?: string;
}

export interface MarkAbsenceRequest {
  date: string;
  reason: string;
}

export interface UpdateAttendanceRequest {
  checkOutTime?: string;
  notes?: string;
  mood?: MoodType;
}

export interface AttendanceSummary {
  month: string;
  year: number;
  totalDays: number;
  workingDays: number;
  attendedDays: number;
  absentDays: number;
  attendancePercentage: number;
  moodDistribution?: Record<MoodType, number>;
  shiftDistribution?: Record<ShiftType, number>;
}

export interface AttendanceStats {
  totalRecords: number;
  presentDays: number;
  absentDays: number;
  averageCheckIn?: string;
  averageCheckOut?: string;
  averageWorkingHours?: number;
}

export interface TodayAttendance {
  isMarked: boolean;
  date: string;
  attendance?: AttendanceRecord;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AttendanceRecordsResponse {
  records: AttendanceRecord[];
  totalCount: number;
  pagination?: PaginationInfo;
}

// ============================================
// ATTENDANCE MARK/ABSENCE ENDPOINTS
// ============================================

/**
 * Mark attendance (check-in)
 * POST /attendance/mark
 */
export const markAttendance = async (data?: MarkAttendanceRequest) => {
  return apiPost<{ attendance: AttendanceRecord }>(
    "/attendance/mark",
    data || {},
    {},
    "Failed to mark attendance"
  );
};

/**
 * Mark absence
 * POST /attendance/absent
 */
export const markAbsence = async (data: MarkAbsenceRequest) => {
  return apiPost<{ attendance: AttendanceRecord }>(
    "/attendance/absent",
    data,
    {},
    "Failed to mark absence"
  );
};

/**
 * Update attendance (check-out or update notes)
 * PUT /attendance/:attendanceId
 */
export const updateAttendance = async (
  attendanceId: string,
  data: UpdateAttendanceRequest
) => {
  return apiPut<{ attendance: AttendanceRecord }>(
    `/attendance/${attendanceId}`,
    data,
    {},
    "Failed to update attendance"
  );
};

// ============================================
// ATTENDANCE RETRIEVAL ENDPOINTS
// ============================================

/**
 * Get my attendance records with pagination and filters
 * GET /attendance/my-records
 */
export const getMyAttendanceRecords = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  mood?: MoodType;
  shift?: ShiftType;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.mood) queryParams.append("mood", params.mood);
  if (params?.shift) queryParams.append("shift", params.shift);

  const query = queryParams.toString();
  return apiGet<AttendanceRecordsResponse>(
    `/attendance/my-records${query ? `?${query}` : ""}`,
    {},
    "Failed to fetch attendance records"
  );
};

/**
 * Get current month summary
 * GET /attendance/current-month-summary
 */
export const getCurrentMonthSummary = async () => {
  return apiGet<{ summary: AttendanceSummary }>(
    "/attendance/current-month-summary",
    {},
    "Failed to fetch current month summary"
  );
};

/**
 * Get month summary for specific month/year
 * GET /attendance/month-summary
 */
export const getMonthSummary = async (month?: number, year?: number) => {
  const queryParams = new URLSearchParams();
  if (month) queryParams.append("month", month.toString());
  if (year) queryParams.append("year", year.toString());

  const query = queryParams.toString();
  return apiGet<{ summary: AttendanceSummary }>(
    `/attendance/month-summary${query ? `?${query}` : ""}`,
    {},
    "Failed to fetch month summary"
  );
};

/**
 * Check today's attendance status
 * GET /attendance/today
 */
export const getTodayAttendance = async () => {
  return apiGet<TodayAttendance>(
    "/attendance/today",
    {},
    "Failed to get today's attendance status"
  );
};

/**
 * Check attendance for a specific date
 * GET /attendance/date/:date
 */
export const getDateAttendance = async (date: string) => {
  return apiGet<TodayAttendance>(
    `/attendance/date/${date}`,
    {},
    "Failed to get attendance for date"
  );
};

/**
 * Get attendance statistics
 * GET /attendance/stats
 */
export const getAttendanceStats = async () => {
  return apiGet<{ stats: AttendanceStats }>(
    "/attendance/stats",
    {},
    "Failed to fetch attendance statistics"
  );
};

/**
 * Get attendance chart data
 * GET /attendance/chart
 */
export const getAttendanceChart = async (period: "week" | "month" | "year" = "month") => {
  return apiGet<{
    labels: string[];
    present: number[];
    absent: number[];
  }>(
    `/attendance/chart?period=${period}`,
    {},
    "Failed to fetch chart data"
  );
};

/**
 * Delete attendance record for a date
 * DELETE /attendance/date/:date
 */
export const deleteAttendance = async (date: string) => {
  return apiDelete(
    `/attendance/date/${date}`,
    {},
    "Failed to delete attendance record"
  );
};

// ============================================
// LEGACY ALIASES (for backward compatibility)
// ============================================

/**
 * @deprecated Use markAttendance instead
 */
export const checkIn = markAttendance;

/**
 * @deprecated Use updateAttendance instead
 */
export const checkOut = async (attendanceId?: string) => {
  if (!attendanceId) {
    // If no ID provided, first get today's attendance to get the ID
    const todayResponse = await getTodayAttendance();
    if (todayResponse.success && todayResponse.data?.attendance?.id) {
      attendanceId = todayResponse.data.attendance.id;
    } else {
      return {
        success: false,
        message: "No active attendance found to check out",
      };
    }
  }
  return updateAttendance(attendanceId, {
    checkOutTime: new Date().toISOString(),
  });
};

/**
 * @deprecated Use getTodayAttendance instead
 */
export const getCurrentAttendanceStatus = getTodayAttendance;

/**
 * @deprecated Use getMyAttendanceRecords instead
 */
export const getAttendanceRecords = async (
  startDate?: string,
  endDate?: string
) => {
  return getMyAttendanceRecords({ startDate, endDate });
};

/**
 * @deprecated Use getCurrentMonthSummary or getMonthSummary instead
 */
export const getAttendanceReport = async (
  startDate: string,
  endDate: string
) => {
  return getMyAttendanceRecords({ startDate, endDate });
};

