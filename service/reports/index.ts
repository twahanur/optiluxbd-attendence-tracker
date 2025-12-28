/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet } from "@/lib/service-client";

export const GetDepartmentReport = async (
  startDate?: string,
  endDate?: string,
) => {
  // If no dates provided, use today as default
  const today = new Date().toISOString().split("T")[0];
  const start = startDate || today;
  const end = endDate || today;

  return apiGet(
    `/reports/department?startDate=${start}&endDate=${end}`,
    {
      next: {
        tags: ["department-report"],
      },
    },
    "Failed to fetch department report"
  );
};

export const GetDailyReportPDF = async (date: string) => {
  try {
    const result = await apiGet<Blob>(`/reports/daily/pdf?date=${date}`, {}, "Failed to generate daily report");
    
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

export const GetWeeklyReportPDF = async (startDate: string) => {
  try {
    const result = await apiGet<Blob>(`/reports/weekly/pdf?startDate=${startDate}`, {}, "Failed to generate weekly report");
    
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

export const GetMonthlyReportPDF = async (year: number, month: number) => {
  try {
    const result = await apiGet<Blob>(`/reports/monthly/pdf?year=${year}&month=${month}`, {}, "Failed to generate monthly report");
    
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

// Helper function to download blob as file
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
