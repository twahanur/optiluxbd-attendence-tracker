"use client";

import { AttendanceChartInteractive } from "@/components/attendance-chart-interactive";
import type { AttendanceChartData } from "@/service/attendence/getChartData";
import DataTable from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { TStatsArray } from "@/type/attendenceStatsArray";
import { useEffect } from "react";

interface AdminHomePageProps {
  data: TStatsArray | null;
  chartData?: AttendanceChartData[] | null;
  error?: string | null;
  isLoading?: boolean;
}

const AdminHomePage = ({ data, chartData, error, isLoading = false }: AdminHomePageProps) => {
  // Log data updates for debugging
 

  // Loading state
  if (isLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white"></div>
              <p className="text-gray-400">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show even if there's partial data
  if (error) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-4">
              <p className="text-red-400">
                <span className="font-semibold">Error:</span> {error}
              </p>
              <p className="mt-2 text-sm text-red-300">
                Please refresh the page or contact support if the problem persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state - only show if no error and no data
  if (!data) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-4">
              <p className="text-yellow-400">
                <span className="font-semibold">No Data:</span> Dashboard data is not available
              </p>
              <p className="mt-2 text-sm text-yellow-300">
                No data was returned from the server. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render dashboard with real data only
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Statistics Cards */}
        <SectionCards data={data} />

        {/* Attendance Chart - Uses real data if available, otherwise demo data */}
        <div className="px-4 lg:px-6">
          <AttendanceChartInteractive data={chartData || undefined} />
        </div>

        {/* Data Tables: Recent Attendances & Absent Employees */}
        <DataTable data={data} />
      </div>
    </div>
  );
};

export default AdminHomePage;
