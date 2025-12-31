import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAttendanceStats } from "@/const/statsData";

const moodColors: Record<string, string> = {
  EXCELLENT: "text-green-400",
  GOOD: "text-emerald-400",
  AVERAGE: "text-yellow-400",
  POOR: "text-orange-400",
  TERRIBLE: "text-red-400",
};

const MoodDistribution = () => {
  const { currentMonthAttendance } = mockAttendanceStats;
  return (
    <div className="w-full space-y-3">
      {/* Mood Distribution */}
      <Card className="bg-white/5 backdrop-blur-xl sm:col-span-2 text-white p-4 gap-2">
        <CardHeader className="px-0">
          <CardTitle className="text-base">Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-0">
          {Object.entries(currentMonthAttendance.moodDistribution).map(
            ([mood, count]) => (
              <div key={mood} className="flex justify-between text-xs">
                <span className={moodColors[mood]}>{mood}</span>
                <span>{count}</span>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Shift Distribution */}
      <Card className="bg-white/5 backdrop-blur-xl sm:col-span-2 text-white p-4 gap-2">
        <CardHeader className="px-0">
          <CardTitle className="text-base">Shift Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-0">
          {Object.entries(currentMonthAttendance.shiftDistribution).map(
            ([shift, count]) => (
              <div key={shift} className="flex justify-between text-xs">
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

export default MoodDistribution;
