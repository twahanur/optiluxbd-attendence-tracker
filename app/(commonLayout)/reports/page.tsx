import { cookies } from "next/headers";
import { config } from "@/config";
import ReportsClient from "./ReportsClient";

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

// Server-side data fetching function
async function fetchDepartmentReportServer(
  startDate: string,
  endDate: string
): Promise<{ data: DepartmentReport[]; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return { data: [], error: "Authentication required" };
    }

    const response = await fetch(
      `${config.next_public_base_api}/reports/department?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching for dynamic data
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ReportData> = await response.json();

    if (result.success && result.data) {
      return { data: result.data.report };
    } else {
      return {
        data: [],
        error: result.message || "Failed to load report",
      };
    }
  } catch (error) {
    console.error("Error fetching department report:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to load department report",
    };
  }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  // Get today's date as default
  const today = new Date().toISOString().split("T")[0];
  
  // Await searchParams
  const params = await searchParams;
  const startDate = params.startDate || today;
  const endDate = params.endDate || today;

  // Fetch data on the server
  const { data, error } = await fetchDepartmentReportServer(startDate, endDate);

  // Pass data to the client component for rendering
  return (
    <ReportsClient
      initialData={data}
      initialStartDate={startDate}
      initialEndDate={endDate}
      error={error}
    />
  );
}