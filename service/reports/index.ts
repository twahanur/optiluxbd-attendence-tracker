/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet } from "@/lib/service-client";

// ============================================
// TYPES
// ============================================

export interface DailyReport {
  date: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  lateCount: number;
  earlyLeaveCount: number;
  departmentBreakdown: Record<string, { present: number; absent: number }>;
  attendanceRecords: any[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalEmployees: number;
  averageAttendance: number;
  dailyBreakdown: Array<{
    date: string;
    present: number;
    absent: number;
  }>;
  topAttendees: any[];
  frequentAbsentees: any[];
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalWorkingDays: number;
  averageAttendance: number;
  employeeStats: any[];
  departmentStats: any[];
  trends: any[];
}

export interface EmployeeReport {
  employee: {
    id: string;
    name: string;
    employeeId: string;
  };
  period: {
    start: string;
    end: string;
  };
  statistics: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
    lateDays: number;
    averageWorkingHours: number;
  };
  attendanceRecords: any[];
}

export interface DepartmentReport {
  departments: Array<{
    name: string;
    employeeCount: number;
    averageAttendance: number;
    topPerformers: any[];
    needsImprovement: any[];
  }>;
  comparison: {
    bestDepartment: string;
    worstDepartment: string;
  };
}

export interface AttendanceSummary {
  overall: {
    totalRecords: number;
    averageAttendance: number;
  };
  thisMonth: {
    attendanceRate: number;
    trend: "up" | "down" | "stable";
  };
  lastMonth: {
    attendanceRate: number;
  };
}

export interface DayWiseAttendance {
  days: Array<{
    date: string;
    presentList: Array<{ employeeId: string; name: string }>;
    absentList: Array<{ employeeId: string; name: string }>;
    presentCount: number;
    absentCount: number;
  }>;
}

// ============================================
// DAILY REPORTS
// ============================================

/**
 * Get daily report
 * GET /reports/daily
 */
export const GetDailyReport = async (date?: string) => {
  const queryParam = date ? `?date=${date}` : "";
  return apiGet<DailyReport>(
    `/reports/daily${queryParam}`,
    {
      next: {
        tags: ["daily-report"],
      },
    },
    "Failed to fetch daily report"
  );
};

/**
 * Download daily report PDF
 * GET /reports/daily/pdf
 */
export const GetDailyReportPDF = async (date: string) => {
  try {
    const result = await apiGet<Blob>(
      `/reports/daily/pdf?date=${date}`,
      {},
      "Failed to generate daily report"
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        filename: `daily-report-${date}.pdf`,
      };
    }

    return {
      success: false,
      error: result.message || "Failed to generate daily report",
    };
  } catch (error: any) {
    console.error("Error fetching daily report:", error);
    return {
      success: false,
      error: error.message || "Failed to generate daily report",
    };
  }
};

// ============================================
// WEEKLY REPORTS
// ============================================

/**
 * Get weekly report
 * GET /reports/weekly
 */
export const GetWeeklyReport = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const queryString = params.toString();
  return apiGet<WeeklyReport>(
    `/reports/weekly${queryString ? `?${queryString}` : ""}`,
    {
      next: {
        tags: ["weekly-report"],
      },
    },
    "Failed to fetch weekly report"
  );
};

/**
 * Download weekly report PDF
 * GET /reports/weekly/pdf
 */
export const GetWeeklyReportPDF = async (startDate: string) => {
  try {
    const result = await apiGet<Blob>(
      `/reports/weekly/pdf?startDate=${startDate}`,
      {},
      "Failed to generate weekly report"
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        filename: `weekly-report-${startDate}.pdf`,
      };
    }

    return {
      success: false,
      error: result.message || "Failed to generate weekly report",
    };
  } catch (error: any) {
    console.error("Error fetching weekly report:", error);
    return {
      success: false,
      error: error.message || "Failed to generate weekly report",
    };
  }
};

// ============================================
// MONTHLY REPORTS
// ============================================

/**
 * Get monthly report
 * GET /reports/monthly
 */
export const GetMonthlyReport = async (month?: number, year?: number) => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());
  
  const queryString = params.toString();
  return apiGet<MonthlyReport>(
    `/reports/monthly${queryString ? `?${queryString}` : ""}`,
    {
      next: {
        tags: ["monthly-report"],
      },
    },
    "Failed to fetch monthly report"
  );
};

