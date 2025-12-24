import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { GetStatistics } from "@/service/admin";
import { useEffect, useState } from "react";

const AdminHomePage = () => {
  const [statsCardData, setStatsCardData] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await GetStatistics();
        console.log("API Response:", res);

        if (res?.success && res?.data?.dashboard) {
          const {
            attendancePercentageToday,
            totalAttendedToday,
            totalEmployees,
            totalNotAttendedToday,
            notAttendedEmployees,
            recentAttendances,
          } = res.data.dashboard;

          setStatsCardData({
            attendancePercentageToday,
            totalAttendedToday,
            totalEmployees,
            totalNotAttendedToday,
          });

          setAttendanceData({
            notAttendedEmployees: notAttendedEmployees || [],
            recentAttendances: recentAttendances || [],
          });

          console.log("Attendance Data Set:", {
            notAttendedEmployees: notAttendedEmployees || [],
            recentAttendances: recentAttendances || [],
          });
        } else {
          console.error("Failed to fetch statistics:", res);
          setError("Failed to load attendance data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards stastCardData={statsCardData} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={attendanceData} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminHomePage;
