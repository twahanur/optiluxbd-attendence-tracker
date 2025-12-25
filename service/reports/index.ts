/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/config";
import { getValidToken } from "@/utills/getCookie";

// Utility function to get cookie value

export const GetDailyReportPDF = async (date: string) => {
  try {
    const authToken = await getValidToken();

    const res = await fetch(
      `${config.next_public_base_api}/reports/daily/pdf?date=${date}`,
      {
        method: "GET",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch daily report: ${res.statusText}`);
    }

    // Return blob for PDF download
    const blob = await res.blob();
    return {
      success: true,
      data: blob,
      filename: `daily-report-${date}.pdf`,
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
    const authToken = await getValidToken();

    const res = await fetch(
      `${config.next_public_base_api}/reports/weekly/pdf?startDate=${startDate}`,
      {
        method: "GET",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch weekly report: ${res.statusText}`);
    }

    // Return blob for PDF download
    const blob = await res.blob();
    return {
      success: true,
      data: blob,
      filename: `weekly-report-${startDate}.pdf`,
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
    const authToken = await getValidToken();

    const res = await fetch(
      `${config.next_public_base_api}/reports/monthly/pdf?year=${year}&month=${month}`,
      {
        method: "GET",
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch monthly report: ${res.statusText}`);
    }

    // Return blob for PDF download
    const blob = await res.blob();
    return {
      success: true,
      data: blob,
      filename: `monthly-report-${year}-${month
        .toString()
        .padStart(2, "0")}.pdf`,
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
export const downloadPDFReport = (blob: Blob, filename: string) => {
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