/**
 * Download monthly report PDF
 * GET /reports/monthly/pdf
 */
export const GetMonthlyReportPDF = async (year: number, month: number) => {
  try {
    const result = await apiGet<Blob>(
      `/reports/monthly/pdf?year=${year}&month=${month}`,
      {},
      "Failed to generate monthly report"
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        filename: `monthly-report-${year}-${month
          .toString()
          .padStart(2, "0")}.pdf`,
      };
    }

    return {
      success: false,
      error: result.message || "Failed to generate monthly report",
    };
  } catch (error: any) {
    console.error("Error fetching monthly report:", error);
    return {
      success: false,
      error: error.message || "Failed to generate monthly report",
    };
  }
};

// ============================================
// EMPLOYEE REPORTS
// ============================================

/**
 * Get employee report
 * GET /reports/employee/:employeeId
 */
export const GetEmployeeReport = async (
  employeeId: string,
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const queryString = params.toString();
  return apiGet<EmployeeReport>(
    `/reports/employee/${employeeId}${queryString ? `?${queryString}` : ""}`,
    {
      next: {
        tags: ["employee-report"],
      },
    },
    "Failed to fetch employee report"
  );
};

/**
 * Download employee report PDF
 * GET /reports/employee/:employeeId/pdf
 */
export const GetEmployeeReportPDF = async (
  employeeId: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    
    const queryString = params.toString();
    const result = await apiGet<Blob>(
      `/reports/employee/${employeeId}/pdf${queryString ? `?${queryString}` : ""}`,
      {},
      "Failed to generate employee report"
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        filename: `employee-report-${employeeId}.pdf`,
      };
    }

    return {
      success: false,
      error: result.message || "Failed to generate employee report",
    };
  } catch (error: any) {
    console.error("Error fetching employee report:", error);
    return {
      success: false,
      error: error.message || "Failed to generate employee report",
    };
  }
};

// ============================================
// DEPARTMENT REPORTS
// ============================================

/**
 * Get department report
 * GET /reports/department
 */
export const GetDepartmentReport = async (
  startDate?: string,
  endDate?: string,
  department?: string
) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (department) params.append("department", department);
  
  const queryString = params.toString();
  return apiGet<DepartmentReport>(
    `/reports/department${queryString ? `?${queryString}` : ""}`,
    {
      next: {
        tags: ["department-report"],
      },
    },
    "Failed to fetch department report"
  );
};

/**
 * Download department report PDF
 * GET /reports/department/pdf
 */
export const GetDepartmentReportPDF = async (
  startDate?: string,
  endDate?: string,
  department?: string
) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (department) params.append("department", department);
    
    const queryString = params.toString();
    const result = await apiGet<Blob>(
      `/reports/department/pdf${queryString ? `?${queryString}` : ""}`,
      {},
      "Failed to generate department report"
    );

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        filename: `department-report.pdf`,
      };
    }

    return {
      success: false,
      error: result.message || "Failed to generate department report",
    };
  } catch (error: any) {
    console.error("Error fetching department report:", error);
    return {
      success: false,
      error: error.message || "Failed to generate department report",
    };
  }
};

// ============================================
// SUMMARY REPORTS
// ============================================

/**
 * Get attendance summary
 * GET /reports/summary
 */
export const GetAttendanceSummary = async () => {
  return apiGet<AttendanceSummary>(
    "/reports/summary",
    {
      next: {
        tags: ["attendance-summary"],
      },
    },
    "Failed to fetch attendance summary"
  );
};

/**
 * Get day-wise attendance
 * GET /reports/day-wise
 */
export const GetDayWiseAttendance = async (
  startDate?: string,
  endDate?: string,
  limit: number = 30
) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("limit", limit.toString());
  
  const queryString = params.toString();
  return apiGet<DayWiseAttendance>(
    `/reports/day-wise?${queryString}`,
    {
      next: {
        tags: ["day-wise-attendance"],
      },
    },
    "Failed to fetch day-wise attendance"
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Helper function to download blob as file
 */
export const downloadPDFReport = async (blob: Blob, filename: string) => {
  // Check if we're in the browser environment
  if (typeof window === "undefined") {
    console.error("downloadPDFReport can only be used in browser environment");
    return;
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

