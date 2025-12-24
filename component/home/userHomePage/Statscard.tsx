import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAttendanceStats } from "@/const/statsData";

const moodColors: Record<string, string> = {
  EXCELLENT: "text-green-400",
  GOOD: "text-emerald-400",
  AVERAGE: "text-yellow-400",
  POOR: "text-orange-400",
  TERRIBLE: "text-red-400",
};

const Statscard = () => {
  const { totalAttendanceDays, currentMonthAttendance } = mockAttendanceStats;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Attendance */}
      <Card className="bg-white/5 backdrop-blur-xl text-white">
        <CardHeader>
          <CardTitle className="text-sm ">Total Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalAttendanceDays}</p>
          <p className="text-xs ">Days attended overall</p>
        </CardContent>
      </Card>

      {/* Monthly Attendance */}
      <Card className="bg-white/5 backdrop-blur-xl text-white">
        <CardHeader>
          <CardTitle className="text-sm ">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {currentMonthAttendance.attendedDays} /{" "}
            {currentMonthAttendance.totalDays}
          </p>
          <p className="text-xs  mt-1">{currentMonthAttendance.month}</p>
        </CardContent>
      </Card>

      {/* Attendance Percentage */}
      <Card className="bg-white/5 backdrop-blur-xl text-white">
        <CardHeader>
          <CardTitle className="text-sm ">Attendance %</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {currentMonthAttendance.attendancePercentage}%
          </p>
          <div className="w-full h-2 bg-white/10 rounded-full mt-2">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{
                width: `${currentMonthAttendance.attendancePercentage}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Month & Year */}
      <Card className="bg-white/5 backdrop-blur-xl text-white">
        <CardHeader>
          <CardTitle className="text-sm ">Period</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{currentMonthAttendance.year}</p>
          <p className="text-sm ">{currentMonthAttendance.month}</p>
        </CardContent>
      </Card>

      {/* Mood Distribution */}
      <Card className="bg-white/5 backdrop-blur-xl sm:col-span-2 text-white">
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(currentMonthAttendance.moodDistribution).map(
            ([mood, count]) => (
              <div key={mood} className="flex justify-between text-sm">
                <span className={moodColors[mood]}>{mood}</span>
                <span>{count}</span>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Shift Distribution */}
      <Card className="bg-white/5 backdrop-blur-xl sm:col-span-2 text-white">
        <CardHeader>
          <CardTitle>Shift Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(currentMonthAttendance.shiftDistribution).map(
            ([shift, count]) => (
              <div key={shift} className="flex justify-between text-sm">
                <span>{shift}</span>
                <span>{count}</span>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statscard;
