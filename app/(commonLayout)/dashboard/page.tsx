import { Suspense } from "react";
import AdminHomePage from "@/component/home/adminHomePage/AdminHomePage";
import { GetStatistics } from "@/service/admin";
import { getAttendanceChartData } from "@/service/attendence/getChartData";
import { TStatsArray } from "@/type/attendenceStatsArray";

// Loading component
function DashboardLoading() {
  return (
    <section className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-center gap-2 py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-white"></div>
            <p className="text-lg text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Data fetcher component
async function DashboardContent() {
  let data: TStatsArray | null = null;
  let chartData = null;
  let error: string | null = null;

  try {
    
    // Fetch dashboard statistics and chart data in parallel
    const [statsResult, chartResult] = await Promise.all([
      GetStatistics(),
      getAttendanceChartData(90)
    ]);
    

    // Validate statistics response
    if (!statsResult) {
      error = "No data received from server";
    } else if (statsResult.error) {
      // Check for API errors
      error = statsResult.error;
    } else if (statsResult.data && statsResult.data.dashboard) {
      // Extract and validate data from response (nested under dashboard)

      const dashboardData = statsResult.data.dashboard;

      // Validate each field exists and has correct type
      data = {
        totalEmployees: typeof dashboardData.totalEmployees === "number" ? dashboardData.totalEmployees : 0,
        totalAttendedToday: typeof dashboardData.totalAttendedToday === "number" ? dashboardData.totalAttendedToday : 0,
        totalNotAttendedToday: typeof dashboardData.totalNotAttendedToday === "number" ? dashboardData.totalNotAttendedToday : 0,
        attendancePercentageToday: typeof dashboardData.attendancePercentageToday === "number" ? dashboardData.attendancePercentageToday : 0,
        recentAttendances: Array.isArray(dashboardData.recentAttendances) ? dashboardData.recentAttendances : [],
        notAttendedEmployees: Array.isArray(dashboardData.notAttendedEmployees) ? dashboardData.notAttendedEmployees : [],
      };

    } else {
      error = "Invalid response format";
    }

    // Extract chart data if available
    if (chartResult.success && chartResult.data) {
      chartData = chartResult.data;
    } else {
      console.warn("[DashboardContent] Chart data not available, using demo data");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data";
    console.error("[DashboardContent] Exception:", errorMessage, err);
    error = errorMessage;
  }

  // Pass both data and chart data to AdminHomePage
  return <AdminHomePage data={data} chartData={chartData} error={error} />;
}

// Main page component with Suspense
export default function DashboardPage() {
  return (
    <section>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </section>
  );
}
