"use server";

import { config } from "@/config";
import { getValidToken } from "@/service/auth/validToken";

export interface AttendanceChartData {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export const getAttendanceChartData = async (days: number = 90) => {
  try {
    const authToken = await getValidToken();
    const res = await fetch(
      `${config.next_public_base_api}/attendance/chart?days=${days}`,
      {
        method: "GET",
        next: {
          tags: ["attendance-chart"],
          revalidate: 300, // Revalidate every 5 minutes
        },
        headers: {
          ...(authToken && { Authorization: authToken }),
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch chart data: ${res.status}`);
    }

    const result = await res.json();
    
    console.log("[getAttendanceChartData] API Response:", result);
    
    // Check if data is directly in result.data (array format)
    if (result.success && Array.isArray(result.data)) {
      console.log("[getAttendanceChartData] Found data array with", result.data.length, "items");
      return {
        success: true,
        data: result.data as AttendanceChartData[],
      };
    }
    
    // Check if data is nested under result.data.chartData (object format)
    if (result.success && result.data && result.data.chartData) {
      console.log("[getAttendanceChartData] Found nested chartData with", result.data.chartData.length, "items");
      return {
        success: true,
        data: result.data.chartData as AttendanceChartData[],
      };
    }

    console.warn("[getAttendanceChartData] Invalid response format:", result);
    return {
      success: false,
      error: result.message || "Failed to fetch chart data",
      data: null,
    };
  } catch (error: unknown) {
    console.error("getAttendanceChartData error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch chart data",
      data: null,
    };
  }
};
