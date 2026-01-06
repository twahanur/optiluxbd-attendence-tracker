"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/service-client";

// Note: getAttendanceChartData is exported separately from ./getChartData
// Import directly: import { getAttendanceChartData } from "@/service/attendence/getChartData"

// Attendance Service API
export interface AttendanceRecord {
  id: number;
  userId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "half-day";
  hoursWorked?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInRequest {
  location?: {
    latitude: number;
    longitude: number;
  };
  note?: string;
}

export interface CheckOutRequest {
  location?: {
    latitude: number;
    longitude: number;
  };
  note?: string;
}

export interface AttendanceReport {
  userId: number;
  period: {
    startDate: string;
    endDate: string;
  };
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  averageHours: number;
  records: AttendanceRecord[];
}

// Check in
export const checkIn = async (data?: CheckInRequest) => {
  return apiPost("/attendance/checkin", data || {}, {}, "Failed to check in");
};

// Check out
export const checkOut = async (data?: CheckOutRequest) => {
  return apiPost("/attendance/checkout", data || {}, {}, "Failed to check out");
};

// Get current attendance status
export const getCurrentAttendanceStatus = async () => {
  return apiGet("/attendance/status", {}, "Failed to get attendance status");
};

// Get attendance records by date range
export const getAttendanceRecords = async (
  startDate?: string,
  endDate?: string
) => {
  const today = new Date().toISOString().split("T")[0];
  const start = startDate || today;
  const end = endDate || today;

  return apiGet(
    `/attendance/records?startDate=${start}&endDate=${end}`,
    {},
    "Failed to fetch attendance records"
  );
};

// Get attendance report
export const getAttendanceReport = async (
  startDate: string,
  endDate: string
) => {
  return apiGet(
    `/attendance/report?startDate=${startDate}&endDate=${endDate}`,
    {},
    "Failed to fetch attendance report"
  );
};

// Admin functions
// Get all employees attendance
export const getAllEmployeesAttendance = async (
  startDate?: string,
  endDate?: string
) => {
  const today = new Date().toISOString().split("T")[0];
  const start = startDate || today;
  const end = endDate || today;

  return apiGet(
    `/admin/attendance/records?startDate=${start}&endDate=${end}`,
    {},
    "Failed to fetch all employees attendance"
  );
};

// Update attendance record (admin)
export const updateAttendanceRecord = async (
  id: number,
  data: Partial<AttendanceRecord>
) => {
  return apiPut(
    `/admin/attendance/records/${id}`,
    data,
    {},
    "Failed to update attendance record"
  );
};

// Delete attendance record (admin)
export const deleteAttendanceRecord = async (id: number) => {
  return apiDelete(
    `/admin/attendance/records/${id}`,
    {},
    "Failed to delete attendance record"
  );
};
