import AdminHomePage from "@/component/home/adminHomePage/AdminHomePage";
import { GetStatistics } from "@/service/admin";

const DashboardPage = async () => {
  const result = await GetStatistics();
  const data = result?.data || {
    attendancePercentageToday: 0,
    notAttendedEmployees: [],
    recentAttendances: [],
    totalAttendedToday: 0,
    totalEmployees: 0,
    totalNotAttendedToday: 0,
  };

  return (
    <section>
      <AdminHomePage data={data} />
    </section>
  );
};

export default DashboardPage;
